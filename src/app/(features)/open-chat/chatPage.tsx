"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";
import { AuthData } from "@/types/authData";
import { Message } from "@/types/message";
import { useChatStore } from "@/stores/useChatStore";
import { formatDateTime } from "@/utils/formatters";
import BackButton from "@/components/backButton";

export default function ChatPage() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [message, setText] = useState("");
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [senderId, setsenderId] = useState<string | null>(null);
  const [receiverName, setReceiverName] = useState<string>("");

  const { messages, setMessages, addMessage, socketId, setSocketId } =
    useChatStore();

  const router = useRouter();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const sender: AuthData = JSON.parse(localStorage.getItem("authData")!);
    const receiver: AuthData = JSON.parse(
      localStorage.getItem("receiverData")!
    );

    if (!receiver || !sender) {
      router.push("/chat-list");
      return;
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher/auth", // Your custom auth endpoint
    });

    pusher.connection.bind("connected", () => {
      const socket_Id = pusher.connection.socket_id;
      setSocketId(socket_Id);
    });

    setReceiverId(receiver.id);
    setsenderId(sender.id);
    setReceiverName(receiver.firstName);

    const sortedIds = [String(sender.id), String(receiver.id)].sort();
    const channelName = `private-chat-${sortedIds[0]}-${sortedIds[1]}`;
    const eventName = "new-message";
    // console.log(`private-chat-${sortedIds[0]}-${sortedIds[1]}`);

    const channel = pusher.subscribe(channelName);
    channel.bind(eventName, (data: Message) => {
      addMessage(data);
    });

    api
      .get("/api/messages", { params: { receiverId: receiver.id } })
      .then((res) => {
        if (res.data.success) {
          setMessages(res.data.data || []);
        } else alert(res.data.message);
      });

    // Cleanup
    return () => {
      pusher.unsubscribe(channelName);
    };
  }, []);

  const sendMessage = async () => {
    const response = await api.post(
      "/api/messages",
      JSON.stringify({
        socketId,
        receiverId,
        senderId,
        message,
      })
    );

    const data = await response.data;
    if (data.success) {
      addMessage(data.data);
      setText("");
      console.log("Message sent!");
    } else {
      console.log("Error sending message");
    }
  };

  return (
    senderId && (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col w-full h-full md:max-w-lg md:h-[90vh] bg-white rounded-none md:rounded-lg shadow-md overflow-hidden">
          <div className="w-full border-b gap-1 flex items-center p-2 border-gray-300">
            <BackButton url={"/chat-list"} />
            <div className="w-10 h-10 text-[18px] rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-semibold">
              {receiverName[0]}
            </div>
            <div className="font-semibold text-[18px]">{receiverName}</div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages?.map((msg) => {
              return (
                <div key={msg.date}>
                  <div className="text-center w-full">
                    <span className="w-fit p-1 rounded-full text-sm bg-blue-100">
                      {msg.date}
                    </span>{" "}
                  </div>

                  {msg.chats?.map(({ senderId, createdAt, message }, idx) => {
                    const user: AuthData = JSON.parse(
                      localStorage.getItem("authData")!
                    );
                    const isMine = senderId?.id === user.id;

                    return (
                      <div
                        key={idx}
                        className={`flex items-end my-2 ${
                          isMine ? "justify-end" : "justify-start"
                        }`}>
                        <div className="flex flex-col justify-start gap-[1px]">
                          <div
                            className={`max-w-xs px-4 py-2  rounded-lg text-base break-words ${
                              isMine
                                ? "bg-blue-500 text-white rounded-br-none"
                                : "bg-gray-200 text-gray-800 rounded-bl-none"
                            }`}>
                            {message}
                          </div>
                          <span
                            className={`${
                              isMine ? "text-right" : "text-left"
                            } text-[10px]`}>
                            {formatDateTime(createdAt!)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
            <div ref={bottomRef} />
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
