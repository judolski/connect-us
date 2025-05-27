// // components/ClientLayout.tsx
"use client";

import BottomNavigation from "./BottomNavigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn } = useAuthStore();

  return (
    <>
      {children}
      {isLoggedIn() && <BottomNavigation />}
    </>
  );
}
