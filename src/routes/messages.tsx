import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { MessageCircle, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAppStore, getCourse } from "@/store/app-store";

export const Route = createFileRoute("/messages")({
  head: () => ({ meta: [{ title: "聊天訊息 · 愛珍課" }] }),
  component: Messages,
});

// Keep in sync with wishing-well otherUsers
const otherUsers = [
  { name: "小新", out: "c1", in: "c3" },
  { name: "阿傑", out: "c5", in: "c3" },
  { name: "Mia", out: "c2", in: "c8" },
];

const palette = [
  "bg-primary text-primary-foreground",
  "bg-success text-success-foreground",
  "bg-accent text-accent-foreground",
  "bg-secondary text-secondary-foreground",
];

function avatarColor(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return palette[h % palette.length];
}

function Messages() {
  const state = useAppStore();

  const matches = useMemo(
    () => otherUsers.filter((u) => state.wantIn.includes(u.out) && state.wantOut.includes(u.in)),
    [state.wantIn, state.wantOut],
  );

  // Also include any peer that already has chat history (even if unmatched later)
  const allPeers = useMemo(() => {
    const map = new Map<string, { name: string; out?: string; in?: string }>();
    matches.forEach((m) => map.set(m.name, m));
    Object.keys(state.chats).forEach((name) => {
      if (!map.has(name)) map.set(name, { name });
    });
    return Array.from(map.values());
  }, [matches, state.chats]);

  return (
    <AppShell title="聊天訊息">
      <div className="space-y-4 px-5 pt-5">
        <div className="rounded-2xl bg-primary p-5 text-primary-foreground shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <h2 className="text-lg font-bold">配對聊天室 {allPeers.length}</h2>
          </div>
          <p className="mt-1 text-xs opacity-90">與配對成功的同學協調換課時間與流程</p>
        </div>

        {allPeers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center text-sm text-muted-foreground">
            還沒有配對成功的對話<br />到許願池設定換課清單試試！
          </div>
        ) : (
          <ul className="space-y-2">
            {allPeers.map((p) => {
              const msgs = state.chats[p.name] ?? [];
              const last = msgs[msgs.length - 1];
              const outName = p.in ? getCourse(p.in)?.name : null;
              const inName = p.out ? getCourse(p.out)?.name : null;
              return (
                <li key={p.name}>
                  <Link
                    to="/chat/$peerId"
                    params={{ peerId: p.name }}
                    className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-[var(--shadow-soft)] transition active:scale-[0.98] active:brightness-95"
                  >
                    <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-lg font-bold ${avatarColor(p.name)}`}>
                      {p.name.slice(0, 1)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-bold">{p.name}</p>
                        {outName && inName && (
                          <span className="shrink-0 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">
                            已配對
                          </span>
                        )}
                      </div>
                      {outName && inName && (
                        <p className="truncate text-[11px] text-muted-foreground">
                          換出 {outName} ⇄ 換進 {inName}
                        </p>
                      )}
                      <p className="mt-0.5 truncate text-xs text-foreground/70">
                        {last ? `${last.from === "me" ? "你：" : ""}${last.text}` : "點擊開始聊天"}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
