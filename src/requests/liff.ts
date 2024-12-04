type LineUserType = {
  userId: string;
  displayName: string;
};

export async function getLineUser(): Promise<LineUserType | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/liff/user`);
  return res.json();
}
