"use server";

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
  const { error } = await supabase
    .from("Player")
    .insert({ ...payload, user_id: userId, name });

  if (error) {
    console.error("An error occured:", error);
    throw new Error("Internal Server Error");
  }
}

async function validateUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("liffToken");
  if (!token) {
    // TODO: 401 Unauthorized
    throw new Error("User is not authenticated.");
  }
  const verifyResponse = await verifyLineUser(token.value);

  if (!verifyResponse.ok) {
    if (verifyResponse.status === 401) {
      // TODO: 401 Unauthorized
      throw new Error("User is not authenticated.");
    } else {
      throw new Error("Validate User Failed. Something went wrong.");
    }
  }

  const userData = await verifyResponse.json();
  return { userId: userData.sub, name: userData.name }; // LINEユーザーID
}
