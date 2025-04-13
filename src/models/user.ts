import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: String,
    LastName: String,
    Email: String,
    username: String,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
