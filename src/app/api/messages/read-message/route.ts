import { statusCodes } from "@/constants/error";
import { Message } from "@/models/message";
import { ResponseBody } from "@/utils/apiResponse";
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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { senderId, receiverId, messageIds, socketId } = body;

    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return NextResponse.json(
        ResponseBody(statusCodes.BAD_REQUEST, null, "Message Ids are required")
      );
    }

    const sortedIds = [senderId, receiverId].sort(); // sorts alphabetically
    const channelName = `private-chat-${sortedIds[0]}-${sortedIds[1]}`;

    await Message.updateMany(
      { _id: { $in: messageIds } },
      { $set: { isRead: true } }
    );

    const eventName = "message-read";
    await pusher.trigger(channelName, eventName, messageIds, {
      socket_id: socketId,
    });

    return NextResponse.json(ResponseBody(statusCodes.OK));
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
