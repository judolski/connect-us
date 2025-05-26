import { statusCodes } from "@/constants/error";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user";
import { ResponseBody } from "@/utils/apiResponse";
import { extractUserInfoFromToken } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  connectToDatabase();

  try {
    const userInfo = await extractUserInfoFromToken(req);
    const { id } = userInfo;

    if (!id) {
      return NextResponse.json(
        ResponseBody(statusCodes.BAD_REQUEST, null, "User ID is required")
      );
    }

    const profile = await User.findById(id).select(
      "-password -__v -isDeleted  -updatedAt"
    );
    if (!profile) {
      return NextResponse.json(
        ResponseBody(statusCodes.NOT_FOUND, null, "User not found")
      );
    }
    return NextResponse.json(ResponseBody(statusCodes.OK, profile));
  } catch (error) {
    return NextResponse.json(ResponseBody(statusCodes.INTERNAL_SERVER_ERROR));
  }
}

export async function PUT(req: Request) {
  connectToDatabase();

  try {
    const userInfo = await extractUserInfoFromToken(req);
    const { id } = userInfo;

    if (!id) {
      return NextResponse.json(
        ResponseBody(statusCodes.OK, null, "User ID is required")
      );
    }

    const body = await req.json();

    const missingFields = [];
    if (!body.firstName) missingFields.push("firstName");
    if (!body.lastName) missingFields.push("lastName");
    if (!body.email) missingFields.push("email");

    if (missingFields.length > 0) {
      return NextResponse.json(
        ResponseBody(
          statusCodes.BAD_REQUEST,
          null,
          ` ${missingFields.join(", ")} ${
            missingFields.length > 1 ? "are" : "is"
          }  required`
        )
      );
    }

    const updatedProfile = await User.findByIdAndUpdate(
      id,
      {
        firstName: body.firstName,
        lastName: body.lastMessage,
        email: body.email,
      },
      { new: true }
    ).select("-password -__v -isDeleted -updatedAt");
    if (!updatedProfile) {
      return NextResponse.json(
        ResponseBody(statusCodes.NOT_FOUND, null, "User not found")
      );
    }

    return NextResponse.json(ResponseBody(statusCodes.OK, updatedProfile));
  } catch (error) {
    return NextResponse.json(ResponseBody(statusCodes.INTERNAL_SERVER_ERROR));
  }
}
