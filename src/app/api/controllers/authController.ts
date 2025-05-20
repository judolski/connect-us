import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { User } from "@/models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { ResponseBody } from "@/utils/apiResponse";
import { statusCodes } from "@/constants/error";

const PUBLIC_KEY = process.env.PUBLIC_KEY;

export const isAuthenticated = (req: Response) => {
  const token = req.headers?.get("authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({
      success: false,
      statusCode: 403,
      message: "Unauthorized, no access token provided!",
      data: null,
    });
  }
  try {
    if (typeof token !== "string" || token.trim() === "") {
      throw new Error("Invalid token");
    }
    const decodedUser = jwt.verify(token, PUBLIC_KEY!);
    (req as any).user = decodedUser;
    return true;
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      statusCode: 498,
      message: "Invalid or expired token! Login again.",
      data: null,
    });
  }
};

export const authenticateUser = async (username: string, password: string) => {
  try {
    const checkUser = await User.findOne({
      $or: [{ phoneNumber: username }, { email: username }],
    })
      .populate({
        path: "roleId",
        select: "-__v -isDeleted",
      })
      .exec();

    if (!checkUser) {
      return ResponseBody(statusCodes.UNAUTHORIZED, null, "Invalid user");
    }

    if (password === null || password === "") {
      return ResponseBody(
        statusCodes.UNAUTHORIZED,
        null,
        "Password is required"
      );
    }

    const checkPassword = await bcrypt.compare(password, checkUser.password);

    if (!checkPassword) {
      return ResponseBody(statusCodes.UNAUTHORIZED, null, "Incorrect password");
    }
    return ResponseBody(statusCodes.OK, checkUser);
  } catch (error) {
    const message = error instanceof Error ? error.message : error;
    return ResponseBody(statusCodes.INTERNAL_SERVER_ERROR, null, message);
  }
};
