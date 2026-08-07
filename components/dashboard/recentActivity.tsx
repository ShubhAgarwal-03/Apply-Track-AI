import type { Application } from "@/types/application";
import { cn } from "@/lib/utils";

function describeActivity(app: Application): string {
  switch (app.status) {
    case "applied":
      return `Applied to ${app.roleTitle} at ${app.companyName}`;
    case "interviewing":
      return `Updated status to Interviewing for ${app.companyName}`;
    case "offer":
      return `Received offer from ${app.companyName}`;
    case "rejected":
      return `Marked rejected by ${app.companyName}`;
    default:
      return `Parsed ${app.roleTitle} at ${app.companyName}`;
  }
}

function timeAgo(date: Date | string): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

const DOT_COLOR: Record<string, string> = {
  applied: "bg-green-500",
  interviewing: "bg-amber-500",
  offer: "bg-emerald-500",
  rejected: "bg-red-500",
};

export function RecentActivity({ applications }: { applications: Application[] }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-slate-800 mb-3">Recent Activity</h3>
      {applications.length === 0 ? (
        <p className="text-xs text-slate-400">No activity yet.</p>
      ) : (
        <ul className="space-y-3">
          {applications.map((app) => (
            <li key={app.id} className="flex items-start gap-2.5">
              <span
                className={cn(
                  "mt-1.5 w-1.5 h-1.5 rounded-full shrink-0",
                  DOT_COLOR[app.status] ?? "bg-slate-300"
                )}
              />
              <div>
                <p className="text-xs text-slate-700 leading-snug">{describeActivity(app)}</p>
                <p className="text-[11px] text-slate-400">{timeAgo(app.updatedAt)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
