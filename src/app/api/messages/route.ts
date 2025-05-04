import { statusCodes } from "@/constants/error";
import { connectToDatabase } from "@/lib/db";
import { ChatList } from "@/models/chatList";
import { Message } from "@/models/message";
import { ResponseBody } from "@/utils/apiResponse";
import { cookies } from "next/headers";
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
  // const data = await JSON.parse(req.headers.get("x-user") as string);
  const cookieStore = await cookies();

  const userCookie = cookieStore.get("user-info"); // the cookie you set in middleware
  if (!userCookie) {
    return NextResponse.json(ResponseBody(statusCodes.UNAUTHORIZED));
  }
  const userData = JSON.parse(userCookie.value);
  const { id } = userData.user;
  try {
    const response: ResponseModel[] = await Message.find({
      $or: [{ senderId: id }, { receiverId: id }],
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
    const { channel, event, isNew, senderId, receiverId } = body;

    if (isNew) {
      const checkIfExist = await ChatList.findOne({
        $and: [{ senderId }, { receiverId }],
      });

      console.log(checkIfExist);
      if (!checkIfExist) {
        await ChatList.create({ senderId, receiverId });
      }
    }

    const saved = await Message.create(body);
    const populatedMsg = await Message.findById(saved._id)
      .populate({ path: "senderId", select: "-__isDeleted -v" })
      .populate({ path: "receiverId", select: "-__isDeleted -v" });

    await pusher.trigger(channel, event, populatedMsg);

    return NextResponse.json(ResponseBody(statusCodes.OK, populatedMsg));
  } catch (error: any) {
    console.error("Error triggering Pusher event:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
