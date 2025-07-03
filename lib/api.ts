import axios from "axios";

// This file is used to create an Axios instance for making API requests.
// It sets the base URL for the API and allows for setting authentication cookies.
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_DB_SERVER,
  withCredentials: true,
});

export const setAuthCookie = (cookie: string | undefined) => {
  api.defaults.headers.common["Cookie"] = cookie;
};

export default api;
