type LineUserType = {
  userId: string;
  displayName: string;
};

export async function getLineUser(): Promise<LineUserType | null> {
  const res = await fetch("http://localhost:3000/api/liff/user");
  return res.json();
}
