import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET() {
  const { data, error } = await supabase.from("Quiz").select("*").eq("id", 1);

  if (error || !data) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 500 }
    );
  }

  return NextResponse.json(data[0] ?? {});
}
