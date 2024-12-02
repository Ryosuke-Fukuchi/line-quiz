import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET(
  _: never,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await params;

  const { data, error } = await supabase
    .from("Player")
    .select("*")
    .eq("user_id", userId);

  if (error || !data) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 500 }
    );
  }

  if (!data[0]) {
    return NextResponse.json({ message: "No player found" }, { status: 404 });
  }

  const player = data[0];

  const { data: questionData, error: questionError } = await supabase
    .from("Question")
    .select("*")
    .eq("question_number", player.question_number)
    .eq("quiz_id", 1);

  if (questionError || !questionData || questionData.length === 0) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ...player, next_question_id: questionData[0].id });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: playerId } = await params;
    const body = await request.json(); // リクエストのJSONボディを取得
    if (!body) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 } // Bad Request
      );
    }

    await supabase.from("Player").update(body).eq("id", Number(playerId));

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error("PATCH request error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing PATCH request." },
      { status: 500 }
    );
  }
}
