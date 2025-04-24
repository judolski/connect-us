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
    const authData = JSON.parse(req.headers["x-user"] as string);
    const { id } = authData.user;
    console.log(id);

    io.on("connection", (socket) => {
      socket.on("message", async (msg) => {
        const saved = await Message.create(msg);
        const populatedMsg = await Message.findById(saved._id)
          .populate({ path: "senderId", select: "-__isDeleted -v" })
          .populate({ path: "receiverId", select: "-__isDeleted -v" });
        io.emit("message", populatedMsg);
      });
    });
  }
  res.end();
}
