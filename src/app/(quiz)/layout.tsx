import { LiffProvider } from "@/components/provider/liffProvider";
import { PlayerProvider } from "@/components/provider/playerProvider";

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LiffProvider>
      <PlayerProvider>{children}</PlayerProvider>
    </LiffProvider>
  );
}
