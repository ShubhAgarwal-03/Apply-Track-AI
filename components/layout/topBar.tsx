"use client";

import { Search, Bell, User } from "lucide-react";

interface TopbarProps {
  userName?: string;
  userRole?: string;
}

export function Topbar({ userName = "Alex Mercer", userRole = "Software Engineer" }: TopbarProps) {
  return (
    <header className="hidden md:flex items-center justify-end gap-4 px-6 py-4 border-b border-slate-200 bg-white">
      <button className="text-slate-400 hover:text-slate-600">
        <Search size={19} />
      </button>
      <button className="text-slate-400 hover:text-slate-600">
        <Bell size={19} />
      </button>
      <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
          <User size={16} />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-medium text-slate-800">{userName}</p>
          <p className="text-xs text-slate-400">{userRole}</p>
        </div>
      </div>
    </header>
  );
}