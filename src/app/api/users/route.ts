import { statusCodes } from "@/constants/error";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user";
import { ResponseBody } from "@/utils/apiResponse";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();

  try {
    const response: ResponseModel[] = await User.find({
      status: "active",
      isDeleted: false,
    })
      .sort({ createdAt: 1 })
      .select("-password -__v -isDeleted");

    return NextResponse.json(ResponseBody(statusCodes.OK, response));
  } catch (e) {
    return NextResponse.json(ResponseBody(statusCodes.INTERNAL_SERVER_ERROR));
  }
}
