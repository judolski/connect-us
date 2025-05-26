"use client";

import React from "react";
import Navigate from "./backButton";

const menus = [
  { label: "Home", icon: "🏠", url: "/chat-list" },
  { label: "Search", icon: "🔍", url: "/chat-list" },
  { label: "Add", icon: "➕", url: "/chat-list" },
  { label: "Notifications", icon: "🔔", url: "/chat-list" },
  { label: "Profile", icon: "👤", url: "/profile" },
];

const BottomNavigation: React.FC = () => {
  const [active, setActive] = React.useState(0);

  return (
    <nav className="fixed bottom-0  left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-around items-center z-50 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
      {menus.map((menu, idx) => (
        <button
          key={menu.label}
          className={`flex flex-col items-center justify-center flex-1 py-2 rounded-xl font-medium transition-all
                        ${
                          active === idx
                            ? "text-blue-600 bg-indigo-100 shadow-md"
                            : "text-slate-500 bg-transparent"
                        }
                    `}
          onClick={() => {
            setActive(idx);
            window.location.href = menu.url;
          }}>
          <span className="text-2xl block">{menu.icon}</span>
          <span className="text-xs">{menu.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNavigation;
