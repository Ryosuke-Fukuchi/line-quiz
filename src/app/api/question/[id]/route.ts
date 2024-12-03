import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET(
  _: never,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: questionId } = await params;

  const { data, error } = await supabase
    .from("Question")
    .select(
      `
          id,
          content,
          question_type,
          question_number,
          questionselect:QuestionSelect (
            id,
            answer_points,
            additional_points,
            select_counts,
            questionselectchoice_set:QuestionSelectChoice (
              id,
              content,
              is_answer,
              sort_order
            )
          ),
          questionsort:QuestionSort (
            id,
            answer_points,
            additional_points,
            questionsortchoice_set:QuestionSortChoice (
              id,
              content,
              display_sort_order,
              correct_sort_order
            )
          )
        `
    )
    .eq("id", questionId);

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
