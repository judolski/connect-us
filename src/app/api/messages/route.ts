import { connectToDatabase } from "@/lib/db";
import { Message } from "@/models/message";
import { NextResponse } from "next/server";
import Pusher from "pusher";
import { data } from "react-router-dom";

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
  const data = await JSON.parse(req.headers.get("x-user") as string);

  const { id } = data.user;
  try {
    const response: ResponseModel[] = await Message.find({
      $or: [{ senderId: id }, { receiverId: id }],
    })
      .sort({ createdAt: 1 })
      .populate({ path: "senderId", select: "-isDeleted -__v -password" })
      .populate({ path: "receiverId", select: "-isDeleted -__v -password" });

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: "Message fetched successfully",
      data: response,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      success: false,
      statusCode: 500,
      message: "Something went wrong, try again later",
      data: null,
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { channel, event } = body;
    console.log(body);

    const saved = await Message.create(body);
    const populatedMsg = await Message.findById(saved._id)
      .populate({ path: "senderId", select: "-__isDeleted -v" })
      .populate({ path: "receiverId", select: "-__isDeleted -v" });

    await pusher.trigger(channel, event, populatedMsg);

    return NextResponse.json({ success: true, data: populatedMsg });
  } catch (error: any) {
    console.error("Error triggering Pusher event:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
