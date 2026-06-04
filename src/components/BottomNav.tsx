import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Sparkles, Search, User, Send } from "lucide-react";

const leftItems = [
  { to: "/messages", label: "聊天", icon: Send },
  { to: "/wishing-well", label: "許願池", icon: Sparkles },
] as const;

const rightItems = [
  { to: "/search", label: "搜尋", icon: Search },
  { to: "/profile", label: "我的", icon: User },
] as const;

export function BottomNav() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const swipeActive = path === "/";
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur">
      <ul className="relative flex justify-around">
        {leftItems.map(({ to, label, icon: Icon }) => {
          const active = path === to;
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={`flex flex-col items-center gap-1 py-2.5 text-xs transition-colors ${
                  active ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "fill-primary/10" : ""}`} />
                {label}
              </Link>
            </li>
          );
        })}

        {/* Center floating 滑卡 button */}
        <li className="flex-1 flex justify-center">
          <Link
            to="/"
            aria-label="滑卡"
            className="absolute left-1/2 -top-7 -translate-x-1/2 flex flex-col items-center"
          >
            <span
              className={`grid h-16 w-16 place-items-center rounded-full border-4 border-card shadow-[var(--shadow-card)] transition-transform active:scale-95 ${
                swipeActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/90 text-primary-foreground"
              }`}
            >
              <Heart className={`h-7 w-7 ${swipeActive ? "fill-current" : ""}`} />
            </span>
            <span
              className={`mt-1 text-xs ${
                swipeActive ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              滑卡
            </span>
          </Link>
        </li>

        {rightItems.map(({ to, label, icon: Icon }) => {
          const active = path === to;
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={`flex flex-col items-center gap-1 py-2.5 text-xs transition-colors ${
                  active ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "fill-primary/10" : ""}`} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
