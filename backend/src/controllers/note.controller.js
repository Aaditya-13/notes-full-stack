import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
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

  const note = await getNoteByIdAndVerifyOwner(req.params.id, req.user._id);

  return res 
    .status(200)
    .json(
      new ApiResponse(200, note, "Note fetched successfully")
    )
})

const deleteNote = asyncHandler(async(req, res) => {

  const note = await getNoteByIdAndVerifyOwner(req.params.id, req.user._id);

  await note.deleteOne();

  return res 
    .status(200)
    .json(
      new ApiResponse(200, {}, "Note Deleted successfully")
    )
})

const pinNote = asyncHandler(async(req, res) => {

  const note = await getNoteByIdAndVerifyOwner(req.params.id, req.user._id);

  note.isPinned = !note.isPinned

  await note.save();

  const message = note.isPinned
  ? "Note pinned successfully"
  : "Note unpinned successfully";

  return res 
    .status(200)
    .json(
      new ApiResponse(200, note, message)
    )
})

const updateNote = asyncHandler(async(req, res) => {
  const title = req.body.title?.trim();
  const content = req.body.content?.trim();

  if(!title && !content ){
    throw new ApiError(400, "At Least One Field is required!!")
  }

  const note = await getNoteByIdAndVerifyOwner(req.params.id, req.user._id);

  title && (note.title = title)
  content && (note.content = content);

  await note.save()

  return res 
    .status(200)
    .json(
      new ApiResponse(200, note, "Note Updated Successfully")
    )

})

const archiveNote = asyncHandler( async (req, res) => {
  const note = await getNoteByIdAndVerifyOwner(req.params.id, req.user._id);

  note.isArchived = !note.isArchived

  if(note.isTrashed){
   note.isTrashed = false;
  }

  let message;

  if (note.isArchived) {

    message = "Note Archived Successfully";

    if (note.isPinned) {
      note.isPinned = false;
      message = "Note Archived & Unpinned Successfully";
    }

  } else {

    message = "Note Restored From Archive Successfully";

  }

  await note.save();


  return res 
    .status(200)
    .json(
      new ApiResponse(200, note, message)
    )
})


const trashNote = asyncHandler( async (req, res) => {

  const note = await getNoteByIdAndVerifyOwner(req.params.id, req.user._id);

  note.isTrashed = !note.isTrashed

  if(note.isArchived){
   note.isArchived = false;
  }

  let message;

  if (note.isTrashed) {

    message = "Note Trashed Successfully";

    if (note.isPinned) {
      note.isPinned = false;
      message = "Note Trashed & Unpinned Successfully";
    }

  } 
  else {
    message = "Note Restored From Trash Successfully";
  }

  await note.save();


  return res 
    .status(200)
    .json(
      new ApiResponse(200, note, message)
    )
})



export {
  createNote,
  getNotes,
  getNoteById,
  deleteNote,
  pinNote,
  updateNote,
  archiveNote,
  trashNote
}