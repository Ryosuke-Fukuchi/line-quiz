export async function authenticate(token: string): Promise<boolean> {
  const res = await fetch("/api/liff/authenticate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) {
    console.error("failed to authenticate");
    return false;
  }

  return true;
}
