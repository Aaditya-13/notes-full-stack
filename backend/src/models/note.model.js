import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      default: ""
    },

    content: {
      type: String,
      required: [true, "Note content is required"],
      trim: true
    },

    isPinned: {
      type: Boolean,
      default: false
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    isTrashed: {
      type: Boolean,
      default: false
    },

    isArchived: {
      type: Boolean,
      default: false
    },

    tags: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Tag"
        }
      ],
      default: []
    },
    expireAt: {
      type: Date,
      expires: 0 
    }

  },
  {
    timestamps: true
  }
);

export const Note = mongoose.model("Note", noteSchema);