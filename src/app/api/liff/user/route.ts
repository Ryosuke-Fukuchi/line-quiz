import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const lineUser = {
    userId: "xxx",
    displayName: "Demo User",
  };

  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token?.value) {
    return NextResponse.error();
  }

  //   if (error || !data) {
  //     console.error("Error occurred:", error);
  //     return NextResponse.error();
  //   }

  return NextResponse.json(lineUser);
}
