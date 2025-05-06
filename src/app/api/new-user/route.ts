import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { User } from "@/models/user";
import { statusCodes } from "@/constants/error";
import { Role } from "@/models/role";
import { ResponseBody } from "@/utils/apiResponse";
import { encryptPassword } from "@/utils/auth";

export async function POST(req: Request) {
  await connectToDatabase();

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const body = await req.json();
    Object.entries(body).forEach(([key, value]) => {
      if (typeof value === "string") {
        body[key] = value.trim();
      }
    });

    const { phoneNumber, email, password } = body;

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

      return NextResponse.json(
        ResponseBody(
          statusCodes.CONFLICT,
          null,
          `${existingValue} already exist in the system`
        )
      );
    }

    const passwordHarsh = await encryptPassword(password);
    if (!passwordHarsh) {
      return NextResponse.json(
        ResponseBody(
          statusCodes.INTERNAL_SERVER_ERROR,
          null,
          `Unable to complete your request`
        )
      );
    }

    const roles = await Role.findOne({ name: "User" });

    if (!roles) {
      return NextResponse.json(
        ResponseBody(
          statusCodes.BAD_REQUEST,
          null,
          "Default role 'User' not found"
        )
      );
    }

    const response = new User({
      ...body,
      password: passwordHarsh,
      roleId: roles._id,
    });

    await response.save({ session });

    if (!response) {
      return NextResponse.json(
        ResponseBody(
          statusCodes.INTERNAL_SERVER_ERROR,
          null,
          `Unable to complete your request`
        )
      );
    }

    await session.commitTransaction();
    return NextResponse.json(ResponseBody(statusCodes.OK, response));
  } catch (err) {
    return NextResponse.json(
      ResponseBody(
        statusCodes.INTERNAL_SERVER_ERROR,
        null,
        `Unable to complete your request.\n ${err}`
      )
    );
  } finally {
    session.endSession();
  }
}
