import Link from "next/link";
import { User, LogOut, HelpCircle, ChevronRight } from "lucide-react";

const SETTINGS_LINKS = [
  {
    href: "/settings/profile",
    label: "Profile",
    description: "Batch, branch, CGPA, citizenship",
    icon: User,
  },
];

export default function SettingsPage() {
  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-bold text-slate-900 mb-1">Settings</h1>
      <p className="text-sm text-slate-400 mb-6">Manage your account and preferences.</p>

      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
        {SETTINGS_LINKS.map(({ href, label, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <Icon size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">{label}</p>
                <p className="text-xs text-slate-400">{description}</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </Link>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden mt-4">
        <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 text-left">
          <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
            <HelpCircle size={16} />
          </div>
          <p className="text-sm font-medium text-slate-800">Help</p>
        </button>
        <form action="/api/logout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
              <LogOut size={16} />
            </div>
            <p className="text-sm font-medium text-red-600">Sign Out</p>
          </button>
        </form>
      </div>
    </div>
  );
}
