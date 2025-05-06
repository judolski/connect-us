// app/chat/page.tsx
"use client";

import { useEffect, useState } from "react";
import ChatList, { IChatList } from "./myChartList";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { AuthData } from "@/types/authData";

const ChatPage = () => {
  const [chatLists, setChatLists] = useState<IChatList[]>([]);

  const router = useRouter();

  useEffect(() => {
    getChatList();
    const user: AuthData = JSON.parse(localStorage.getItem("authData")!);
    if (!user) {
      router.push("/login");
      return;
    }
  }, []);

  const getChatList = async () => {
    const res = await api.get("/api/users/chat-list");

    const { data, message, success } = res.data;

    if (success) {
      setChatLists(data);
    } else {
      alert(message);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <ChatList chatLists={chatLists} />
    </div>
  );
};

export default ChatPage;
