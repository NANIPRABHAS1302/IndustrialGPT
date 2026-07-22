import { Outlet } from 'react-router-dom';

export function BlankLayout() {
  return <div className="min-h-screen bg-slate-950 text-slate-100"><Outlet /></div>;
}
