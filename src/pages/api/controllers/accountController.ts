import { NextRequest } from "next/server";
import { encryptPassword } from "../../../utils/auth";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next/types";
import { User } from "@/models/user";
import mongoose from "mongoose";
import { Role } from "@/models/role";

export const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    Object.entries(req.body).map(([key, value]) => {
      if (typeof value === "string") {
        req.body[key] = value.trim();
      }
    });

    const { firstName, LastName, phoneNumber, email, password } = req.body;

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
      return res.status(409).json({
        success: false,
        statusCode: 409,
        data: null,
        message: `${existingValue} already exist in the system`,
      });
    }

    const passwordHarsh = await encryptPassword(password);
    if (!passwordHarsh) {
      return res.status(400).json({
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
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Unable to complete your request",
        data: null,
      });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: response,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err });
  }
};
