import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
  {
    username:{
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      index: true
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
      required: [true, 'Password is required']
    },
  },
  {timestamps:true}
)


export const User = mongoose.model("User", userSchema);