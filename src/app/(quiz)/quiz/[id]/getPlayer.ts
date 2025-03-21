"use server";

import { PlayerType } from "@/types/playerTypes";
import { supabase } from "@/utils/supabase";
import { validateUser } from "@/utils/validateUser";

export async function getPlayer(quizId: number): Promise<PlayerType | null> {
  // LINEユーザーの検証
  const { userId } = await validateUser();

  // playerの取得
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

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    return null;
  }

  return data[0];
}
