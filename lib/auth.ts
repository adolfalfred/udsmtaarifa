import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system";
import { setAuthCookie } from "./api";
import axios from "axios";

export const signIn = async (regNo: string, password: string) => {
  try {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_DB_SERVER}/auth/login`,
      { regNo: regNo.trim(), password }
    );

    const token = response.headers["set-cookie"] || response.headers["cookie"];
    if (!token) throw new Error("Cookie missing in response");

    const res = await axios.get(
      `${process.env.EXPO_PUBLIC_DB_SERVER}/auth/session`,
      {
        headers: {
          Cookie: token[0],
        },
        withCredentials: true,
      }
    );
    setAuthCookie(token[0]);
    await SecureStore.setItemAsync("userToken", token[0]);
    return res.data.user;
  } catch (err: any) {
    console.error(err.message || "Login error");
    return null;
  }
};

export const signOut = async () => {
  setAuthCookie(undefined);
  await SecureStore.deleteItemAsync("userToken");
  await FileSystem.deleteAsync(FileSystem.cacheDirectory!, {
    idempotent: true,
  });
};

export const refreshSession = () => {
  const cookie = SecureStore.getItem("userToken");
  if (cookie) setAuthCookie(cookie);
};
