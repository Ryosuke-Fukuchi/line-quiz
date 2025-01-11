import { PlayerType } from "@/types/playerTypes";
import { supabase } from "@/utils/supabase";

export async function getPlayers(quizId: number): Promise<PlayerType[]> {
  // クライアントからリクエストを行わないので直supabaseを使う
  const { data, error } = await supabase
    .from("Player")
    .select("*")
    .eq("quiz_id", quizId);

  if (error || !data) {
    console.error("Error occurred:", error);
    throw new Error("Error fetching Players");
  }

  return data;
}
