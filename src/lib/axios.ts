"use client";

import { useAuthStore } from "@/stores/authStore";
import { AuthData } from "@/types/authData";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_Base_Url,
  withCredentials: true,
});
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const authData = useAuthStore.getState().authDataValue as AuthData | null;
      const user = authData;
      const token = user ? user?.token : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: redirect to login or show alert
      console.log("Unauthorized. Redirecting to login.");
    }
    return Promise.reject(error);
  }
);

export default api;
