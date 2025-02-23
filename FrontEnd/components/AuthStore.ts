import { create } from "zustand";

type AuthState = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: typeof window !== "undefined" && !!localStorage.getItem("access_token"), // 确保仅在客户端运行
  setIsLoggedIn: (value: boolean) => set({ isLoggedIn: value }),
}));