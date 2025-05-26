import { statusCodes } from "@/constants/error";
import { connectToDatabase } from "@/lib/db";
import { ChatList } from "@/models/chatList";
import { Message } from "@/models/message";
import { ResponseBody } from "@/utils/apiResponse";
import { extractUserInfoFromToken } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  connectToDatabase();

  try {
    const userInfo = await extractUserInfoFromToken(req);
    const { id } = userInfo;
    const chatList = await ChatList.find({
      $or: [{ userA: id }, { userB: id }],
    })
      .populate({
        path: "userA",
        select: "-isDeleted -__v",
      })
      .populate({
        path: "userB",
        select: "-isDeleted -__v",
      })
      .populate({
        path: "lastMessage",
        select: "message isRead createdAt -__v",
      });

    const formattedChatList = await Promise.all(
      chatList.map(async (chat) => {
        const { userA, userB, lastMessage } = chat;
        const participant =
          userA.id.toString() == id.toString() ? userB : userA;

        const unreadCount = await Message.countDocuments({
          senderId: participant.id,
          receiverId: id,
          isRead: false,
        });

        return { id: chat.id, participant, lastMessage, unreadCount };
      })
    );
    return NextResponse.json(ResponseBody(statusCodes.OK, formattedChatList));
  } catch (error) {
    console.log(error);
    return NextResponse.json(ResponseBody(statusCodes.INTERNAL_SERVER_ERROR));
  }
}
