import { Navbar } from "./Navbar";
import { MobileBottomNav } from "./MobileBottomNav";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pb-20 sm:pb-0">{children}</main>
      <MobileBottomNav />
    </div>
  );
}
