import "server-only";

// lineユーザーの検証
export async function verifyLineUser(idToken: string): Promise<Response> {
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
