"use server";

import { PlayerType } from "@/types/playerTypes";
import { supabase } from "@/utils/supabase";
import { cookies } from "next/headers";
import { verifyLineUser } from "@/utils/verifyLineUser";
import CustomError from "@/utils/CustomError";

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
