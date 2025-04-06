import { AuthState } from "@/services/dtos/login";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      expiresAt: null,
      setAuth: (user, expiresIn) => {
        const expiresAt = Date.now() + expiresIn * 1000;
        set({ user, expiresAt });
      },
      clearAuth: () => set({ user: null, expiresAt: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
