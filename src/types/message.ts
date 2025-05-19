import { AuthData } from "./authData";

export type Message = {
  _id?: string;
  receiverId?: AuthData;
  senderId?: AuthData;
  message: string;
  createdAt?: string;
  updatedAt?: string;
};

export type GroupedMessage = {
  date: string;
  chats: Message[];
};
