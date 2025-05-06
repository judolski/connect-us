import mongoose, { Schema } from "mongoose";
import "./role";

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, unique: true, required: true },
    email: { type: String, default: null, unique: true, required: false },
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

// UserSchema.index({ email: 1 });
// UserSchema.index({ phoneNumber: 1 });
UserSchema.index({ roleId: 1 });
UserSchema.index({ status: 1, isDeleted: 1 });

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
