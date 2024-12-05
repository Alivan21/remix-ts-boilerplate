import { createCookieSessionStorage } from "@remix-run/node";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import httpClient from "~/lib/http";

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "_session",
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secrets: [import.meta.env.VITE_COOKIE_SECRET],
  },
});

const authenticator = new Authenticator<string>();

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email");
    const password = form.get("password");

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const response = await httpClient.post("/login", { email, password });

    return response.data.user.id;
  }),
  "user-pass"
);

export { authenticator, commitSession, destroySession, getSession };
