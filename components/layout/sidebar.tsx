"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  Table2,
  Sparkles,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/tracker", label: "Tracker", icon: Table2 },
  { href: "/ai-input", label: "AI Input", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-slate-200 bg-white h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-slate-100">
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">
          ApplyTrack AI
        </h1>
        <p className="text-xs text-slate-400">Career Assistant</p>
      </div>

      <div className="px-4 pt-4">
        <Link
          href="/ai-input"
          className="flex items-center justify-center gap-2 w-full bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
        >
          <Plus size={16} />
          New Application
        </Link>
      </div>

      <nav className="flex-1 px-3 mt-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-blue-50 text-blue-900 border-l-2 border-blue-900 -ml-px"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <Icon size={17} strokeWidth={active ? 2.4 : 2} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-slate-100 space-y-1">
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-50 w-full">
          <HelpCircle size={17} />
          Help
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-50 w-full"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}