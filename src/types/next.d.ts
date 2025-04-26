import { Server as HTTPServer } from "http";

//here
declare module "next" {
  export interface NextApiRequest {
    user: User;
  }
}
