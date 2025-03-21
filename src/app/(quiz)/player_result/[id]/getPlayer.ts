import "server-only";

import { PlayerType } from "@/types/playerTypes";
import { supabase } from "@/utils/supabase";
import { PLAYER_STATUS } from "@/const/player";
import { notFound } from "next/navigation";
import CustomError from "@/utils/CustomError";
import { isUUIDv4 } from "@/utils/isUUIDv4";
import { validateUser } from "@/utils/validateUser";

export async function getPlayer(publicId: string): Promise<PlayerType> {
  if (!isUUIDv4(publicId)) {
    notFound();
  }

  // LINEユーザーの検証
  const { userId } = await validateUser();

  // playerの取得
  const { data, error } = await supabase
    .from("Player")
    .select("*")
    .eq("public_id", publicId);

  if (error) {
    // パラメータがuuidであることを担保されたうえでエラーが起きたらthrow
    throw error;
  }

  if (!data || data.length === 0) {
    notFound();
  }

  // statusがdoneでない場合は404
  if (data[0].status !== PLAYER_STATUS.done) {
    notFound();
  }

  // userとplayerが一致しない場合は403
  if (data[0].user_id !== userId) {
    throw new CustomError({
      message: "Forbidden at player_result",
      statusCode: 403,
    });
  }

  return data[0];
}
