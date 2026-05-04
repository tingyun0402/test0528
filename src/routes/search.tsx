import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CourseCard } from "@/components/CourseCard";
import { COURSES } from "@/data/courses";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "課程搜尋 · 愛珍課" }] }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState({
    noGroup: false,
    noReport: false,
    noFee: false,
    chill: false,
  });

  const results = useMemo(() => {
    return COURSES.filter((c) => {
      const text = `${c.name}${c.professor}${c.department}`;
      if (q && !text.includes(q)) return false;
      if (filters.noGroup && c.needsGroup) return false;
      if (filters.noReport && c.hasReport) return false;
      if (filters.noFee && c.needsExtraFee) return false;
      if (filters.chill && c.fatigueIndex !== "輕鬆") return false;
      return true;
    });
  }, [q, filters]);

  const chips = [
    { key: "noGroup", label: "不用分組" },
    { key: "noReport", label: "沒有報告" },
    { key: "noFee", label: "免額外付費" },
    { key: "chill", label: "甜課（輕鬆）" },
  ] as const;

  return (
    <AppShell title="課程搜尋與篩選">
      <div className="space-y-4 px-5 pt-5">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜尋課名、教授、系所..."
            className="w-full rounded-full border border-border bg-card pl-9 pr-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {chips.map((c) => {
            const active = filters[c.key];
            return (
              <button
                key={c.key}
                onClick={() => setFilters((f) => ({ ...f, [c.key]: !f[c.key] }))}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  active ? "bg-success text-success-foreground" : "bg-card text-foreground/70 border border-border"
                }`}
              >
                {active ? "✓ " : ""}{c.label}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground">找到 {results.length} 門課程</p>

        <div className="space-y-3 pb-4">
          {results.map((c) => <CourseCard key={c.id} course={c} />)}
          {results.length === 0 && (
            <div className="rounded-xl bg-card p-6 text-center text-sm text-muted-foreground">沒有符合的課程</div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
