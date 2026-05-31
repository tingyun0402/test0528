import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft, Repeat, Bookmark } from "lucide-react";
import { getCourse, appStore, useAppStore } from "@/store/app-store";

export const Route = createFileRoute("/course/$courseId")({
  head: () => ({ meta: [{ title: "課程詳情 · 愛珍課" }] }),
  component: CourseDetail,
});

function CourseDetail() {
  const { courseId } = Route.useParams();
  const router = useRouter();
  const state = useAppStore();
  const c = getCourse(courseId);

  if (!c) {
    return (
      <div className="grid min-h-screen place-items-center bg-background p-6 text-center">
        <div>
          <p>找不到課程</p>
          <Link to="/" className="mt-3 inline-block text-primary underline">回首頁</Link>
        </div>
      </div>
    );
  }

  const wantingIn = state.wantIn.includes(c.id);
  const faved = state.favorites.includes(c.id);

  return (
    <div className="min-h-screen w-full" style={{ background: "var(--gradient-warm)" }}>
      <div className="mx-auto w-full max-w-md pb-20">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/60 bg-background/85 px-4 py-3 backdrop-blur">
          <button onClick={() => router.history.back()} className="rounded-full p-1.5 hover:bg-card">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-bold text-primary">課程詳情</h1>
        </header>

        <div className="space-y-4 px-5 pt-4">
          <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-card)]">
            <p className="text-xs font-semibold text-muted-foreground">{c.department}</p>
            <h2 className="mt-1 text-2xl font-extrabold text-primary">{c.name}</h2>
            <p className="mt-1 text-sm text-foreground/70">{c.professor} 老師 · {c.time} · {c.credits} 學分</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {c.tags.map((t) => (
                <span key={t} className="rounded-full bg-success/15 px-2.5 py-1 text-[12px] font-semibold text-success">#{t}</span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-success/85 p-4 text-success-foreground">
              <p className="text-xs">通過率</p>
              <p className="mt-1 text-3xl font-extrabold">{c.passRate}%</p>
            </div>
            <div className="rounded-2xl bg-primary p-4 text-primary-foreground">
              <p className="text-xs">死當率</p>
              <p className="mt-1 text-3xl font-extrabold">{c.failRate}%</p>
            </div>
          </div>

          <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
            <h3 className="text-sm font-bold">課程屬性</h3>
            <ul className="mt-2 space-y-1.5 text-sm">
              <Row k="需要分組" v={c.needsGroup ? "是" : "否"} bad={c.needsGroup} />
              <Row k="有期末報告" v={c.hasReport ? "是" : "否"} bad={c.hasReport} />
              <Row k="需額外付費" v={c.needsExtraFee ? "是" : "否"} bad={c.needsExtraFee} />
              <Row k="疲累指數" v={c.fatigueIndex} />
            </ul>
          </div>

          <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
            <h3 className="text-sm font-bold">學生留言評價</h3>
            <ul className="mt-3 space-y-3">
              {c.reviews.map((r, i) => (
                <li key={i} className="rounded-xl bg-background/50 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold">{r.author}</p>
                    <p className="text-xs text-success">{"★".repeat(r.rating)}</p>
                  </div>
                  <p className="mt-1 text-sm text-foreground/85">{r.text}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => appStore.toggleFavorite(c.id)}
              className={`rounded-xl py-3 text-sm font-semibold transition-all duration-150 active:scale-95 ${
                faved ? "bg-success text-success-foreground shadow-inner" : "bg-card text-primary border border-primary hover:bg-primary/5"
              }`}
            >
              <Bookmark className={`mr-1 inline h-4 w-4 ${faved ? "fill-current" : ""}`} />{faved ? "已收藏" : "收藏 / 考慮"}
            </button>
            <button
              onClick={() => appStore.toggleWantIn(c.id)}
              className={`rounded-xl py-3 text-sm font-semibold text-primary-foreground transition-all duration-150 active:scale-95 ${
                wantingIn ? "bg-success shadow-inner" : "bg-primary hover:brightness-110"
              }`}
            >
              <Repeat className="mr-1 inline h-4 w-4" />{wantingIn ? "已加入換課清單" : "加入換課清單"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v, bad }: { k: string; v: string; bad?: boolean }) {
  return (
    <li className="flex items-center justify-between border-b border-border/40 pb-1.5 last:border-0">
      <span className="text-foreground/70">{k}</span>
      <span className={`font-semibold ${bad ? "text-primary" : ""}`}>{v}</span>
    </li>
  );
}
