import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { setAuthCookie } from "./api";

export const signIn = async (regNo: string, password: string) => {
  try {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_DB_SERVER}/auth/login`,
      { regNo, password }
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
  } catch (err) {
    console.error("Login error:", err);
    return null;
  }
};

export const signOut = async () => {
  await SecureStore.deleteItemAsync("userToken");
  setAuthCookie(undefined);
};

export const refreshSession = () => {
  const cookie = SecureStore.getItem("userToken");
  if (cookie) setAuthCookie(cookie);
};
