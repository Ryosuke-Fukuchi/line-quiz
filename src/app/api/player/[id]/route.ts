import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET(
  _: never,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await params;

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
    console.error("Error occurred:", error);
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 500 }
    );
  }

  if (!data[0]) {
    return NextResponse.json({ message: "No player found" }, { status: 404 });
  }

  return NextResponse.json(data[0], { status: 200 });
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
        { error: "Body is required." },
        { status: 400 } // Bad Request
      );
    }

    let playerAnswerBody = null;
    if ("playeranswer" in body) {
      playerAnswerBody = { ...body.playeranswer };
      delete body.playeranswer;
    }

    const { error } = await supabase
      .from("Player")
      .update({ ...body })
      .eq("id", Number(playerId));

    if (error) {
      console.error("Error occurred:", error);
      return NextResponse.json(
        { error: "Update Player Failed. Something went wrong." },
        { status: 400 } // Bad Request
      );
    }

    if (playerAnswerBody) {
      const { error } = await supabase
        .from("PlayerAnswer")
        .insert({ ...playerAnswerBody, player_id: playerId });

      if (error) {
        console.error("Error occurred:", error);
        return NextResponse.json(
          { error: "Create PlayerAnswer Failed. Something went wrong." },
          { status: 400 } // Bad Request
        );
      }
    }

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error("PATCH request error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing PATCH request." },
      { status: 500 }
    );
  }
}
