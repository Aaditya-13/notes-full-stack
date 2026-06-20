import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { options } from "../utils/httpOptions.js";
import { Note } from "../models/note.model.js";

const getNoteByIdAndVerifyOwner = async(noteId, userId) => {

  if(!noteId){
    throw new ApiError(400, "Note ID is required")
  }

  const note = await Note.findById(noteId);

  if(!note){
    throw new ApiError(404, "Note not found")
  }

  if(note.owner.toString() !== userId.toString()){
    throw new ApiError(403, "Access Denied")
  }

  return note
}


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

const getNotes = asyncHandler(async(req, res) => {
  const owner = req.user._id;

  const notes = await Note
    .find({owner})
    .sort({
      isPinned: -1,
      updatedAt: -1
    });

  return res
    .status(200)
    .json(
      new ApiResponse(200, notes, "Notes Successfully Fetched!!")
    )
})

const getNoteById = asyncHandler(async(req, res) => {

  const note = getNoteByIdAndVerifyOwner(req.params.id. req.user._id);

  return res 
    .status(200)
    .json(
      new ApiResponse(200, note, "Note fetched successfully")
    )
})



export {
  createNote,
  getNotes,
  getNoteById
}