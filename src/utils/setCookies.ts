"use server";
import { cookies } from "next/headers";

export async function setCookies(keyValues: Record<string, string>) {
  const cookieStore = await cookies();
  Object.entries(keyValues).forEach(([key, value]) => {
    cookieStore.set(key, value, { httpOnly: true });
  });
}
