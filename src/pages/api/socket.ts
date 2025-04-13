import { Server } from "socket.io";
import { connectToDatabase } from "@/lib/db";
import { Message } from "@/models/message";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (res?.socket && res.socket.server && !res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket", // Ensure this path is specified
    });

    res.socket.server.io = io;

    await connectToDatabase();

    io.on("connection", (socket) => {
      socket.on("message", async (msg) => {
        const saved = await Message.create(msg);
        io.emit("message", saved);
      });
    });
  }
  res.end();
}
