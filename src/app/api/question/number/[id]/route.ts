import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET(
  _: never,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: questionNumber } = await params;

  const { data, error } = await supabase
    .from("Question")
    .select("*")
    .eq("quiz_id", 1)
    .eq("question_number", Number(questionNumber));

  if (error || !data) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 500 }
    );
  }

  if (!data[0]) {
    return NextResponse.json({ message: "No Question found" }, { status: 404 });
  }

  return NextResponse.json(data[0]);
}
