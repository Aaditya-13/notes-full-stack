import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { options } from "../utils/httpOptions.js";

const generateAccessAndRefreshToken = async(userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave : false})
    return {accessToken, refreshToken};
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access & refresh token")
  }
}

const registerUser = asyncHandler(async (req, res) => {

  //take input details from user
  const username = req.body.username?.trim().toLowerCase();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();
  
  console.log(req.body);
  
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

  console.log("file : \n",req.file);
  console.log("files : ", req.files);

  

  const avatarLocalPath = req.files?.avatar?.[0]?.path

  console.log("local path : ",avatarLocalPath);
  

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
  console.log("user created : \n", createdUser);
  
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
  const username = req.body.username?.trim().toLowerCase();
  const email = req.body.email?.trim().toLowerCase();
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

export {
  registerUser,
  loginUser,
  getCurrentUser
}
