import mongoose, { Schema } from "mongoose";
import "./user";

const ChatListSchema = new mongoose.Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      default: null,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      default: null,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ChatListSchema.pre("find", function (next) {
  this.select("-__v -isDeleted -password");
  next();
});

ChatListSchema.pre("findOne", function (next) {
  this.select("-__v -isDeleted -password");
  next();
});

export const ChatList =
  mongoose.models.ChatList || mongoose.model("ChatList", ChatListSchema);
