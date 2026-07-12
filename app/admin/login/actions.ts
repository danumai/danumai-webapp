"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionToken, verifyCredentials, SESSION_COOKIE } from "@/lib/auth";

export type LoginState = {
  error?: string;
};

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/admin");

  if (!username || !password) {
    return { error: "Enter your username and password." };
  }

  let valid: boolean;
  try {
    valid = verifyCredentials(username, password);
  } catch (err) {
    console.error("login misconfiguration", err);
    return { error: "Admin login is not configured. Set ADMIN_USERNAME / ADMIN_PASSWORD." };
  }

  if (!valid) {
    return { error: "Incorrect username or password." };
  }

  const token = await createSessionToken(username);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  redirect(from.startsWith("/admin") ? from : "/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
