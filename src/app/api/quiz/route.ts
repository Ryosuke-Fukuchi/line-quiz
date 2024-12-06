import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("Quiz")
    .select(
      `
      id,
      title,
      description,
      question_set:Question (
        id
      )
    `
    )
    .eq("id", process.env.QUIZ_ID);

  if (error || !data) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 500 }
    );
  }

  return NextResponse.json(data[0] ?? {});
}
