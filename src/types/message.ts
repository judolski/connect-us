import { AuthData } from "./authData";

export type Message = {
  _id?: string;
  receiverId?: AuthData;
  senderId?: AuthData;
  message: string;
  timestamp?: string;
};
