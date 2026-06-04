import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Send, ShieldAlert, Loader2, AlertTriangle } from "lucide-react";
import { chatReply } from "@/lib/chat.functions";
import { appStore, useAppStore, type ChatMsg } from "@/store/app-store";

export const Route = createFileRoute("/chat/$peerId")({
  head: () => ({ meta: [{ title: "聊天 · 愛珍課" }] }),
  component: Chat,
});

const FORBIDDEN = ["金錢", "錢", "買", "賣", "價錢", "價格", "$", "NT", "付款", "轉帳", "Pay", "pay"];

function Chat() {
  const { peerId } = Route.useParams();
  const router = useRouter();
  const reply = useServerFn(chatReply);
  const state = useAppStore();
  const msgs: ChatMsg[] = state.chats[peerId] ?? [];
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Seed initial peer greeting once
  useEffect(() => {
    if (!state.chats[peerId]) {
      appStore.appendChat(peerId, {
        from: "peer",
        text: `嗨！我是 ${peerId}，看到我們配對成功，方便聊聊換課流程嗎？`,
        ts: Date.now(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerId]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs.length, pending]);

  const send = async () => {
    const value = text.trim();
    if (!value || pending) return;
    const warn = FORBIDDEN.some((k) => value.includes(k));
    const myMsg: ChatMsg = { from: "me", text: value, warn, ts: Date.now() };
    appStore.appendChat(peerId, myMsg);
    setText("");
    if (warn) return;

    setPending(true);
    try {
      const history = [...msgs, myMsg].map((m) => ({
        role: m.from === "me" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      }));
      const { text: aiText } = await reply({ data: { messages: history, peerName: peerId } });
      appStore.appendChat(peerId, { from: "peer", text: aiText, ts: Date.now() });
    } catch {
      appStore.appendChat(peerId, { from: "peer", text: "（AI 暫時無法回覆，等等再試試～）", ts: Date.now() });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen w-full" style={{ background: "var(--gradient-warm)" }}>
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col">
        <header className="flex items-center gap-3 border-b border-border/60 bg-background/85 px-4 py-3 backdrop-blur">
          <button onClick={() => router.history.back()} className="rounded-full p-1.5 transition active:scale-90 active:bg-card">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground font-bold">
            {peerId.slice(0, 1)}
          </div>
          <div>
            <h1 className="text-sm font-bold">{peerId}</h1>
            <p className="text-[10px] text-success">AI 模擬 · 配對中</p>
          </div>
        </header>

        <div className="bg-primary/10 px-4 py-2 text-center text-[11px] text-primary">
          ⚠ 嚴禁任何金錢交易，違者立即停權並通報校方
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                m.from === "me" ? "bg-primary text-primary-foreground" : "bg-card"
              }`}>
                {m.text}
                {m.warn && (
                  <div className="mt-2 flex items-start gap-1 rounded-lg bg-primary-foreground/15 p-2 text-[11px] font-semibold text-primary-foreground">
                    <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                    偵測到金錢交易字眼，已通報系統。換課平台禁止收費。
                  </div>
                )}
              </div>
            </div>
          ))}
          {pending && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl bg-card px-3 py-2 text-sm text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />輸入中...
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border/60 bg-background/85 p-3 backdrop-blur">
          <div className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="輸入訊息..."
              className="flex-1 bg-transparent py-2 text-sm outline-none"
            />
            <button
              onClick={send}
              disabled={pending || !text.trim()}
              className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground transition active:scale-90 active:brightness-110 disabled:opacity-50"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
