import mongoose, { Schema } from "mongoose";
import "./user";

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Pre hooks to exclude __v and isDeleted fields
MessageSchema.pre("find", function (next) {
  this.select("-__v -isDeleted");
  next();
});

MessageSchema.pre("findOne", function (next) {
  this.select("-__v -isDeleted");
  next();
});

// Indexing to improve query performance
MessageSchema.index({ senderId: 1, createdAt: -1 });
MessageSchema.index({ receiverId: 1, createdAt: -1 });

// Model Export
export const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);
