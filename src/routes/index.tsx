import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { Heart, X, RotateCcw, GraduationCap } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { COURSES } from "@/data/courses";
import { appStore, useAppStore } from "@/store/app-store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "愛珍課 · 滑卡換課" }] }),
  component: SwipeHome,
});

function SwipeHome() {
  const state = useAppStore();
  if (!state.authed) return <LoginGate onPass={() => appStore.setAuthed(true)} />;
  return <SwipeDeck />;
}


function LoginGate({ onPass }: { onPass: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const validEmail = email.endsWith("@mail.shu.edu.tw") || email.endsWith("@shu.edu.tw");
  const valid = validEmail && password.length >= 6;
  return (
    <div className="min-h-screen w-full" style={{ background: "var(--gradient-warm)" }}>
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-6">
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-primary text-primary-foreground shadow-[var(--shadow-card)]">
          <GraduationCap className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold text-primary">愛珍課</h1>
        <p className="mt-1 text-sm text-foreground/70">世新大學 · 安全換課平台</p>

        <div className="mt-10 w-full rounded-2xl bg-card p-6 shadow-[var(--shadow-card)]">
          <p className="text-xs font-semibold text-success">實名制驗證</p>
          <h2 className="mt-1 text-lg font-bold">使用學校信箱登入</h2>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@mail.shu.edu.tw"
            className="mt-4 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密碼（至少 6 碼）"
            className="mt-3 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <button
            disabled={!valid}
            onClick={onPass}
            className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition active:scale-[0.97] active:brightness-90 disabled:opacity-40"
          >
            登入 / 註冊
          </button>
          <button
            onClick={onPass}
            className="mt-2 w-full rounded-xl py-2 text-xs text-muted-foreground underline transition active:scale-[0.97]"
          >
            （Demo 模式：直接體驗）
          </button>
        </div>
        <p className="mt-6 text-center text-[11px] leading-5 text-foreground/60">
          僅限世新大學在學學生使用<br />嚴禁任何金錢交易，違者停權
        </p>
      </div>
    </div>
  );
}

function SwipeDeck() {
  const state = useAppStore();
  const deck = useMemo(
    () => COURSES.filter((c) => !state.passed.includes(c.id) && !state.wantIn.includes(c.id)),
    [state.passed, state.wantIn]
  );
  const [drag, setDrag] = useState(0);
  const [flying, setFlying] = useState<"like" | "pass" | null>(null);
  const startX = useRef<number | null>(null);
  const dragging = useRef(false);
  const top = deck[0];

  const finish = useCallback(
    (dir: "like" | "pass") => {
      if (!top || flying) return;
      setFlying(dir);
      setTimeout(() => {
        if (dir === "like") appStore.likeCourse(top.id);
        else appStore.passCourse(top.id);
        setDrag(0);
        setFlying(null);
      }, 260);
    },
    [top, flying],
  );

  // 全域 pointer 事件，避免手指/滑鼠移出卡片就斷開
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current || startX.current === null) return;
      e.preventDefault();
      setDrag(e.clientX - startX.current);
    };
    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      const d = (drag);
      if (d > 70) finish("like");
      else if (d < -70) finish("pass");
      else setDrag(0);
      startX.current = null;
    };
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [drag, finish]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (flying) return;
    startX.current = e.clientX;
    dragging.current = true;
  };

  const flyX = flying === "like" ? 600 : flying === "pass" ? -600 : drag;
  const isInteracting = dragging.current || flying !== null;

  return (
    <AppShell title="左滑略過 · 右滑想換進">
      <div className="px-5 pt-4">
        <div className="rounded-2xl bg-primary/8 p-3 text-center text-[12px] text-primary">
          💡 拖曳卡片或點下方按鈕 · 配對後才會通知對方
        </div>
      </div>

      <div className="relative mx-auto mt-6 h-[500px] w-[88%]" style={{ touchAction: "none" }}>
        {!top ? (
          <div className="grid h-full place-items-center rounded-3xl bg-card text-center shadow-[var(--shadow-card)]">
            <div>
              <p className="text-base font-semibold">已經滑完囉！</p>
              <p className="mt-1 text-xs text-muted-foreground">到「許願池」查看配對結果</p>
              <button
                onClick={() => appStore.resetSwipes()}
                className="mt-4 inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />重新洗牌
              </button>
            </div>
          </div>
        ) : (
          <>
            {deck.slice(1, 3).reverse().map((c, i) => (
              <div
                key={c.id}
                className="absolute inset-0 rounded-3xl bg-card shadow-[var(--shadow-card)]"
                style={{ transform: `scale(${0.94 + i * 0.03}) translateY(${(2 - i) * -8}px)`, opacity: 0.6 }}
              />
            ))}
            <div
              className="absolute inset-0 cursor-grab touch-none select-none rounded-3xl bg-card p-6 shadow-[var(--shadow-card)] active:cursor-grabbing"
              style={{
                transform: `translateX(${flyX}px) rotate(${flyX * 0.06}deg)`,
                transition: isInteracting && !flying ? "none" : "transform 0.28s cubic-bezier(.2,.7,.3,1)",
                opacity: flying ? 0 : 1,
              }}
              onPointerDown={onPointerDown}
            >
              <CardFace course={top} drag={drag} />
            </div>
          </>
        )}
      </div>

      {top && (
        <div className="mt-6 flex justify-center gap-8">
          <button
            onClick={() => finish("pass")}
            className="grid h-14 w-14 place-items-center rounded-full bg-card text-primary shadow-[var(--shadow-soft)]"
            aria-label="略過"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            onClick={() => finish("like")}
            className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-card)]"
            aria-label="想換進"
          >
            <Heart className="h-6 w-6 fill-current" />
          </button>
        </div>
      )}
    </AppShell>
  );
}

function CardFace({ course, drag }: { course: (typeof COURSES)[number]; drag: number }) {
  const fatigueColor =
    course.fatigueIndex === "輕鬆" ? "bg-success text-success-foreground"
    : course.fatigueIndex === "適中" ? "bg-success/70 text-success-foreground"
    : "bg-primary text-primary-foreground";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">{course.department}</p>
          <h2 className="mt-1 text-2xl font-extrabold leading-tight text-primary">{course.name}</h2>
          <p className="mt-1 text-sm text-foreground/70">{course.professor} 老師</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${fatigueColor}`}>
          疲累 · {course.fatigueIndex}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Stat label="上課時間" value={course.time} />
        <Stat label="學分" value={`${course.credits} 學分`} />
        <Stat label="🔥 想丟出" value={`${course.wantToDrop} 人`} highlight />
        <Stat label="排隊換進" value={`${course.queueing} 人`} />
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold text-muted-foreground">學生標籤</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {course.tags.map((t) => (
            <span key={t} className="rounded-full bg-success/15 px-2.5 py-1 text-[12px] font-semibold text-success">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-background/60 p-3 text-[11px]">
        <p className="text-muted-foreground">目前持有這門課的同學</p>
        <p className="mt-1 font-semibold text-foreground/85">
          {course.holders.map((h) => h.nickname).join("、")}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between text-[11px] text-muted-foreground">
        <span>滑卡瀏覽 · 不影響選課</span>
        <span>← 略過 · 想換進 →</span>
      </div>

      {drag > 60 && (
        <div className="pointer-events-none absolute left-5 top-5 rotate-[-12deg] rounded-lg border-4 border-success px-3 py-1 text-lg font-extrabold text-success">
          想換進
        </div>
      )}
      {drag < -60 && (
        <div className="pointer-events-none absolute right-5 top-5 rotate-[12deg] rounded-lg border-4 border-primary px-3 py-1 text-lg font-extrabold text-primary">
          略過
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl bg-background/60 px-3 py-2.5">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className={`mt-0.5 text-sm font-bold ${highlight ? "text-primary" : ""}`}>{value}</p>
    </div>
  );
}
