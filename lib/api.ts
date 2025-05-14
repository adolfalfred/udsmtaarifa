import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_DB_SERVER,
  withCredentials: true,
});

export const setAuthCookie = (cookie: string | undefined) => {
  api.defaults.headers.common["Cookie"] = cookie;
};

export default api;
