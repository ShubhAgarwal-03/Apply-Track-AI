import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: "default" | "warning" | "danger";
  trend?: string;
}

const TONE_STYLES = {
  default: { bg: "bg-white", icon: "text-blue-700 bg-blue-50" },
  warning: { bg: "bg-amber-50", icon: "text-amber-700 bg-amber-100" },
  danger: { bg: "bg-red-50", icon: "text-red-700 bg-red-100" },
};

export function StatCard({ label, value, icon: Icon, tone = "default", trend }: StatCardProps) {
  const style = TONE_STYLES[tone];
  return (
    <div className={cn("border border-slate-200 rounded-xl p-4", style.bg)}>
      <div className="flex items-center justify-between mb-3">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", style.icon)}>
          <Icon size={16} />
        </div>
        {trend && (
          <span className="text-xs font-medium text-green-600">{trend}</span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}
