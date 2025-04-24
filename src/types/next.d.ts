import { Server as HTTPServer } from "http";
import { Socket } from "net";
import { Server as IOServer } from "socket.io";

declare module "net" {
  interface Socket {
    server: HTTPServer & { io: IOServer };
  }
}

declare module "next" {
  interface NextApiRequest {
    user: any;
  }
}
