import { connectToDatabase } from "@/lib/db";
import { authenticateUser } from "./controllers/authController";
import type { NextApiRequest, NextApiResponse } from "next";
import { generateToken } from "@/utils/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseModel>
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      statusCode: 405,
      message: "Method Not Allowed",
      data: null,
    });
  }

  await connectToDatabase();

  const { username, password } = req.body;

  const authUser = await authenticateUser(username, password);

  if (!authUser.success) {
    return res.status(authUser.statusCode).json(authUser as ResponseModel);
  }

  const { id, email, phoneNumber, firstName, lastName, role } = authUser.data;
  const token = generateToken(authUser.data);

  if (!token) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "An error occurred while logging in",
      data: null,
    });
  }

  return res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Success",
    data: { id, email, phoneNumber, firstName, lastName, role, token },
  });
}
