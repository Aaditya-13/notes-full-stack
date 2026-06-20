import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"

const userSchema = new Schema(
  {
    username:{
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true
    },
    email:{
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true
    },
    fullName:{
      type:String,
      trim: true
    },
    avatar:{
      type:String, //cloudinary url
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6
    },
    refreshToken: {
      type: String
    }
  },
  {timestamps:true}
)


userSchema.pre("save", async function(){
  if(!this.isModified("password")) return;

  this.password = await bcryptjs.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcryptjs.compare(password, this.password)
}


userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}



userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}


export const User = mongoose.model("User", userSchema);