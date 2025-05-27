// app/chat/page.tsx
"use client";

import { useEffect, useState } from "react";
import ChatList from "./myChartList";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { AuthData } from "@/types/authData";
import Pusher from "pusher-js";
import { IChatList } from "@/types/message";
import Loader from "@/components/loader";

const ChatPage = () => {
  const [chatLists, setChatLists] = useState<IChatList[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    getChatList();
    const user: AuthData = JSON.parse(localStorage.getItem("authData")!);

    if (!user) {
      router.push("/login");
      return;
    }
  }, []);

  useEffect(() => {
    const user: AuthData = JSON.parse(localStorage.getItem("authData")!);

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher/auth", // Your custom auth endpoint
    });

    pusher.connection.bind("connected", () => {});

    const channelName = `private-chat-${user.id}`;

    const channel = pusher.subscribe(channelName);
    channel.bind("chat-list", (data: IChatList) => {
      const existingChat = chatLists.find(
        (chat) => chat.participant.id === data.participant.id
      );
      if (existingChat) {
        const myChat = chatLists.map((chat) =>
          data.participant.id === chat.participant.id
            ? {
                ...data,
                unreadCount: chat.unreadCount + 1,
              }
            : chat
        );
        setChatLists(myChat);
        console.log(myChat);
      } else {
        const myChat = [...chatLists, data];
        setChatLists(myChat);
      }

      console.log(chatLists);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [chatLists]);

  const getChatList = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/users/chat-list");

      const { data, message, success } = res.data;

      if (success) {
        setChatLists(data);
      } else {
        alert(message);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return loading ? <Loader type="line" /> : <ChatList chatLists={chatLists} />;
};

export default ChatPage;
