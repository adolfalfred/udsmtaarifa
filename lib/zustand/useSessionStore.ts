import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "../mmkv";
import { Platform } from "react-native";
import { create } from "zustand";

type UserProps = {
  email: string;
  id: string;
  image: string | null;
  name: string | null;
  phone: string;
  regNo: string;
};

type AuthState = {
  isLoggedIn: boolean;
  user: UserProps | null;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: UserProps | null) => void;
};

export const useSessionStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      setIsLoggedIn: (e) => set(() => ({ isLoggedIn: e })),
      setUser: (e) => set(() => ({ user: e })),
    }),
    {
      name: "session-store",
      storage:
        Platform.OS === "web"
          ? createJSONStorage(() => localStorage)
          : createJSONStorage(() => zustandStorage),
    }
  )
);

// export const useSessionStore = create<AuthState>((set) => ({
//   isLoggedIn: false,
//   user: null,
//   setIsLoggedIn: (e) => set(() => ({ isLoggedIn: e })),
//   setUser: (e) => set(() => ({ user: e })),
// }));
