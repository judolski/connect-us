// pages/api/pusher/auth.ts
import { statusCodes } from "@/constants/error";
import { ResponseBody } from "@/utils/apiResponse";
import { NextResponse } from "next/server";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: Request) {
  try {
    if (req.method === "POST") {
      const body = await req.text();
      const params = new URLSearchParams(body);

      const socket_id = params.get("socket_id");
      const channel_name = params.get("channel_name");
      // Check for missing values
      if (!socket_id || !channel_name) {
        return NextResponse.json(
          ResponseBody(
            statusCodes.BAD_REQUEST,
            null,
            "Missing socket_id or channel_name"
          )
        );
      }

      const auth = pusher.authorizeChannel(socket_id, channel_name);
      //   return NextResponse.json(ResponseBody(statusCodes.OK, auth));
      return new Response(JSON.stringify(auth), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return NextResponse.json(ResponseBody(statusCodes.METHOD_NOT_ALLOWED));
    }
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
