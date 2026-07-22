import { Activity, Bot, Database, Factory, FileText, LayoutDashboard, LifeBuoy, Settings, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/chat', label: 'AI Chat', icon: Bot },
  { to: '/documents', label: 'Documents', icon: FileText },
  { to: '/graph', label: 'Knowledge Graph', icon: Database },
  { to: '/maintenance', label: 'Maintenance', icon: Wrench },
  { to: '/analytics', label: 'Analytics', icon: Activity },
  { to: '/settings', label: 'Settings', icon: Settings }
];

export function Sidebar() {
  return (
    <aside className="hidden h-screen w-72 flex-col border-r border-slate-800/80 bg-slate-950/70 px-5 py-6 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-3 shadow-glow">
          <Factory className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-100">IndustrialGPT</p>
          <p className="text-sm text-slate-400">Operations Intelligence</p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
        <div className="flex items-center gap-2 text-cyan-300">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-sm font-medium">System health</span>
        </div>
        <p className="mt-2 text-2xl font-semibold text-slate-100">99.98%</p>
        <p className="mt-1 text-sm text-slate-400">All critical nodes online</p>
      </div>

      <nav className="mt-8 space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-blue-600/20 text-blue-300' : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100'}`
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Sparkles className="h-4 w-4 text-cyan-300" />
          <span>Copilot Assistant Ready</span>
        </div>
        <p className="mt-2 text-sm text-slate-400">Ask for insights, maintenance summaries, or anomaly context.</p>
        <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-500">
          <LifeBuoy className="h-4 w-4" />
          Open Assistant
        </button>
      </div>
    </aside>
  );
}
