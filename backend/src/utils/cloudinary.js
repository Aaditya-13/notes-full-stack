import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})


const uploadOnCloudinary = async (localFilePath) => {
  try {
    console.log("File path received!!", localFilePath);

    if (!localFilePath) return null;
    console.log("waiting for response...");

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    })

    console.log("file uploaded on cloudinary", response.url);
    fs.unlinkSync(localFilePath);
    return response;

  } catch (error) {
    console.log("CLOUDINARY ERROR:", error);

    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
}

export { uploadOnCloudinary }