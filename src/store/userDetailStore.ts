// store/userCredits.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserDetail {
  username: string | null;
  email: string | null;
  credits: number;
  setUsername: (name: string | null) => void;
  setEmail: (email: string | null) => void;
  setCredits: (credit: number) => void
  reset: () => void;
}

export const useUserDetail = create<UserDetail>()(
  persist(
    (set) => ({
      username: null,
      email: null,
      credits: 0,
      setUsername: (name) => set({ username: name }),
      setEmail: (email) => set({ email: email }),
      setCredits: (cred) => set({credits: cred}),
      reset: () => set({ username: null, email: null,  credits: 0 }),
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        username: state.username,
        email: state.email,
        credits: state.credits
      }),
    }
  )
);
