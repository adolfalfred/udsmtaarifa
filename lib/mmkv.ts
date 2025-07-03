import { StateStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
// This file is used to create a Zustand storage using MMKV for persistent state management.
// MMKV is a fast and efficient key-value storage solution for React Native applications.
const storage = new MMKV({
  id: "settings-store",
});

export const zustandStorage: StateStorage = {
  setItem: (name: string, value: string) => {
    return storage.set(name, value);
  },
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    return storage.delete(name);
  },
};
