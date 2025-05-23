import { AuthData } from "./authData";
import { IUser } from "./user";

export type Message = {
  _id: string;
  id: string;
  receiverId: AuthData;
  senderId: AuthData;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GroupedMessage = {
  date: string;
  chats: Message[];
};

export type ILastMessage = {
  _id: string;
  message: string;
  createdAt: string;
};

export type IChatList = {
  id: string;
  participant: IUser;
  lastMessage: ILastMessage;
  unreadCount: number;
};
