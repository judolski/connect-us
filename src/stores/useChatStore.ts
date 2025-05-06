import { Message } from "@/types/message";
import { create } from "zustand";

interface ChatState {
  messages: Message[];
  setMessages: (msgs: Message[]) => void;
  addMessage: (msg: Message) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  setMessages: (msgs) => set({ messages: msgs }),

  addMessage: (msg: Message) =>
    set((state) => ({ messages: [...state.messages, msg] })),
}));
