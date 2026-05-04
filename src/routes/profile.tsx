import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Mail, LogOut } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAppStore, getCourse, appStore } from "@/store/app-store";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "個人課表 · 愛珍課" }] }),
  component: ProfilePage,
});

const days = ["一", "二", "三", "四", "五"];
const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function parseSlot(time: string): { day: number; periods: number[] } | null {
  const m = time.match(/週(.)\s*([\d\-]+)\s*節/);
  if (!m) return null;
  const day = days.indexOf(m[1]);
  if (day < 0) return null;
  const parts = m[2].split("-").map((s) => parseInt(s));
  let ps: number[] = [];
  if (parts.length === 1) ps = [parts[0]];
  else if (parts.length === 2) {
    for (let i = parts[0]; i <= parts[1]; i++) ps.push(i);
  } else ps = parts;
  return { day, periods: ps };
}

function ProfilePage() {
  const state = useAppStore();
  const courses = state.schedule.map(getCourse).filter(Boolean);

  const grid: Record<string, { id: string; name: string } | null> = {};
  for (const c of courses) {
    if (!c) continue;
    const slot = parseSlot(c.time);
    if (!slot) continue;
    for (const p of slot.periods) grid[`${slot.day}-${p}`] = { id: c.id, name: c.name };
  }

  const totalCredits = courses.reduce((s, c) => s + (c?.credits ?? 0), 0);

  return (
    <AppShell title="個人課表 · 換課結果預覽">
      <div className="space-y-4 px-5 pt-5">
        <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground font-bold">學</div>
            <div className="flex-1">
              <p className="text-base font-bold">學生 · Demo</p>
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Mail className="h-3 w-3" /> student@mail.shu.edu.tw
              </p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-success/15 px-2 py-1 text-[10px] font-semibold text-success">
              <ShieldCheck className="h-3 w-3" />已實名
            </span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Stat label="課程數" value={`${courses.length}`} />
            <Stat label="總學分" value={`${totalCredits}`} />
            <Stat label="想換進" value={`${state.wantIn.length}`} />
          </div>
        </div>

        <div className="rounded-2xl bg-card p-3 shadow-[var(--shadow-soft)]">
          <h3 className="px-2 pb-2 text-sm font-bold">本學期課表</h3>
          <div className="grid grid-cols-[28px_repeat(5,1fr)] gap-1 text-[10px]">
            <div />
            {days.map((d) => (
              <div key={d} className="py-1 text-center font-bold">週{d}</div>
            ))}
            {periods.map((p) => (
              <>
                <div key={`p${p}`} className="grid place-items-center text-muted-foreground">{p}</div>
                {days.map((_, di) => {
                  const cell = grid[`${di}-${p}`];
                  return (
                    <div
                      key={`${di}-${p}`}
                      className={`min-h-[36px] rounded-md p-1 leading-tight ${
                        cell ? "bg-success/85 text-success-foreground font-semibold" : "bg-background/40"
                      }`}
                    >
                      {cell?.name.slice(0, 4)}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <h3 className="text-sm font-bold">已加入課程</h3>
          <ul className="mt-2 space-y-2">
            {courses.map((c) => c && (
              <li key={c.id} className="flex items-center justify-between rounded-xl bg-background/50 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-primary">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.time} · {c.credits} 學分</p>
                </div>
                <button onClick={() => appStore.removeFromSchedule(c.id)} className="text-[11px] text-primary underline">移除</button>
              </li>
            ))}
            {courses.length === 0 && <p className="py-3 text-center text-xs text-muted-foreground">尚未加入課程</p>}
          </ul>
        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-semibold text-primary">
          <LogOut className="h-4 w-4" />登出
        </button>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-background/60 py-2">
      <p className="text-lg font-extrabold text-primary">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
