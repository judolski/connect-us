import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";

const PRIVATE_KEY = process.env.PRIVATE_KEY;

export const encryptPassword = async (password: string) => {
  const hashed_password = await bcrypt.hash(password, 10);
  if (!hashed_password) {
    return null;
  }

  return hashed_password;
};

export const generateToken = (user: any) => {
  if (!PRIVATE_KEY) return;
  return jwt.sign({ user }, PRIVATE_KEY, {
    algorithm: "HS256",
    expiresIn: "30d",
  });
};

export const verifyToken = async (token: string) => {
  if (!token || !token.startsWith("Bearer ")) {
    return {
      success: false,
      statusCode: 401,
      message: "No authentication token provided",
      data: null,
    };
  }

  const formattedToken = token.split(" ")[1];
  const secret = new TextEncoder().encode(PRIVATE_KEY);

  try {
    const { payload } = await jwtVerify(formattedToken, secret, {
      algorithms: ["HS256"],
    });

    return {
      success: true,
      statusCode: 200,
      message: "Success",
      data: payload,
    };
  } catch (error: any) {
    if (Number(error.payload.exp) > Number(error.payload.iat)) {
      return {
        success: false,
        statusCode: 401,
        message: "Token expired",
        data: null,
      };
    }
    return {
      success: false,
      statusCode: 401,
      message: "Invalid token",
      data: null,
    };
  }
};
