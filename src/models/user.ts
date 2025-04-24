import mongoose, { Schema } from "mongoose";
import "./role";

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, default: null, required: false },
    password: { type: String, default: null, required: false },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.virtual("role", {
  ref: "Role", // Reference the User model
  localField: "roleId", // Field in the current schema
  foreignField: "_id", // Field in the referenced schema
  justOne: true, // Retrieve a single object
});
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
