import { connectToDatabase } from "@/lib/db";
import { authenticateUser } from "../controllers/authController";
import { generateToken } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { username, password } = await req.json(); // ✅ Don't forget the ()

    const authUser = await authenticateUser(username, password);

    if (!authUser.success) {
      return NextResponse.json(authUser, { status: authUser.statusCode });
    }

    const { id, email, phoneNumber, firstName, lastName, role } = authUser.data;
    const token = generateToken(authUser.data);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          message: "An error occurred while logging in",
          data: null,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: "Success",
      data: { id, email, phoneNumber, firstName, lastName, role, token },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: `Internal Server Error, ${error}`,
        data: null,
      },
      { status: 500 }
    );
  }
}
