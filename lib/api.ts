import axios from "axios";

// This file is used to create an Axios instance for making API requests.
// It sets the base URL for the API and allows for setting authentication cookies.
//The `setAuthCookie` function is used to set the authentication cookie in the Axios instance headers.
const api = axios.create({
  baseURL: "https://udsmtaarifa.vercel.app/api",
  withCredentials: true,
});

export const setAuthCookie = (cookie: string | undefined) => {
  api.defaults.headers.common["Cookie"] = cookie;
};

export default api;
