"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const menus = [
  { label: "Chats", icon: "🏠", url: "/chat-list" },
  { label: "Search", icon: "🔍", url: "" },
  { label: "Add", icon: "➕", url: "" },
  { label: "Notifications", icon: "🔔", url: "" },
  { label: "Profile", icon: "👤", url: "/profile" },
];

const BottomNavigation: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const index = menus.findIndex((menu) => pathname.startsWith(menu.url));
    if (index !== -1) setActive(index);
  }, [pathname]);

  const handleNavigation = (idx: number, url: string) => {
    if (url === "") return;
    setActive(idx);
    router.push(url); // Navigate without refreshing
  };

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full sm:max-w-lg bg-white border-t border-gray-200 flex justify-around items-center z-50 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
      {menus.map((menu, idx) => (
        <button
          key={menu.label}
          className={`flex flex-col items-center justify-center flex-1 py-2 rounded-none font-medium transition-all ${
            active === idx
              ? "text-blue-600 bg-indigo-100 shadow-md"
              : "text-slate-500 bg-transparent"
          }`}
          onClick={() => handleNavigation(idx, menu.url)}>
          <span className="text-2xl block">{menu.icon}</span>
          <span className="text-xs">{menu.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNavigation;
