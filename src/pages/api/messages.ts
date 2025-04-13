import { connectToDatabase } from "@/lib/db";
import { Message } from "@/models/message";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MessageResponse>
) {
  await connectToDatabase();

  try {
    const messages: MessageResponse[] = await Message.find().sort({
      timestamp: 1,
    });
    res.status(200).json({
      success: true,
      message: "Message fetched successfully",
      data: messages,
    });
  } catch (e) {
    res.status(200).json({
      success: false,
      message: "Something went wrong, try again later",
      data: null,
    });
  }
}
