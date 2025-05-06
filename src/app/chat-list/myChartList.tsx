import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ILastMessage {
  _id: string;
  message: string;
  createdAt: string;
}

export interface IChatList {
  id: string;
  participant: IUser;
  lastMessage: ILastMessage;
  unreadCount: number;
}

interface ChatListProps {
  chatLists: IChatList[];
}
interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  status: string;
}

const ChatList = (chatListProps: ChatListProps) => {
  const router = useRouter();

  const [phone, setPhone] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [user, setUser] = useState<IUser[] | null>(null);

  const openChat = (user: IUser) => {
    localStorage.setItem("receiverData", JSON.stringify(user));
    router.push("/open-chat");
  };

  const search = async () => {
    const response = await api.post(
      "/api/users/get-by-phone",
      JSON.stringify({
        phoneNumber: phone,
      })
    );

    const res = await response.data;
    if (res.success) {
      setUser(res.data);
    } else {
      setUser([]);
      console.log(res);
    }
  };

  return (
    <div className="w-full relative max-w-md mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
      <div className="p-4 border-b text-xl flex justify-between font-semibold">
        <div className="">Chats</div>
        <button
          onClick={() => {
            setIsSearching(isSearching ? false : true);
            setUser(null);
          }}
          aria-label="Search">
          {isSearching && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
          {!isSearching && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 hover:h-7 hover:w-7 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 6.65a7.5 7.5 0 010 10.6z"
              />
            </svg>
          )}
        </button>
      </div>

      {isSearching && (
        <div className={`border-t absolute border-gray-200 bg-blue-50 w-full`}>
          <div
            className={`flex border-b-gray-500 relative items-center w-full`}>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Search User"
              className={`flex-1 px-2 py-3 h-[50px] outline-none border-b border-gray-300`}
            />
            {phone.length === 11 && (
              <button className="absolute right-2" onClick={search}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
                </svg>
              </button>
            )}
          </div>
          {user && (
            <button
              onClick={() => {
                if (user.length > 0) {
                  openChat(user[0]);
                }
              }}
              className={`p-4 text-start w-full ${
                user.length > 0
                  ? "shadow-md bg-green-50"
                  : user.length === 0
                  ? "shadow-md bg-red-50"
                  : "bg-none shadow-none"
              }`}>
              {user.length > 0
                ? `${user[0].firstName} ${user[0].lastName}`
                : "No user found"}
            </button>
          )}
        </div>
      )}

      <ul className="divide-y divide-gray-200">
        {chatListProps.chatLists.map((chat) => (
          <li
            onClick={() => openChat(chat.participant)}
            key={chat.id}
            className="p-4 hover:bg-gray-100 cursor-pointer flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-indigo-500 text-[20px] text-white flex items-center justify-center font-bold">
                {chat.participant.firstName[0].toUpperCase()}
              </div>
              <div className="flex flex-col gap-1">
                <div className="font-semibold">
                  {chat.participant.firstName} {chat.participant.lastName}
                </div>
                <div className="text-[11px] text-gray-500">
                  {chat.lastMessage.message}
                </div>
              </div>
            </div>
            <div className="bg-indigo-500 py-1 px-2 text-white flex items-center rounded-full">
              {chat.unreadCount}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
