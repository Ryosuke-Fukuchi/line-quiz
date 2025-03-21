import "server-only";

import { cookies } from "next/headers";
import CustomError from "./CustomError";

// lineユーザーの検証
async function requestVerifyLineUser(idToken: string): Promise<Response> {
  if (process.env.NEXT_PUBLIC_LIFF_MOCK_MODE === "true") {
    const mockResponseData = {
      sub: "xxxxxxxxx",
      name: "テスト太郎",
    };

    // モックのレスポンスを Promise で包んで返す
    return Promise.resolve(
      new Response(JSON.stringify(mockResponseData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
  }

  const response = await fetch("https://api.line.me/oauth2/v2.1/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      id_token: idToken,
      client_id: process.env.LINE_CHANNEL_ID || "",
    }),
  });

  return response;
}

export async function validateUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("liffToken");

  if (!token) {
    throw new CustomError({
      message: "Token is not found",
      statusCode: 401,
    });
  }

  const verifyResponse = await requestVerifyLineUser(token.value);

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
