import { Server as HTTPServer } from "http";
import { Server as IOServer } from "socket.io";

declare module "net" {
  export interface Socket {
    server: HTTPServer & { io: IOServer };
  }
}
//here
declare module "next" {
  export interface NextApiRequest {
    user: User;
  }
}
