import { getAllCookies } from "@/utils/cookies";

type LineUserType = {
  userId: string;
  displayName: string;
};

export async function getLineUser(): Promise<LineUserType | null> {
  const cookie = await getAllCookies();
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/liff/user`, {
    method: "GET",
    headers: {
      cookie,
    },
  });
  return res.json();
}
