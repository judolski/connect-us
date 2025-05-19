import { GroupedMessage, Message } from "@/types/message";
import { format } from "date-fns";
import { create } from "zustand";

interface ChatState {
  messages: GroupedMessage[];
  setMessages: (msgs: Message[]) => void;
  addMessage: (msg: Message) => void;

  socketId: string;
  setSocketId: (socketId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  setMessages: (msgs) => {
    const groupMgs = groupMessages(msgs);
    console.log(groupMgs);

    set({ messages: groupMgs });
  },
  addMessage: (msg: Message) => {
    set((state) => {
      if (!msg.createdAt) return { messages: [...state.messages] };
      const dateKey = format(new Date(msg.createdAt), "MMMM d"); // e.g. "May 19"
      const existingGroup = state.messages.find(
        (group) => group.date === dateKey
      );

      if (existingGroup) {
        // Add to existing group
        return {
          messages: state.messages.map((group) =>
            group.date === dateKey
              ? {
                  ...group,
                  chats: [...(group.chats || []), msg], // ✅ Make sure it's typed
                }
              : group
          ),
        };
      } else {
        // Create new group
        return {
          messages: [...state.messages, { date: dateKey, chats: [msg] }],
        };
      }
    });
  },

  socketId: "",
  setSocketId: (socketId) => set({ socketId }),
}));

const groupMessages = (messages: Message[]) => {
  const groupedMsgs = messages.reduce((groups: any, chat: Message) => {
    if (!chat.createdAt) return groups;
    const dateKey = format(new Date(chat.createdAt), "d, MMMM, yyyy");

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }

    groups[dateKey].push(chat);

    return groups;
  }, {} as Record<string, any>);

  return Object.entries(groupedMsgs).map(([date, chats]) => ({
    date,
    chats,
  })) as GroupedMessage[];
};
