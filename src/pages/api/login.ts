import { connectToDatabase } from "@/lib/db";
import { authenticateUser } from "./controllers/authController";
import type { NextApiRequest, NextApiResponse } from "next";
import { generateToken } from "@/utils/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseModel>
) {
  await connectToDatabase();

  const { username, password } = req.body;

  const authUser = await authenticateUser(username, password);

  if (!authUser.success) {
    return res.status(authUser.statusCode).json(authUser as ResponseModel);
  }

  const { id, email, phoneNumber, firstName, lastName, role } = authUser.data;
  const token = generateToken(authUser.data);

  if (!token) {
    return res.status(authUser.statusCode).json({
      success: true,
      statusCode: 400,
      message: "An error occured while logging in",
      data: null,
    });
  }

  return res.status(authUser.statusCode).json({
    success: true,
    statusCode: 200,
    message: "Success",
    data: { id, email, phoneNumber, firstName, lastName, role, token },
  });
}
