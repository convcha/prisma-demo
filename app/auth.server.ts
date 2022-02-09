import SHA256 from "crypto-js/sha256";
import { createCookieSessionStorage } from "remix";
import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";

import { db } from "~/utils/db.server";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cret"], // This should be an env variable
    secure: process.env.NODE_ENV === "production",
  },
});

export const auth = new Authenticator<string>(sessionStorage);

auth.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    if (!password) throw new AuthorizationError("Password is required");
    if (!email) throw new AuthorizationError("Email is required");

    const hashedPassword = SHA256(password).toString();

    const userExists = !!(await db.user.count({
      where: { email: email, password: hashedPassword },
    }));

    if (!userExists) {
      throw new AuthorizationError("Invalid credentials");
    }

    return email as string;
  })
);
