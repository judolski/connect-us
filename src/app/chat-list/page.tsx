// app/chat/page.tsx
"use client";

import { useEffect, useState } from "react";
import ChatList from "./myChartList";
import api from "@/lib/axios";
import { AuthData } from "../login/loginForm";

const ChatPage = () => {
  const [chatLists, setChatLists] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    const getChatList = async () => {
      const res = await api.get("/api/users");

      const { data, message, success } = res.data;

      if (success) {
        setChatLists(data);
      } else {
        alert(message);
      }
    };
    getChatList();
    const user: AuthData = JSON.parse(localStorage.getItem("authData")!);
    setCurrentUserId(user.id);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <ChatList users={chatLists} currentUserId={currentUserId} />
    </div>
  );
};

export default ChatPage;
