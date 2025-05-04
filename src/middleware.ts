import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./utils/auth";

export async function middleware(request: NextRequest) {
  const token = request.headers.get("authorization");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const response = await verifyToken(token);
  // if (response) console.log(JSON.stringify(response.data));

  if (response?.success) {
    const res = NextResponse.next();
    res.cookies.set("user-info", JSON.stringify(response.data), {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res;
  } else {
    return NextResponse.json({
      status: 500,
      message: `An error occur${response}`,
    });
  }
}

export const config = {
  matcher: ["/api/messages/:path*", "/api/users/:path*"],
};
