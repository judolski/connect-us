// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./utils/auth";

export async function middleware(request: Request) {
  const token = request.headers.get("authorization");
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const response = await verifyToken(token);

  if (response?.success) {
    const res = NextResponse.next();
    // res.headers.set("x-user", JSON.stringify(response.data));
    res.cookies.set("user-info", JSON.stringify(response.data), {
      httpOnly: true,
      path: "/", // send to all routes
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res;
  } else {
    return NextResponse.json(response);
  }
}

export const config = {
  matcher: ["/api/messages/:path*", "/api/users/:path*"], // Add routes you want to protect
};
