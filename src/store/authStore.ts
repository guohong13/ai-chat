import { create } from "zustand";
import { persist } from "zustand/middleware";
import { simpleEncrypt } from "@/lib/utils";

interface User {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
  rememberMe: boolean;
  savedEmail: string;
  savedPassword: string;
}

interface AuthActions {
  setError: (error: string | null) => void;
  setRememberMe: (remember: boolean) => void;
  setSavedCredentials: (email: string, password: string) => void;
  clearSavedCredentials: () => void;
  login: (user: User, token: string, remember?: boolean) => void;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // 初始状态
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      rememberMe: false,
      savedEmail: "",
      savedPassword: "",

      // Actions
      setError: (error) => set({ error }),
      setRememberMe: (rememberMe) => set({ rememberMe }),

      setSavedCredentials: (email, password) => {
        const encryptedPassword = simpleEncrypt(password);
        set({ savedEmail: email, savedPassword: encryptedPassword });
      },

      clearSavedCredentials: () => {
        set({ savedEmail: "", savedPassword: "" });
      },

      login: (user, token, remember = false) => {
        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
          rememberMe: remember,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        rememberMe: state.rememberMe,
        savedEmail: state.savedEmail,
        savedPassword: state.savedPassword,
      }),
    }
  )
);
