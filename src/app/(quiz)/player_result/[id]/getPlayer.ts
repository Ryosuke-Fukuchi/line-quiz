import "server-only";
import { PlayerType } from "@/types/playerTypes";
import { supabase } from "@/utils/supabase";
import { cookies } from "next/headers";
import { verifyLineUser } from "@/utils/verifyLineUser";
import { PLAYER_STATUS } from "@/const.ts/player";
import { notFound } from "next/navigation";

export async function getPlayer(publicId: string): Promise<PlayerType> {
  // LINEユーザーの検証
  const { userId } = await validateUser();

  // playerの取得
  const { data, error } = await supabase
    .from("Player")
    .select("*")
    .eq("public_id", publicId);

  if (error || !data || data.length === 0) {
    console.error("Error occurred:", error);
    throw new Error("Error fetching Players");
  }

  // userとplayerの一致確認
  if (data[0].user_id !== userId) {
    // TODO: 403 Forbidden
    throw new Error("Forbidden");
  }

  if (data[0].status !== PLAYER_STATUS.done) {
    notFound();
  }

  return data[0];
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
  return { userId: userData.sub }; // LINEユーザーID
}
