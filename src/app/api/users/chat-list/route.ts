import { statusCodes } from "@/constants/error";
import { connectToDatabase } from "@/lib/db";
import { ChatList } from "@/models/chatList";
import { ResponseBody } from "@/utils/apiResponse";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  connectToDatabase();

  try {
    const token = req.headers.get("authorization");
    if (!token) {
      return NextResponse.json(ResponseBody(statusCodes.UNAUTHORIZED, null));
    }
    const response = await verifyToken(token);
    if (!response.success) {
      return NextResponse.json(
        ResponseBody(statusCodes.UNAUTHORIZED, null, response.message)
      );
    }

    const user = (response?.data as any).user;

    const chatList = await ChatList.find({
      $or: [{ receiverId: user.id }, { senderId: user.id }],
    })
      .populate({ path: "senderId", select: "-__isDeleted -v" })
      .populate({ path: "receiverId", select: "-__isDeleted -v" });

    // Extract only the other participant
    const filteredChatList = chatList.map((chat) => {
      const participant =
        chat.senderId._id.toString() == user.id
          ? chat.receiverId
          : chat.senderId;
      return {
        // ...chat.toObject(),
        participant, // The other user object
        // senderId: undefined,
        // receiverId: undefined,
      };
    });

    return NextResponse.json(ResponseBody(statusCodes.OK, chatList));
  } catch (error) {
    return NextResponse.json(ResponseBody(statusCodes.INTERNAL_SERVER_ERROR));
  }
}
