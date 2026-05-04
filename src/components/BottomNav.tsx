import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Sparkles, Search, User } from "lucide-react";

const items = [
  { to: "/", label: "滑卡", icon: Heart },
  { to: "/wishing-well", label: "許願池", icon: Sparkles },
  { to: "/search", label: "搜尋", icon: Search },
  { to: "/profile", label: "我的", icon: User },
] as const;

export function BottomNav() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur">
      <ul className="flex justify-around">
        {items.map(({ to, label, icon: Icon }) => {
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
