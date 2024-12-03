import { supabase } from "@/utils/supabase";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: playerId } = await params;

  try {
    const body = await request.json(); // リクエストのJSONボディを取得
    if (!body) {
      return NextResponse.json(
        { error: "Body is required." },
        { status: 400 } // Bad Request
      );
    }

    await supabase
      .from("PlayerAnswer")
      .insert({ ...body, player_id: playerId });

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error("POST request error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing POST request." },
      { status: 500 }
    );
  }
}
