// import { persist, createJSONStorage } from "zustand/middleware";
// import { zustandStorage } from "../mmkv";
// import { Platform } from "react-native";
import { create } from "zustand";

interface ThemeProps {
  theme: "dark" | "light" | "system";
  setTheme: (e: "dark" | "light" | "system") => void;
}

// export const useThemeStore = create<ThemeProps>()(
//   persist(
//     (set) => ({
//       theme: "system",
//       setTheme: (e) => set(() => ({ theme: e })),
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

export const useThemeStore = create<ThemeProps>((set) => ({
  theme: "system",
  setTheme: (e) => set(() => ({ theme: e })),
}));
