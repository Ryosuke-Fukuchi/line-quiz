import { supabase } from "@/utils/supabase";
import { verifyLineUser } from "@/utils/verifyLineUser";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("t");

    if (!token) {
      return NextResponse.json(
        { error: "token is required." },
        { status: 400 } // Bad Request
      );
    }

    // LINEユーザーの検証
    const verifyResponse = await verifyLineUser(token);

    if (!verifyResponse.ok) {
      return NextResponse.json(
        { error: "Liff Verification failed." },
        { status: verifyResponse.status }
      );
    }

    const userData = await verifyResponse.json();
    const userId = userData.sub; // LINEユーザーID

    const { data, error } = await supabase
      .from("Player")
      .select(
        `
      *,
      playeranswer_set:PlayerAnswer(*)
    `
      )
      .eq("user_id", userId);

    if (error || !data) {
      console.error("GET request error:", error);
      return NextResponse.json(
        { error: "An unexpected error occurred while fetching player." },
        { status: 500 }
      );
    }

    if (!data[0]) {
      return NextResponse.json({ message: "No player found" }, { status: 404 });
    }

    return NextResponse.json(data[0], { status: 200 });
  } catch (error) {
    console.error("GET request error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching player." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json(); // リクエストのJSONボディを取得
    if (!body) {
      return NextResponse.json(
        { error: "Body is required." },
        { status: 400 } // Bad Request
      );
    }

    await supabase.from("Player").insert(body);

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error("POST request error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing POST request." },
      { status: 500 }
    );
  }
}
