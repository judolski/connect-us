import { Message } from "@/types/message";
import { channel } from "diagnostics_channel";
import { create } from "zustand";

interface ChatState {
  messages: Message[];
  setMessages: (msgs: Message[]) => void;
  addMessage: (msg: Message) => void;

  socketId: string;
  setSocketId: (socketId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  setMessages: (msgs) => set({ messages: msgs }),
  addMessage: (msg: Message) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  socketId: "",
  setSocketId: (socketId) => set({ socketId }),
}));
