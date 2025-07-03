import type { UserProps } from "./zustand/useSessionStore";
import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system";
import api, { setAuthCookie } from "./api";
import axios from "axios";
// This file is used to handle user authentication, including sign-in, sign-out, and session management.
// It uses Axios for making HTTP requests and Expo SecureStore for storing user tokens securely.
export const signIn = async (
  regNo: string,
  password: string,
  notificationId?: string
): Promise<UserProps | string> => {
  try {
    const response = await axios.post(
      `https://udsmtaarifa.vercel.app/api/auth/login`,
      { regNo: regNo.trim(), password, notificationId }
    );

    const token = response.headers["set-cookie"] || response.headers["cookie"];
    if (!token) throw new Error("Cookie missing in response");

    const res = await axios.get(
      `https://udsmtaarifa.vercel.app/api/auth/session`,
      {
        headers: {
          Cookie: token[0],
        },
        withCredentials: true,
      }
    );
    setAuthCookie(token[0]);
    await SecureStore.setItemAsync("userToken", token[0]);
    return res.data.user as UserProps;
  } catch (err: any) {
    console.error(err?.message || "Login error");
    return err?.message || "Login error";
  }
};

export const signOut = async (e: { id?: string; notificationId?: string }) => {
  try {
    const res = await api.post("/auth/logout", e);
    if (!res) return false;
    setAuthCookie(undefined);
    await SecureStore.deleteItemAsync("userToken");
    await FileSystem.deleteAsync(FileSystem.cacheDirectory!, {
      idempotent: true,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const refreshSession = () => {
  const cookie = SecureStore.getItem("userToken");
  if (cookie) setAuthCookie(cookie);
};
