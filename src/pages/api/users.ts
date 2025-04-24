import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseModel>
) {
  await connectToDatabase();
  const data = JSON.parse(req.headers["x-user"] as string);

  try {
    //exclude the login user
    const response: ResponseModel[] = await User.find({
      status: "active",
      isDeleted: false,
    })
      .sort({ createdAt: 1 })
      .select("-password -__v -isDeleted");

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Message fetched successfully",
      data: response,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Something went wrong, try again later",
      data: null,
    });
  }
}
