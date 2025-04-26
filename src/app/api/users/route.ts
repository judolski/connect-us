import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user";
import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  await connectToDatabase();

  try {
    //exclude the login user
    const response: ResponseModel[] = await User.find({
      status: "active",
      isDeleted: false,
    })
      .sort({ createdAt: 1 })
      .select("-password -__v -isDeleted");

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: "Message fetched successfully",
      data: response,
    });
  } catch (e) {
    return NextResponse.json({
      success: false,
      statusCode: 500,
      message: `Something went wrong, try again later ${e}`,
      data: null,
    });
  }
}
