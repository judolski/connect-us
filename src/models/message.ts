import mongoose, { Schema } from "mongoose";
import "./user";

const MessageSchema = new mongoose.Schema(
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
    message: { type: String, required: true },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// MessageSchema.virtual("sender", {
//   ref: "User", // Reference the User model
//   localField: "senderId", // Field in the current schema
//   foreignField: "_id", // Field in the referenced schema
//   justOne: true, // Retrieve a single object
// });
// MessageSchema.virtual("receiver", {
//   ref: "User", // Reference the User model
//   localField: "receiverId", // Field in the current schema
//   foreignField: "_id", // Field in the referenced schema
//   justOne: true, // Retrieve a single object
// });

MessageSchema.pre("find", function (next) {
  this.select("-__v -isDeleted");
  next();
});

MessageSchema.pre("findOne", function (next) {
  this.select("-__v -isDeleted");
  next();
});

export const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);
