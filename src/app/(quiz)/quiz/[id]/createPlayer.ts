"use server";

import { PlayerType } from "@/types/playerTypes";
import CustomError from "@/utils/CustomError";
import { supabase } from "@/utils/supabase";
import { validateUser } from "@/utils/validateUser";

export async function createPlayer(payload: {
  quiz_id: number;
  next_question_id: string;
}) {
  // LINEユーザーの検証
  const { userId, name } = await validateUser();

  // playerの作成
  const { data, error } = await supabase
    .from("Player")
    .insert({ ...payload, user_id: userId, name })
    .select(
      `
        *,
        playeranswer_set:PlayerAnswer(*)
      `
    );

  if (error) {
    throw error;
  }

  if (!data || !data[0]) {
    throw new CustomError({
      message: "Something went wrong on supabae when creating player",
      statusCode: 500,
    });
  }

  return data[0] as PlayerType;
}
