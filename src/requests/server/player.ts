import "server-only";

import { PlayerType } from "@/types/playerTypes";
import { supabase } from "@/utils/supabase";
import CustomError from "@/utils/CustomError";

export async function getQuizPlayers(quizId: number): Promise<PlayerType[]> {
  // クライアントからリクエストを行わないので直supabaseを使う
  const { data, error } = await supabase
    .from("Player")
    .select("*")
    .eq("quiz_id", quizId);

  if (error) {
    throw error;
  }

  if (!data) {
    throw new CustomError({
      message: "Something went wrong on fetching quiz-players",
      statusCode: 500,
    });
  }

  return data;
}
