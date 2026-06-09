import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useState, type ReactNode } from "react";
import { ShieldCheck, Mail, LogOut, AlertTriangle, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAppStore, getCourse, appStore } from "@/store/app-store";
import { detectConflicts, parseSlot, DAY_NAMES, type Course } from "@/data/courses";

const FragmentRow = ({ children }: { children: ReactNode }) => <Fragment>{children}</Fragment>;

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "個人課表 · 愛珍課" }] }),
  component: ProfilePage,
});

const days = DAY_NAMES;
const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function ProfilePage() {
  const state = useAppStore();
  const courses = state.schedule.map(getCourse).filter((c): c is Course => Boolean(c));
  const conflicts = detectConflicts(courses);

  // build grid; mark cells with conflicts
  const grid: Record<string, { id: string; name: string; conflict: boolean } | null> = {};
  const conflictKeys = new Set<string>();
  for (const cf of conflicts) {
    for (const p of cf.periods) conflictKeys.add(`${cf.day}-${p}`);
  }
  for (const c of courses) {
    const slot = parseSlot(c.time);
    if (!slot) continue;
    for (const p of slot.periods) {
      const key = `${slot.day}-${p}`;
      grid[key] = { id: c.id, name: c.name, conflict: conflictKeys.has(key) };
    }
  }

  const totalCredits = courses.reduce((s, c) => s + c.credits, 0);

  return (
    <AppShell title="個人課表 · 換課結果預覽">
      <div className="space-y-4 px-5 pt-5">
        <div className="rounded-3xl bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground font-bold">明</div>
            <div className="flex-1">
              <p className="text-base font-bold">資傳二甲 · 小明</p>
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

        {conflicts.length > 0 && (
          <div className="rounded-3xl border-2 border-primary bg-primary/10 p-4 shadow-[var(--shadow-soft)] animate-pulse">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-extrabold text-primary">⚠ 偵測到 {conflicts.length} 組衝堂！</h3>
            </div>
            <ul className="mt-3 space-y-2">
              {conflicts.map((cf, i) => (
                <li key={i} className="rounded-xl bg-card p-3 text-xs">
                  <p className="font-bold text-primary">
                    週{days[cf.day]} 第 {cf.periods.join("、")} 節
                  </p>
                  <p className="mt-1 text-foreground/80">
                    <span className="font-semibold">{cf.a.name}</span>
                    <span className="mx-1.5 text-primary">⇄</span>
                    <span className="font-semibold">{cf.b.name}</span>
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => appStore.removeFromSchedule(cf.a.id)} className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">
                      移除「{cf.a.name}」
                    </button>
                    <button onClick={() => appStore.removeFromSchedule(cf.b.id)} className="rounded-full bg-primary/80 px-3 py-1 text-[11px] font-semibold text-primary-foreground">
                      移除「{cf.b.name}」
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-3xl bg-card p-3 shadow-[var(--shadow-soft)]">
          <h3 className="px-2 pb-2 text-sm font-bold">本學期課表</h3>
          <div className="grid grid-cols-[28px_repeat(5,1fr)] gap-1 text-[10px]">
            <div />
            {days.map((d) => (
              <div key={d} className="py-1 text-center font-bold">週{d}</div>
            ))}
            {periods.map((p) => (
              <FragmentRow key={`row-${p}`}>
                <div className="grid place-items-center text-muted-foreground">{p}</div>
                {days.map((_, di) => {
                  const cell = grid[`${di}-${p}`];
                  return (
                    <div
                      key={`${di}-${p}`}
                      className={`min-h-[36px] rounded-md p-1 leading-tight ${
                        cell
                          ? cell.conflict
                            ? "bg-primary text-primary-foreground font-semibold ring-2 ring-primary/60 animate-pulse"
                            : "bg-success/85 text-success-foreground font-semibold"
                          : "bg-background/40"
                      }`}
                    >
                      {cell?.name.slice(0, 4)}
                    </div>
                  );
                })}
              </FragmentRow>
            ))}
          </div>
          {conflicts.length > 0 && (
            <p className="px-2 pt-2 text-[10px] text-primary">紅色格子 = 衝堂時段</p>
          )}
        </div>

        <div className="rounded-3xl bg-card p-4 shadow-[var(--shadow-soft)]">
          <h3 className="text-sm font-bold">已加入課程</h3>
          <ul className="mt-2 space-y-2">
            {courses.map((c) => {
              const kindColor =
                c.kind === "必修" ? "bg-primary text-primary-foreground"
                : c.kind === "選修" ? "bg-success/80 text-success-foreground"
                : "bg-muted text-foreground/70";
              return (
                <li key={c.id} className="flex items-center justify-between rounded-xl bg-background/50 p-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${kindColor}`}>{c.kind}</span>
                      <p className="truncate text-sm font-bold text-primary">{c.name}</p>
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{c.time} · {c.credits} 學分</p>
                  </div>
                  {c.kind === "通識" ? (
                    <button onClick={() => appStore.removeFromSchedule(c.id)} className="text-[11px] text-primary underline">移除</button>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">不可換</span>
                  )}
                </li>
              );
            })}
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
