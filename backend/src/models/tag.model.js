import mongoose, { Schema } from "mongoose";

const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tag name is required"],
      trim: true,
      lowercase: true
    },

    color: {
      type: String,
      required: [true, "Tag color is required"],
      trim: true
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

// prevent duplicate tag names per user
tagSchema.index(
  {
    owner: 1,
    name: 1
  },
  {
    unique: true
  }
);

export const Tag = mongoose.model("Tag", tagSchema);