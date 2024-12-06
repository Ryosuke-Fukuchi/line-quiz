import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET(
  _: never,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: quizId } = await params;

  const { data, error } = await supabase
    .from("Player")
    .select("*")
    .eq("quiz_id", quizId);

  if (error || !data) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 500 }
    );
  }

  return NextResponse.json({ players: data }, { status: 200 });
}
