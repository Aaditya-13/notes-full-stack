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
          name: {
            type: String,
            lowercase: true,
            trim: true
          },

          color: {
            type: String,
            default: "#7c3aed"
          }
        }
      ],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export const Note = mongoose.model("Note", noteSchema);