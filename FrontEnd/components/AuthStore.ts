import { create } from "zustand";

type AuthState = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false, // 初始状态设为 false，避免水合错误
  setIsLoggedIn: (value: boolean) => set({ isLoggedIn: value }),
}));
