"use client";

import { useEffect, useState } from "react";
import socket from "@/utils/socket";

type Message = {
  _id?: string;
  username: string;
  message: string;
  timestamp?: string;
};

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setText] = useState("");
  const [username, setUsername] = useState("User");

  const [isClient, setIsClent] = useState(false);

  useEffect(() => {
    setIsClent(true);
    fetch("/api/socket");
    fetch("/api/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data.data || []));

    socket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", { username, message });
      setText("");
    }
  };

  return isClient ? (
    <div className="p-5 space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold">💬 Realtime Chat</h1>

      <div className="max-h-72 overflow-y-auto border border-gray-300 rounded-md p-3 space-y-2 bg-white shadow-sm">
        {messages?.map(({ username, message }, idx) => (
          <div key={idx} className="text-sm">
            <strong className="text-gray-800">{username}: </strong>
            <span className="text-gray-700">{message}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <input
          value={message}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
          Send
        </button>
      </div>
    </div>
  ) : null;
}
