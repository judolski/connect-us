import { GroupedMessage, Message } from "@/types/message";
import { group } from "console";
import { format } from "date-fns";
import { create } from "zustand";

interface ChatState {
  messages: GroupedMessage[];
  setMessages: (msgs: Message[]) => void;
  addMessage: (msg: Message) => void;
  updateReadStatus: (messageIds: string[]) => void;

  socketId: string;
  setSocketId: (socketId: string) => void;
}

const DATE_FORMAT = "d MMMM, yyyy";

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  setMessages: (msgs) => {
    const groupMgs = groupMessages(msgs);

    set({ messages: groupMgs });
  },
  addMessage: (msg: Message) => {
    set((state) => {
      if (!msg.createdAt) return { messages: [...state.messages] };

      const dateKey = format(new Date(msg.createdAt), DATE_FORMAT);
      const existingGroup = state.messages.find(
        (group) => group.date === dateKey
      );

      if (existingGroup) {
        const updatedMessages = state.messages.map((group) =>
          group.date === dateKey
            ? {
                ...group,
                chats: Array.isArray(group.chats)
                  ? msg.id === ""
                    ? [...group.chats, msg]
                    : [...group.chats, msg].filter((a) => a.id !== "")
                  : msg.id === ""
                  ? [msg]
                  : [msg].filter((a) => a.id !== ""),
              }
            : group
        );
        return {
          messages: updatedMessages,
        };
      } else {
        const newMessages = [
          ...state.messages,
          {
            date: dateKey,
            chats: msg.id === "" ? [msg] : [msg].filter((a) => a.id !== ""),
          },
        ];
        return {
          messages: newMessages,
        };
      }
    });
  },
  updateReadStatus: (messageIds: string[]) => {
    set((state) => {
      if (messageIds.length === 0) return { messages: state.messages };

      const updatedMessages = state.messages.map((group) => ({
        ...group,
        chats: group.chats.map((chat) =>
          messageIds.includes(chat.id) ? { ...chat, isRead: true } : chat
        ),
      }));
      return { messages: updatedMessages };
    });
  },
  socketId: "",
  setSocketId: (socketId) => set({ socketId }),
}));

const groupMessages = (messages: Message[]) => {
  const groupedMsgs: GroupedMessage = messages.reduce(
    (groups: any, chat: Message) => {
      if (!chat.createdAt) return groups;
      const dateKey = format(new Date(chat.createdAt), DATE_FORMAT);

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(chat);

      return groups;
    },
    {} as Record<string, Message[]>
  );

  return Object.entries(groupedMsgs)
    .map(([date, chats]) => ({
      date,
      chats,
    }))
    .sort(
      (a, b) =>
        new Date((a.chats[0] as Message | any).createdAt).getTime() -
        new Date((b.chats[0] as Message | any).createdAt).getTime()
    ) as GroupedMessage[];
};
