import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { options } from "../utils/httpOptions.js";
import { Note } from "../models/note.model.js";


const createNote = asyncHandler(async(req, res) => {

  const title = req.body.title?.trim();
  const content = req.body.content?.trim();

  if(!content){
    throw new ApiError(400, "Content Field is required!!")
  }
  const user = req.user;

  const note = await Note.create({
    title,
    content,
    owner: user._id
  })

  return res
    .status(201)
    .json(
      new ApiResponse(201, note, "Note Successfully Created !!")
    )
})



export {
  createNote
}