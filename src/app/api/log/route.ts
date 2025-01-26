import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  console.log("ログ:", body); // ターミナルに出力
  return NextResponse.json({ success: true });
}
