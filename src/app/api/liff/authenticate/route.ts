import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = (await req.json()) as { token: string };
  const token = body.token;

  // Verify the token
  // const verifyRes = await fetch(
  //   `https://api.line.me/oauth2/v2.1/verify?access_token=${token}`,
  // );

  const verifyRes = { ok: true };

  if (!verifyRes.ok) {
    console.error("failed to verify token");
    return NextResponse.error();
  }

  // ユーザー登録処理など...

  const res = NextResponse.json({ message: "success" });

  const cookieStore = await cookies();
  cookieStore.set({
    name: "token",
    value: token,
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  return res;
};
