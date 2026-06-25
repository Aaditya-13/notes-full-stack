import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { options } from "../utils/httpOptions.js";
import jwt from "jsonwebtoken";
import { Note } from "../models/note.model.js";

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

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong, user not created!!");
  }

  // insert tutorial notes
  await Note.insertMany([
    {
      title: "Welcome to INK & IRON 🦾",
      content: "Welcome to your new workspace. INK & IRON is designed for speed, efficiency, and clarity.\n\n**Getting Started:**\n\n• **Pinning:** Use the pin icon to keep important notes at the top of your dashboard.\n\n• **Editing:** Click on any note card (including this one) to open the editor and update your content.\n\nExplore the interface and start capturing your ideas.",
      owner: user._id,
      isPinned: true,
      tags: [],
    },
    {
      title: "Organizing with Tags 🏷️",
      content: "Tags provide a flexible way to categorize your notes without the constraints of traditional folders.\n\n1. Click **+ New Tag** in the sidebar to create a custom, color-coded label.\n\n2. Apply a tag to a note to add a visual indicator to the top of the card.\n\n3. Use the **Tags Icon** in the top-right corner to filter your view and locate specific notes quickly.\n\n*Note: Deleting a tag globally from the dropdown will automatically remove it from all associated notes in your database.*",
      owner: user._id,
      isPinned: false,
      tags: [],
    },
    {
      title: "Archive & Trash Management 🗄️",
      content: "Maintain a clean workspace by managing notes you no longer actively need.\n\n• **Archive:** Move notes here to hide them from your main dashboard while keeping them safely stored for future reference.\n\n• **Trash:** Deleted notes are temporarily moved to the Trash tab in the sidebar.\n\n⚠️ **Permanent Deletion:** Clicking the delete icon while inside the Trash view will permanently remove the note from the database. This action cannot be undone.",
      owner: user._id,
      isPinned: false,
      tags: [],
    }
  ]);
  
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



const guestLogin = asyncHandler(async (req, res) => {
  // Generate a random credentials for the guest
  const randomString = Math.random().toString(36).substring(2, 8);
  const username = `guest_${randomString}`;
  const email = `${username}@inkandiron.local`;
  const password = `temp_pass_${randomString}`;

  // self-destruct timer for 2 hours from right now
  const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000);

  // create the fake user in the database
  const guestUser = await User.create({
    username,
    email,
    password,
    fullName: "Demo Guest",
    avatar: "", 
    isGuest: true,
    expireAt: twoHoursFromNow 
  });

  if (!guestUser) {
    throw new ApiError(500, "Failed to forge guest account.");
  }


  // insert some notes for demo
  await Note.insertMany([
    {
      title: "Welcome to INK & IRON 🦾",
      content: "This is a Neobrutalist workspace. It doesn't ask politely, it just gets things done. \n\nGo ahead and edit this note. The UI won't break.",
      owner: guestUser._id,
      isPinned: true,
      tags: [],
      expireAt : twoHoursFromNow 
    },
    {
      title: "You can create Tags to organise your notes",
      content: "Click on create tag on left sidebar bar and choose, then add your tag to this note. \n you can filter notes by tag by using button on top right corner",
      owner: guestUser._id,
      isPinned: true,
      tags: [],
      expireAt : twoHoursFromNow 
    },
    {
      title: "The Self-Destruct Sequence ⏳",
      content: "This account is a completely isolated sandbox. You aren't sharing it with anyone else. \n\nIn exactly 2 hours, the backend will vaporize this account and everything you wrote in it to keep the database clean.",
      owner: guestUser._id,
      isPinned: false,
      tags: [],
      expireAt : twoHoursFromNow
    },
    {
      title: "Formatting Test",
      content: "# Big Headers\n\n* Bullet points\n* Look\n* Great\n\n1. Numbers too\n2. Try the toolbar at the bottom of the editor.",
      owner: guestUser._id,
      isPinned: false,
      tags: [],
      expireAt : twoHoursFromNow
    },
    {
      title: "Archived secrets",
      content: "You shouldn't be looking in here.",
      owner: guestUser._id,
      isArchived: true,
      tags: [],
      expireAt : twoHoursFromNow
    },
    {
      title: "Delete",
      content: "You can delete notes from here by clicking on delete button.",
      owner: guestUser._id,
      isTrashed: true,
      tags: [],
      expireAt : twoHoursFromNow     
    }
  ]);

  // generate tokens for guest user
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(guestUser._id);

  const loggedInUser = await User.findById(guestUser._id).select("-password -refreshToken");

  // send response
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loggedInUser, accessToken, refreshToken
      },
      "Guest Sandbox Initialized Successfully"
    ));
});






export {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  changePassword,
  updateDetails,
  updateAvatar,
  refreshAccessToken,
  guestLogin
}
