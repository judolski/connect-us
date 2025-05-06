import { connectToDatabase } from "@/lib/db";
import { authenticateUser } from "../controllers/authController";
import { generateToken } from "@/utils/auth";
import { NextResponse } from "next/server";
import { ResponseBody } from "@/utils/apiResponse";
import { statusCodes } from "@/constants/error";
import { AuthData } from "@/types/authData";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { username, password } = await req.json(); // ✅ Don't forget the ()

    const authUser = await authenticateUser(username, password);

    if (!authUser.success) {
      return NextResponse.json(authUser, { status: authUser.statusCode });
    }

    const { id, email, phoneNumber, firstName, lastName, role } =
      authUser.data as AuthData;
    const token = generateToken(authUser.data);

    if (!token) {
      return NextResponse.json(ResponseBody(statusCodes.INTERNAL_SERVER_ERROR));
    }
    return NextResponse.json(
      ResponseBody(statusCodes.OK, {
        id,
        email,
        phoneNumber,
        firstName,
        lastName,
        role,
        token,
      })
    );
  } catch (error) {
    return NextResponse.json(
      ResponseBody(
        statusCodes.INTERNAL_SERVER_ERROR,
        null,
        `Internal Server Error, ${error}`
      )
    );
  }
}
