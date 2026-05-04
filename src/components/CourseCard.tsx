import { Link } from "@tanstack/react-router";
import { Clock, Users, BookOpen } from "lucide-react";
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
      className="block rounded-2xl bg-card p-5 text-card-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5"
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
        <div className="mt-4 flex flex-wrap gap-1.5">
          {course.tags.map((t) => (
            <span key={t} className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-medium text-success">
              #{t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2 text-[12px] text-foreground/80">
        <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.time}</div>
        <div className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{course.credits} 學分</div>
        <div className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          <span className={course.seatsLeft === 0 ? "text-primary font-semibold" : ""}>
            {course.seatsLeft === 0 ? "已額滿" : `剩 ${course.seatsLeft}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
