import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen w-full" style={{ background: "var(--gradient-warm)" }}>
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
        <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
          <div className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground font-bold">愛</span>
              <div>
                <h1 className="text-base font-bold leading-tight text-primary">愛珍課</h1>
                <p className="text-[10px] leading-tight text-muted-foreground">{title}</p>
              </div>
            </div>
            <span className="rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-semibold text-success">世新大學</span>
          </div>
        </header>
        <main className="flex-1 pb-24">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
