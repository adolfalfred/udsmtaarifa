// import { persist, createJSONStorage } from "zustand/middleware";
// import { zustandStorage } from "../mmkv";
// import { Platform } from "react-native";
import { create } from "zustand";

interface SessionProps {
  session: "dark" | "light" | "system" | null;
  setSession: (e: "dark" | "light" | "system") => void;
}

// export const useSessionStore = create<SessionProps>()(
//   persist(
//     (set) => ({
//       session: null,
//       setSession: (e) => set(() => ({ session: e })),
//     }),
//     {
//       name: "settings-store",
//       storage:
//         Platform.OS === "web"
//           ? createJSONStorage(() => localStorage)
//           : createJSONStorage(() => zustandStorage),
//     }
//   )
// );

export const useSessionStore = create<SessionProps>((set) => ({
  session: null,
  setSession: (e) => set(() => ({ session: e })),
}));
