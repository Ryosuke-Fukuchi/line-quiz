import { supabase } from "@/utils/supabase";
import { verifyLineUser } from "@/utils/verifyLineUser";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get("q");

    if (!quizId) {
      return NextResponse.json(
        { error: "quizId is required." },
        { status: 400 } // Bad Request
      );
    }

    // LINEユーザーの検証
    const cookieStore = await cookies();
    const token = cookieStore.get("liffToken");
    if (!token) {
      return NextResponse.json(
        { error: "LIFF Token is not set." },
        { status: 401 } // Bad Request
      );
    }
    const verifyResponse = await verifyLineUser(token.value);

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
      .eq("quiz_id", quizId)
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

    // TODO: LINEユーザーの検証

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
