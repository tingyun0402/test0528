import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Sparkles, ArrowRightLeft, MessageCircle, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Confetti } from "@/components/Confetti";
import { appStore, useAppStore, getCourse } from "@/store/app-store";


export const Route = createFileRoute("/wishing-well")({
  head: () => ({ meta: [{ title: "許願池 · 愛珍課" }] }),
  component: WishingWell,
});

// Mock other students' wishes for matching demo
const otherUsers = [
  { name: "小新", out: "c1", in: "c3" }, // 對方有 網站規劃 想換 傳播理論
  { name: "阿傑", out: "c5", in: "c3" },
  { name: "Mia", out: "c2", in: "c8" },
];

function WishingWell() {
  const state = useAppStore();
  const [matched, setMatched] = useState<typeof otherUsers[number] | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);

  const matches = useMemo(() => {
    return otherUsers.filter(
      (u) => state.wantIn.includes(u.out) && state.wantOut.includes(u.in) && !dismissed.includes(u.name)
    );
  }, [state, dismissed]);

  useEffect(() => {
    if (matches.length > 0 && !matched) setMatched(matches[0]);
  }, [matches, matched]);

  return (
    <AppShell title="許願池 · 配對換課">
      <div className="space-y-5 px-5 pt-5">
        <div className="rounded-2xl bg-primary p-5 text-primary-foreground shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-lg font-bold">配對成功 {matches.length} 筆</h2>
          </div>
          <p className="mt-1 text-xs opacity-90">設定「換出」與「換進」清單，讓系統幫你雙向配對</p>
        </div>

        <Section
          title="我想換出（目前手上的課）"
          ids={state.wantOut}
          empty="尚未設定要換出的課程"
          onRemove={(id) => appStore.toggleWantOut(id)}
        />

        <div>
          <h3 className="mb-1 px-1 text-sm font-bold">新增可換出的課程</h3>
          <p className="mb-2 px-1 text-[11px] text-muted-foreground">只顯示你手上的通識課（必修/選修不可換）</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {state.schedule
              .map(getCourse)
              .filter((c): c is NonNullable<ReturnType<typeof getCourse>> =>
                Boolean(c) && c!.kind === "通識" && !state.wantOut.includes(c!.id))
              .map((c) => (
                <button
                  key={c.id}
                  onClick={() => appStore.toggleWantOut(c.id)}
                  className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium"
                >
                  + {c.name}
                </button>
              ))}
            {state.schedule
              .map(getCourse)
              .filter((c) => c && c.kind === "通識" && !state.wantOut.includes(c.id))
              .length === 0 && (
              <p className="text-[11px] text-muted-foreground">手上的通識課都已加入</p>
            )}
          </div>
        </div>


        <Section
          title="我想換進"
          ids={state.wantIn}
          empty="到首頁右滑你想要的課程！"
          onRemove={(id) => appStore.toggleWantIn(id)}
        />

        <div className="rounded-2xl bg-card p-4 text-center shadow-[var(--shadow-soft)]">
          <p className="text-xs text-muted-foreground">配對成功的同學</p>
          {matches.length === 0 ? (
            <p className="mt-2 text-sm">尚無配對 · 多滑幾張卡看看吧</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {matches.map((m) => (
                <li key={m.name} className="flex items-center justify-between rounded-xl bg-background/60 p-3 text-left text-sm">
                  <div>
                    <p className="font-bold">{m.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {getCourse(m.out)?.name} ⇄ {getCourse(m.in)?.name}
                    </p>
                  </div>
                  <Link
                    to="/chat/$peerId" params={{ peerId: m.name }}
                    className="rounded-full bg-success px-3 py-1.5 text-xs font-semibold text-success-foreground"
                  >
                    <MessageCircle className="mr-1 inline h-3 w-3" />聊聊
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Confetti active={!!matched} />
      {matched && (
        <MatchModal
          peer={matched}
          onClose={() => { setDismissed((d) => [...d, matched.name]); setMatched(null); }}
        />
      )}
    </AppShell>
  );
}

function Section({
  title, ids, empty, onRemove,
}: { title: string; ids: string[]; empty: string; onRemove: (id: string) => void }) {
  return (
    <div>
      <h3 className="mb-2 px-1 text-sm font-bold">{title}</h3>
      {ids.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-4 text-center text-xs text-muted-foreground">
          {empty}
        </div>
      ) : (
        <ul className="space-y-2">
          {ids.map((id) => {
            const c = getCourse(id);
            if (!c) return null;
            return (
              <li key={id} className="flex items-center justify-between rounded-xl bg-card p-3 shadow-[var(--shadow-soft)]">
                <div>
                  <p className="text-sm font-bold text-primary">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.professor} · {c.time}</p>
                </div>
                <button onClick={() => onRemove(id)} className="rounded-full p-1.5 text-muted-foreground hover:bg-background/60">
                  <X className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function MatchModal({ peer, onClose }: { peer: typeof otherUsers[number]; onClose: () => void }) {
  const out = getCourse(peer.in)!; // 我換出的 = 對方想要的
  const inn = getCourse(peer.out)!; // 我換進的 = 對方手上的
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-6 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-card p-6 text-center shadow-[var(--shadow-card)]">
        <Sparkles className="mx-auto h-10 w-10 text-success" />
        <h2 className="mt-3 text-2xl font-extrabold text-primary">🎉 配對成功！</h2>
        <p className="mt-1 text-sm text-foreground/70">你和 <b>{peer.name}</b> 互相符合</p>

        <div className="mt-5 flex items-center justify-between gap-2 rounded-2xl bg-background/60 p-4">
          <div className="flex-1 text-xs">
            <p className="text-muted-foreground">你換出</p>
            <p className="mt-1 font-bold">{out.name}</p>
          </div>
          <ArrowRightLeft className="h-5 w-5 text-primary" />
          <div className="flex-1 text-xs">
            <p className="text-muted-foreground">你換進</p>
            <p className="mt-1 font-bold">{inn.name}</p>
          </div>
        </div>

        <Link
          to="/chat/$peerId" params={{ peerId: peer.name }}
          className="mt-5 block w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
        >
          開始聊天，協調換課時間
        </Link>
        <button onClick={onClose} className="mt-2 w-full rounded-xl py-2 text-xs text-muted-foreground">稍後處理</button>
      </div>
    </div>
  );
}
