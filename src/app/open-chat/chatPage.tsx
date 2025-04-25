"use client";

import { useEffect, useState } from "react";
import socket from "@/utils/socket";
import api from "@/lib/axios";
import { AuthData } from "../login/loginForm";
import { useRouter } from "next/navigation";

type Message = {
  _id?: string;
  receiverId?: AuthData;
  senderId?: AuthData;
  message: string;
  timestamp?: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setText] = useState("");
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [senderId, setsenderId] = useState<string | null>(null);
  const [receiverName, setReceiverName] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const sender: AuthData = JSON.parse(localStorage.getItem("authData")!);
    const receiver: AuthData = JSON.parse(
      localStorage.getItem("receiverData")!
    );

    if (!receiver || !sender) {
      router.push("/chat-list");
      return;
    }

    setReceiverId(receiver.id);
    setsenderId(sender.id);
    setReceiverName(receiver.firstName);

    api.get("/api/socket");

    api.get("/api/messages").then((res) => {
      if (res.data.success) setMessages(res.data.data || []);
      else alert(res.data.message);
    });

    socket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("message");
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", {
        message,
        receiverId,
        senderId,
      });
      setText("");
    }
  };

  return (
    senderId && (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col w-full h-full md:max-w-lg md:h-[90vh] bg-white rounded-none md:rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <span className="md:text-xl !text-[22px] font-semibold">
              <i className="text-[40px]">💬</i> Connnect Us
            </span>
          </div>

          <div className="w-full border-b gap-1 flex items-center p-2 border-gray-300">
            <div className="w-10 h-10 text-[18px] rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-semibold">
              {receiverName[0]}
            </div>
            <div className="font-semibold text-[18px]">{receiverName}</div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages?.map(({ senderId, message }, idx) => {
              const user: AuthData = JSON.parse(
                localStorage.getItem("authData")!
              );
              const isMine = senderId?.id === user.id;

              return (
                <div
                  key={idx}
                  className={`flex items-end ${
                    isMine ? "justify-end" : "justify-start"
                  }`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg text-sm break-words ${
                      isMine
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}>
                    {message}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center p-2 border-t border-gray-200">
            <input
              value={message}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message"
              className="flex-1 px-3 py-2 h-[45px] outline-none"
            />
            <button onClick={sendMessage}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-blue-500"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    )
  );
}
