import { redirect } from "@remix-run/react";
import axios from "axios";
import { destroySession, getSession } from "~/sessions/auth.server";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

httpClient.interceptors.request.use(
  async config => {
    const session = await getSession();
    const token = session.get("_session");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response.status === 401) {
      const session = await getSession();
      return redirect("/login", {
        headers: {
          "Set-Cookie": await destroySession(session),
        },
      });
    }

    return Promise.reject(error);
  }
);

export default httpClient;
