import { Tag } from "../models/tag.model.js";
import { Note } from "../models/note.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createTag = asyncHandler(async(req, res) => {

  const name = req.body.name?.trim()?.toLowerCase();
  const color = req.body.color?.trim();

  if(!name || !color){
    throw new ApiError(
      400,
      "Tag name and color are required"
    );
  }

  const existingTag = await Tag.findOne({
    owner: req.user._id,
    name
  });

  if(existingTag){
    throw new ApiError(
      409,
      "Tag already exists"
    );
  }

  const tag = await Tag.create({
    name,
    color,
    owner: req.user._id
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      tag,
      "Tag Created Successfully"
    )
  );
});


const getTags = asyncHandler(async(req, res) => {

  const tags = await Tag.find({
    owner: req.user._id
  }).sort({
    name: 1
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      tags,
      "Tags fetched successfully"
    )
  );
});


const updateTag = asyncHandler(async(req, res) => {

  const name = req.body.name?.trim()?.toLowerCase();
  const color = req.body.color?.trim();

  if(!name && !color){
    throw new ApiError(
      400,
      "At least one field required"
    );
  }

  const tag = await Tag.findOne({
    _id: req.params.id,
    owner: req.user._id
  });

  if(!tag){
    throw new ApiError(
      404,
      "Tag not found"
    );
  }

  if(name){
    tag.name = name;
  }

  if(color){
    tag.color = color;
  }

  await tag.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      tag,
      "Tag Updated Successfully"
    )
  );
});

const deleteTag = asyncHandler(async(req, res) => {

  const tag = await Tag.findOne({
    _id: req.params.id,
    owner: req.user._id
  });

  if(!tag){
    throw new ApiError(
      404,
      "Tag not found"
    );
  }

  await Note.updateMany(
    {
      owner: req.user._id
    },
    {
      $pull: {
        tags: tag._id
      }
    }
  );

  await tag.deleteOne();

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Tag Deleted Successfully"
    )
  );
});

export {
  createTag,
  getTags,
  updateTag,
  deleteTag,
}