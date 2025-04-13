import mongoose, { Schema } from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      default: null,
    },
    message: String,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

MessageSchema.virtual("user", {
  ref: "User", // Reference the User model
  localField: "userId", // Field in the current schema
  foreignField: "_id", // Field in the referenced schema
  justOne: true, // Retrieve a single object
});

export const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);
