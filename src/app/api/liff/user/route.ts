import { NextResponse } from "next/server";

export async function GET() {
  const lineUser = {
    userId: "xxx",
    displayName: "Demo User",
  };

  //   if (error || !data) {
  //     console.error("Error occurred:", error);
  //     return NextResponse.error();
  //   }

  return NextResponse.json(lineUser);
}
