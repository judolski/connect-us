import { Message } from "@/types/message";
import { create } from "zustand";

interface ChatState {
  messages: Message[];
  setMessages: (msgs: Message[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  setMessages: (msgs: Message[]) => set({ messages: msgs }),
}));
