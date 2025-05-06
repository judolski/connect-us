import { statusCodes } from "@/constants/error";
import { connectToDatabase } from "@/lib/db";
import { ChatList } from "@/models/chatList";
import { Message } from "@/models/message";
import { AuthData } from "@/types/authData";
import { ResponseBody } from "@/utils/apiResponse";
import { verifyToken } from "@/utils/auth";
import mongoose from "mongoose";
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
    const { _id } = user;

    const chatList = await ChatList.find({
      $or: [{ userA: _id }, { userB: _id }],
    })
      .populate({
        path: "userA",
        select: "-isDeleted -__v",
        strictPopulate: false,
      })
      .populate({
        path: "userB",
        select: "-isDeleted -__v",
        strictPopulate: false,
      })
      .populate({
        path: "lastMessageId",
        select: "message createdAt",
        strictPopulate: false,
      });

    // Extract only the other participant
    const formattedChatList = await Promise.all(
      chatList.map(async (chat) => {
        const participant =
          chat.userA._id.toString() == user.id ? chat.userA : chat.userB;

        const lastMessage = chat.lastMessageId;

        const unreadCount = await Message.countDocuments({
          senderId: participant._id,
          receiverId: _id,
          isRead: false,
        });

        return { id: chat._id, participant, lastMessage, unreadCount };
      })
    );

    // const chatList = await Message.aggregate([
    //   {
    //     $match: {
    //       $or: [{ senderId: objectId }, { receiverId: objectId }],
    //     },
    //   },
    //   {
    //     $sort: { createdAt: -1 },
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         $cond: [
    //           { $eq: ["$senderId", objectId] },
    //           "$receiverId",
    //           "$senderId",
    //         ],
    //       },
    //       lastMessage: { $first: "$$ROOT" },
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "_id",
    //       foreignField: "_id",
    //       as: "participant",
    //     },
    //   },
    //   {
    //     $unwind: "$participant",
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       participant: {
    //         _id: "$participant._id",
    //         firstName: "$participant.firstName",
    //         lastName: "$participant.lastName",
    //         email: "$participant.email",
    //         phoneNumber: "$participant.phoneNumber",
    //       },
    //       lastMessage: {
    //         message: "$lastMessage.message",
    //         createdAt: "$lastMessage.createdAt",
    //       },
    //     },
    //   },
    // ]);

    return NextResponse.json(ResponseBody(statusCodes.OK, formattedChatList));
  } catch (error) {
    console.log(error);
    return NextResponse.json(ResponseBody(statusCodes.INTERNAL_SERVER_ERROR));
  }
}
