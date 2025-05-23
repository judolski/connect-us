import { statusCodes } from "@/constants/error";
import { connectToDatabase } from "@/lib/db";
import { ChatList } from "@/models/chatList";
import { Message } from "@/models/message";
import { ResponseBody } from "@/utils/apiResponse";
import { extractUserInfoFromToken } from "@/utils/auth";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Pusher from "pusher";

// Initialize Pusher with your credentials
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function GET(req: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const userB = searchParams.get("receiverId");
  try {
    const userInfo = await extractUserInfoFromToken(req);
    const { id } = userInfo;
    const UserA = id;
    const response: ResponseModel[] = await Message.find({
      $or: [
        { senderId: UserA, receiverId: userB },
        { senderId: userB, receiverId: UserA },
      ],
    })
      .sort({ createdAt: 1 })
      .populate({ path: "senderId", select: "-isDeleted -__v -password" })
      .populate({ path: "receiverId", select: "-isDeleted -__v -password" });

    return NextResponse.json(ResponseBody(statusCodes.OK, response));
  } catch (e) {
    console.log(e);
    return NextResponse.json(ResponseBody(statusCodes.INTERNAL_SERVER_ERROR));
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    Object.entries(body).forEach(([key, value]) => {
      if (typeof value === "string") {
        body[key] = value.trim();
      }
    });

    const { senderId, receiverId, socketId } = body;

    const sortedIds = [senderId, receiverId].sort(); // sorts alphabetically
    const channelName = `private-chat-${sortedIds[0]}-${sortedIds[1]}`;

    const saved = await Message.create(body);
    const populatedMsg = await Message.findById(saved._id)
      .populate({ path: "senderId", select: "-isDeleted -__v" })
      .populate({ path: "receiverId", select: "-__isDeleted -__v" });

    const eventName = "new-message";
    await pusher.trigger(channelName, eventName, populatedMsg, {
      socket_id: socketId,
    });
    //Prevents duplicate conversations between same users.
    const [userA, userB] =
      senderId.toString() < receiverId.toString()
        ? [senderId, receiverId]
        : [receiverId, senderId];

    const chat = await ChatList.findOneAndUpdate(
      {
        userA: new mongoose.Types.ObjectId(userA),
        userB: new mongoose.Types.ObjectId(userB),
      },
      { $set: { userA, userB, lastMessage: saved._id } },
      { upsert: true, new: true, strict: false }
    )
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

    const formattedChat = {
      id: chat.id,
      participant: populatedMsg.senderId,
      lastMessage: chat.lastMessage,
      unreadCount: 1,
    };

    const chatListChannelName = `private-chat-${receiverId.toString()}`;
    await pusher.trigger(chatListChannelName, "chat-list", formattedChat, {
      socket_id: socketId,
    });

    return NextResponse.json(ResponseBody(statusCodes.OK, populatedMsg));
  } catch (error: any) {
    console.error("Error triggering Pusher event:", error);
    return NextResponse.json(
      ResponseBody(
        statusCodes.INTERNAL_SERVER_ERROR,
        null,
        `Internal Server Error, ${error}`
      )
    );
  }
}
