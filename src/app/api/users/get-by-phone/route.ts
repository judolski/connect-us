import { statusCodes } from "@/constants/error";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user";
import { ResponseBody } from "@/utils/apiResponse";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectToDatabase();

  const body = await req.json();

  const { phoneNumber } = body;

  try {
    const response = await User.find({
      phoneNumber,
      status: "active",
      isDeleted: false,
    }).select("-password -__v -isDeleted");

    return NextResponse.json(ResponseBody(statusCodes.OK, response));
  } catch (e) {
    return NextResponse.json(ResponseBody(statusCodes.INTERNAL_SERVER_ERROR));
  }
}
