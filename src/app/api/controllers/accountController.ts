import { NextResponse } from "next/server";
import { encryptPassword } from "../../../utils/auth";
import { User } from "@/models/user";
import mongoose from "mongoose";
import { Role } from "@/models/role";

export const createUser = async (req: Request) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const body = await req.json();
    const { phoneNumber, email, password } = body;

    Object.entries(body).map(([key, value]) => {
      if (typeof value === "string") {
        body[key] = value.trim();
      }
    });

    const emailOrPhoneExist = await User.findOne({
      $or: [
        { email: email }, // Check if the email exists
        { phoneNumber: phoneNumber }, // Check if the phone exists
      ],
    });

    if (emailOrPhoneExist) {
      const existingValue =
        emailOrPhoneExist.email === email
          ? emailOrPhoneExist.email
          : emailOrPhoneExist.phoneNumber;
      return NextResponse.json({
        success: false,
        statusCode: 409,
        data: null,
        message: `${existingValue} already exist in the system`,
      });
    }

    const passwordHarsh = await encryptPassword(password);
    if (!passwordHarsh) {
      return NextResponse.json({
        success: false,
        statusCode: 400,
        message: "Unable to complete your request",
        data: null,
      });
    }

    const roles = await Role.findOne({ name: "User" });

    const response = new User({
      ...req.body,
      password: passwordHarsh,
      roleId: roles._id,
    });

    await response.save({ session });

    if (!response) {
      return NextResponse.json({
        success: false,
        statusCode: 400,
        message: "Unable to complete your request",
        data: null,
      });
    }

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: response,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ success: false, message: err });
  }
};
