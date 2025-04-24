"use client";

import { useRouter } from "next/navigation";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  status: string;
}

interface ChatListProps {
  users: User[];
  currentUserId: string;
}

const ChatList = ({ users, currentUserId }: ChatListProps) => {
  const router = useRouter();

  const filteredUsers = users.filter((user) => user.id !== currentUserId);

  const openChat = (user: User) => {
    localStorage.setItem("receiverData", JSON.stringify(user));
    router.push("/open-chat");
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
      <div className="p-4 border-b text-xl font-semibold">Chats</div>
      <ul className="divide-y">
        {filteredUsers.map((user) => (
          <li
            onClick={() => openChat(user)}
            key={user.id}
            className="p-4 hover:bg-gray-100 cursor-pointer flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
              {user.firstName[0].toUpperCase()}
            </div>
            <div>
              <div className="font-semibold">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
