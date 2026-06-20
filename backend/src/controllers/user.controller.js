import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { options } from "../utils/httpOptions.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async(userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave : false})
    return {accessToken, refreshToken};
  } catch (error) {
    throw new ApiError(500, error?.message || "Something went wrong while generating access & refresh token")
  }
}

const registerUser = asyncHandler(async (req, res) => {

  //take input details from user
  const username = req.body.username?.trim()?.toLowerCase();
  const email = req.body.email?.trim()?.toLowerCase();
  const password = req.body.password?.trim();
  
  
  //validate inputs username, email, password (compulsory fields)
  if([username, email, password].some(
    (field) => !field || field.trim() === ""
  )){
    throw new ApiError(400, "username, email, password are required!!")
  }

  //check if user exists
  const existingUser = await User.findOne({
    $or: [{username}, {email}]
  });

  if(existingUser){
    throw new ApiError(409, "user already exists")
  }

  //handle fullname and avatar (optional fields)
  const fullName = req.body.fullName?.trim() || "";  

  const avatarLocalPath = req.files?.avatar?.[0]?.path
  
  //upload avatar to cloudinary
  const avatar = avatarLocalPath
    ? await uploadOnCloudinary(avatarLocalPath)
    : null;


  //create user object - create entry in db
  const user = await User.create({
    username,
    email,
    password,
    fullName,
    avatar: avatar?.url || ""
  })

  //get created user from db and check if user successfully created(omit password & refresh token)
  const createdUser = await User.findById(user._id).select("-password -refreshToken")

  if(!createdUser){
    throw new ApiError(500, "Something Went Wrong, user not created!!")
  }
  
  //return response to user 
  return res
    .status(201)
    .json(
      new ApiResponse(201,
          createdUser,
        "User created successfully!!"
      )
    )
  //do not forget to use **await**
})


const loginUser = asyncHandler(async(req, res) => {

  //get username/email + password
  const username = req.body.username?.trim()?.toLowerCase();
  const email = req.body.email?.trim()?.toLowerCase();
  const password = req.body.password?.trim();

  //verify the fields
  if(!username && !email){
    throw new ApiError(400, "Email or Username is required!!")
  }
  if(!password){
    throw new ApiError(400, "password is required!!")
  }

  //check if user exist
  const user = await User.findOne({
    $or: [{username}, {email}]
  }).select("-refreshToken")

  if(!user){
    throw new ApiError(404, "user not found!!")
  }

  //verify password
  const isValidPassword = await user.isPasswordCorrect(password)

  if(!isValidPassword){
    throw new ApiError(401, "Invalid Credentials!!")
  }

  //generate access and refresh token
  const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user?._id)

  const loggedInUser = await User.findById(user?._id).select("-password -refreshToken")

  //send access and refreshtoken to user
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200,{
        user: loggedInUser, accessToken, refreshToken
      },
      "User LoggedIn Successfully"
    ))
})

const getCurrentUser = asyncHandler(async(req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200,
        req.user,
        "Current User Successfully Fetched"
      )
    )
})

const logoutUser = asyncHandler(async(req, res) => {

  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset:{
        refreshToken: 1
      }
    }
  )

  return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(200, {}, "User LoggedOut Successfully!!")
    )
  
})

const changePassword = asyncHandler(async(req, res) => {
  //get new & old password
  const oldPassword = req.body.oldPassword?.trim();
  const newPassword = req.body.newPassword?.trim();

  //check if not empty
  if(!oldPassword || !newPassword){
    throw new ApiError(
      400,
      "Old password and new password are required"
    )
  }

  //check of similarity
  if (oldPassword === newPassword) {
    throw new ApiError(
      400,
      "New password must be different from old password"
    )
  }

  //get the user by id, because req.user doesnt have password
  const user = await User.findById(req.user._id).select("-refreshToken")

  //check password validity
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect){
    throw new ApiError(401, "Invalid Password!!")
  }

  //update password dont forget await
  user.password = newPassword

  await user.save({validateBeforeSave:false})


  //return response
  return res.status(200).json(
    new ApiResponse(200,{},"Password Changed Successfully !!")
  )
})

const updateDetails = asyncHandler(async(req, res) => {
  //get fullName or email
  const fullName = req.body.fullName?.trim();
  const email = req.body.email?.trim()?.toLowerCase();

  //check for empty fields => both empty => throw error
  if(!email && !fullName){
    throw new ApiError(400, "All fields required!!")
  }

  //load user
  const user = req.user;

  //if fullName exist change fullName
  if(fullName){
    user.fullName = fullName
  }

  //if email exist change email & but check for conflict
  if (email) {
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      throw new ApiError(409, "Email already in use");
    }
    user.email = email
  }

  //save user
  await user.save({validateBeforeSave:false});

  //return response
  return res
    .status(200)
    .json(
      new ApiResponse(200, {
          email : user.email,
          fullName : user.fullName
      }, "Details Updated Successfully !!")
    )
})

const updateAvatar = asyncHandler(async(req, res) => {
  //get avatar local path
  const avatarLocalPath = req.files?.avatar?.[0]?.path

  //valid path
  if(!avatarLocalPath){
    throw new ApiError(400, "Invalid Path or Field")
  }

  //upload avatar to cloudinary
  const avatar = avatarLocalPath
    ? await uploadOnCloudinary(avatarLocalPath)
    : null;

  //valid avatar
  if (!avatar) {
    throw new ApiError(500, "Avatar upload failed")
  }

  //get user
  const user = req.user

  //update avatar, since avatar verified no need for avatar?.url || ""
  user.avatar = avatar.url

  //save
  await user.save({validateBeforeSave: false});

  //return response
  return res
    .status(200)
    .json(
      new ApiResponse(200, 
        {
          avatar : avatar.url
        },
        "Avatar Updated Successfully"
      )
    )
})


const refreshAccessToken = asyncHandler(async(req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body?.refreshToken

  if(!incomingRefreshToken){
    throw new ApiError(401, "unauthorized request!!")
  }

  const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)


  const user = await User.findById(decodedToken?._id).select("-password")

  if (!user) {
    throw new ApiError(401, "Invalid Refresh Token");
  }

  if(incomingRefreshToken !== user.refreshToken){
    throw new ApiError(401, "Refresh Token is Expired or Used!!")
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user?._id)


  return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        accessToken, refreshToken
      },
        "Access Token Successfully Refreshed")
    )

})

export {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  changePassword,
  updateDetails,
  updateAvatar,
  refreshAccessToken
}
