import { NextResponse } from "next/server";
import { encryptPassword } from "../../../utils/auth";
import { User } from "@/models/user";
import mongoose from "mongoose";
import { Role } from "@/models/role";
import { ResponseBody } from "@/utils/apiResponse";
import { statusCodes } from "@/constants/error";

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

    const response = new User({
      ...req.body,
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
    session.endSession();
    return NextResponse.json(ResponseBody(statusCodes.OK, response));
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      ResponseBody(
        statusCodes.INTERNAL_SERVER_ERROR,
        null,
        `Unable to complete your request.\n ${err}`
      )
    );
  }
};
