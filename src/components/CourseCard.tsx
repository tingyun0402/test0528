import { Link } from "@tanstack/react-router";
import { Clock, BookOpen, Flame, Users } from "lucide-react";
import type { Course } from "@/data/courses";

export function CourseCard({ course, compact = false }: { course: Course; compact?: boolean }) {
  const fatigueColor =
    course.fatigueIndex === "輕鬆" ? "bg-success text-success-foreground"
    : course.fatigueIndex === "適中" ? "bg-success/70 text-success-foreground"
    : "bg-primary text-primary-foreground";

  return (
    <Link
      to="/course/$courseId"
      params={{ courseId: course.id }}
      className="block rounded-3xl bg-card p-5 text-card-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground">{course.department}</p>
          <h3 className="mt-0.5 truncate text-lg font-bold text-primary">{course.name}</h3>
          <p className="mt-0.5 text-sm text-foreground/70">{course.professor} 老師</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${fatigueColor}`}>
          {course.fatigueIndex}
        </span>
      </div>

      {!compact && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {course.tags.map((t) => (
            <span key={t} className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-medium text-success">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2 text-[12px] text-foreground/80">
        <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.time}</div>
        <div className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{course.credits} 學分</div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-2xl bg-background/60 px-3 py-2 text-[11px]">
        <span className="flex items-center gap-1 font-semibold text-primary">
          <Flame className="h-3.5 w-3.5" />{course.wantToDrop} 人想丟出
        </span>
        <span className="flex items-center gap-1 text-success font-semibold">
          <Users className="h-3.5 w-3.5" />{course.queueing} 人排隊換進
        </span>
      </div>
    </Link>
  );
}
