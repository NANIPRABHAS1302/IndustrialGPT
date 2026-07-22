import { Bell, ChevronDown, LogOut, Search, SunMoon } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60 px-4 py-4 backdrop-blur-xl sm:px-6">
      <div className="flex flex-1 items-center gap-3">
        <label className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/70 px-3 py-2.5 text-slate-400 sm:max-w-xl">
          <Search className="h-4 w-4" />
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
            placeholder="Search assets, insights, documents..."
          />
        </label>
      </div>

      <div className="ml-4 flex items-center gap-2 sm:gap-3">
        <button className="rounded-xl border border-slate-800/80 bg-slate-900/70 p-2.5 text-slate-300 transition hover:bg-slate-800/70">
          <SunMoon className="h-5 w-5" />
        </button>
        <button className="relative rounded-xl border border-slate-800/80 bg-slate-900/70 p-2.5 text-slate-300 transition hover:bg-slate-800/70">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-cyan-400" />
        </button>
        <div className="relative">
          <button
            className="flex items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-2 text-sm text-slate-200"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400" />
            <span className="hidden sm:block">{user?.name ?? 'Operator'}</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 z-10 mt-2 w-48 rounded-2xl border border-slate-800/80 bg-slate-900/90 p-2 shadow-xl">
              <div className="px-3 py-2 text-sm text-slate-400">
                <p className="font-medium text-slate-100">{user?.name ?? 'Operator'}</p>
                <p>{user?.email ?? 'ops@industrialgpt.local'}</p>
              </div>
              <button
                className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800/70"
                onClick={() => {
                  void logout();
                  setIsMenuOpen(false);
                }}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
