import { statusCodes } from "@/constants/error";
import { connectToDatabase } from "@/lib/db";
import { ChatList } from "@/models/chatList";
import { Message } from "@/models/message";
import { ResponseBody } from "@/utils/apiResponse";
import { extractUserInfoFromToken, verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  connectToDatabase();

  try {
    const userInfo = await extractUserInfoFromToken(req);
    const { id } = userInfo;
    console.log(userInfo.id);
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
        select: "message createdAt -__v",
      });

    // console.log(chatList);

    // Extract only the other participant
    const formattedChatList = await Promise.all(
      chatList.map(async (chat) => {
        // console.log(chat);
        const { userA, userB, lastMessage } = chat;
        const participant =
          userA.id.toString() == id.toString() ? userB : userA;

        console.log(userA.id.toString() == id.toString());

        const unreadCount = await Message.countDocuments({
          senderId: participant.id,
          receiverId: id,
          isRead: false,
        });

        return { id: chat.id, participant, lastMessage, unreadCount };
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
