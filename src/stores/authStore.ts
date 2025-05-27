import { AuthData } from "@/types/authData";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  authDataValue: AuthData | null;
  setAuth: (authDataValue: AuthData) => void;
  clearAuth: () => void;
  isLoggedIn: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      authDataValue: null,
      setAuth: (authDataValue) =>
        set(() => ({
          authDataValue,
        })),
      clearAuth: () =>
        set(() => ({
          authDataValue: null,
        })),
      isLoggedIn: () => {
        return get().authDataValue !== null;
      },
    }),
    {
      name: "authData", // stored in localStorage under this key
    }
  )
);
