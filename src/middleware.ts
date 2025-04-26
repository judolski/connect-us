// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./utils/auth";

export async function middleware(request: NextRequest) {
  const token = request.headers.get("authorization");
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const response = await verifyToken(token);

  if (response?.success) {
    const res = NextResponse.next();
    res.headers.set("x-user", JSON.stringify(response.data));
    return res;
  } else {
    return NextResponse.json(response);
  }
}

export const config = {
  matcher: ["/api/messages/:path*", "/api/users/:path*"], // Add routes you want to protect
};
