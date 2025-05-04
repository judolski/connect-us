// app/chat/page.tsx
"use client";

import { useEffect, useState } from "react";
import ChatList from "./myChartList";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { AuthData } from "@/types/authData";

const ChatPage = () => {
  const [chatLists, setChatLists] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");

  const router = useRouter();

  useEffect(() => {
    getChatList();
    const user: AuthData = JSON.parse(localStorage.getItem("authData")!);
    if (!user) {
      router.push("/login");
      return;
    }
    setCurrentUserId(user.id);
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
    <div className="min-h-screen bg-gray-100 flex  justify-center p-4">
      <ChatList users={chatLists} currentUserId={currentUserId} />
    </div>
  );
};

export default ChatPage;
