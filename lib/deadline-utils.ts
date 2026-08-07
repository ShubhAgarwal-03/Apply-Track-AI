export type DeadlineUrgency = "overdue" | "today" | "soon" | "upcoming" | "far" | "none";

export function getDaysLeft(deadline: string | Date | null): number | null {
  if (!deadline) return null;
  const d = new Date(deadline);
  const today = new Date();
  d.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffMs = d.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function getDeadlineUrgency(deadline: string | Date | null): DeadlineUrgency {
  const days = getDaysLeft(deadline);
  if (days === null) return "none";
  if (days < 0) return "overdue";
  if (days === 0) return "today";
  if (days <= 3) return "soon";
  if (days <= 14) return "upcoming";
  return "far";
}

export function formatDeadlineLabel(deadline: string | Date | null): string {
  const days = getDaysLeft(deadline);
  if (days === null) return "No deadline";
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return "Due today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

export function formatDateShort(date: string | Date | null): string {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

export const URGENCY_STYLES: Record
  DeadlineUrgency,
  { bg: string; text: string; dot: string }
> = {
  overdue: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  today: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  soon: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  upcoming: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  far: { bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400" },
  none: { bg: "bg-slate-50", text: "text-slate-400", dot: "bg-slate-300" },
};