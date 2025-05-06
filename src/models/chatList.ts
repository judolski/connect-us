import mongoose, { Schema } from "mongoose";
import "./user";

const ChatListSchema = new mongoose.Schema(
  {
    userA: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userB: { type: Schema.Types.ObjectId, ref: "User", required: true },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ChatListSchema.index({ userA: 1, userB: 1 }, { unique: true }); // Prevent duplicates

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
