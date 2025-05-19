"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { AuthData } from "@/types/authData";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();

  const [isClient, setIsClent] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    setIsClent(true);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.post("/api/login", { password, username });

    const data = res.data;
    if (data.success) {
      const authData: AuthData = data.data;
      localStorage.setItem("authData", JSON.stringify(authData));
      router.push("/chat-list");
    } else {
      alert(`Login failed: ${data.message}`);
    }
  };

  return (
    isClient && (
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Email or Phone number"
            required
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="text-end">
            <Link
              className="text-red-600 font-medium text-[13px]"
              href={"/forgot-password"}>
              Forgot password
            </Link>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#3257A9] text-white py-2 px-4 rounded-md hover:bg-[#304ea9]">
          Login
        </button>
      </form>
    )
  );
}
