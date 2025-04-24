import { NextApiRequest, NextApiResponse } from "next";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import { User } from "@/models/user";
import bcrypt from "bcryptjs";
import { generateToken } from "@/utils/auth";

const PUBLIC_KEY = process.env.PUBLIC_KEY;

export const isAuthenticated = (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).send({
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
    const decodedUser = jwt.verify(token, PUBLIC_KEY!); // Now safely call jwt.verify
    req.user = decodedUser; // Attach the user data to the request
    return true; // Return true if authentication succeeds
  } catch (error) {
    console.log(error);
    return res.status(498).json({
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
      return {
        success: false,
        statusCode: 401,
        message: "Invalid user",
        data: null,
      };
    }

    if (password === null || password === "") {
      return {
        success: false,
        statusCode: 401,
        message: "Password is required",
        data: null,
      };
    }

    const checkPassword = await bcrypt.compare(password, checkUser.password);

    if (!checkPassword) {
      return {
        success: false,
        statusCode: 401,
        data: null,
        message: "Incorrect password",
      };
    }

    const { firstName, LastName, phoneNumber, email, id, role } = checkUser;

    return {
      success: true,
      statusCode: 200,
      message: "Success",
      data: checkUser,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      statusCode: 500,
      message: error instanceof Error ? error.message : error,
      data: null,
    };
  }
};

export const checkUserExist = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { username } = req.body;
  try {
    const checkUser = await User.findOne({
      $or: [{ phone: username }, { email: username }],
    });
    if (!checkUser) {
      return res.status(404).json({ success: false });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: undefined });
  }
};
