"use server";

import { PlayerType } from "@/types/playerTypes";
import CustomError from "@/utils/CustomError";
import { supabase } from "@/utils/supabase";
import { verifyLineUser } from "@/utils/verifyLineUser";
import { cookies } from "next/headers";

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

async function validateUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("liffToken");

  if (!token) {
    throw new CustomError({
      message: "Token is not found",
      statusCode: 401,
    });
  }

  const verifyResponse = await verifyLineUser(token.value);

  if (!verifyResponse.ok) {
    if (verifyResponse.status === 401) {
      throw new CustomError({
        message: "User is not authenticated",
        statusCode: 401,
      });
    }

    throw new CustomError({
      message: "Something went wrong on verifying user",
      statusCode: 500,
    });
  }

  const userData = await verifyResponse.json();
  return { userId: userData.sub, name: userData.name }; // LINEユーザーID
}
