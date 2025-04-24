import { Server as HTTPServer } from "http";
import { Socket } from "net";
import { Server as IOServer } from "socket.io";

declare module "net" {
  export interface Socket {
    server: HTTPServer & { io: IOServer };
  }
}

declare module "next" {
  export interface NextApiRequest {
    user: any;
  }
}
