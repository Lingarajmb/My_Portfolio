import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  LayoutDashboard,
  Sparkles,
  Briefcase,
  Wrench,
  FolderGit2,
  FileText,
  FileCheck2,
  Image,
  Mail,
  Database,
  LogOut,
  ExternalLink,
  Save,
  Menu,
  X,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Users,
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onReturnToPortfolio: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onReturnToPortfolio,
  children,
}) => {
  const { user, logout, authorizedAdminEmail, pendingRegistrationsCount } = useAuth();
  const { isSupabaseConfigured, syncStatus, isSyncing, refreshFromDatabase } = usePortfolio();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    {
      id: 'users',
      label: 'User Registrations',
      icon: Users,
      badge: pendingRegistrationsCount > 0 ? `${pendingRegistrationsCount} Pending` : undefined,
    },
    { id: 'hero', label: 'Hero & Intro', icon: Sparkles },
    { id: 'experience', label: 'Work Experience', icon: Briefcase, badge: 'Future Jobs' },
    { id: 'skills', label: 'Skills & Tech', icon: Wrench },
    { id: 'projects', label: 'Projects & Case Studies', icon: FolderGit2 },
    { id: 'casestudies', label: 'Case Study Editor', icon: FileCheck2 },
    { id: 'resumes', label: 'Resume Management', icon: FileText, badge: 'Active PDF' },
    { id: 'files', label: 'Screenshot & Media', icon: Image },
    { id: 'contact', label: 'Contact & Availability', icon: Mail },
    { id: 'supabase', label: 'Supabase Setup Guide', icon: Database, highlight: !isSupabaseConfigured },
  ];

  const handleSelectTab = (id: string) => {
    onSelectTab(id);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col text-slate-800 dark:text-slate-100 font-sans">
      {/* TOP HEADER */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#2563eb] text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-blue-500/20">
              LB
            </span>
            <div>
              <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Lingaraj QA CMS
              </h1>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                Admin: {authorizedAdminEmail}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT TOP ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Supabase status badge */}
          <button
            onClick={() => onSelectTab('supabase')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isSupabaseConfigured
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
            }`}
            title="Supabase Database Connection Status"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Supabase Not Configured'}</span>
          </button>

          {/* Sync Button */}
          <button
            onClick={() => refreshFromDatabase()}
            disabled={isSyncing}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#2563eb] transition-colors"
            title="Refresh data from storage/database"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-[#2563eb]' : ''}`} />
          </button>

          {/* Return to Live Portfolio */}
          <button
            onClick={onReturnToPortfolio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Live Portfolio</span>
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR NAVIGATION (DESKTOP) */}
        <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 shrink-0">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Content Modules
          </div>

          <nav className="space-y-1 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-blue-100 dark:bg-blue-900/40 text-[#2563eb] dark:text-blue-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Notice in Sidebar */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Zero-Code CMS
            </span>
            All modifications update the live portfolio in real time.
          </div>
        </aside>

        {/* MOBILE SIDEBAR DRAWER */}
        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-slate-900/70 backdrop-blur-sm flex">
            <div className="w-64 bg-white dark:bg-slate-900 h-full p-4 flex flex-col shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Admin Navigation
                </span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1 flex-1 overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                        isActive
                          ? 'bg-[#2563eb] text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-200 dark:bg-slate-700">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
            <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
          </div>
        )}

        {/* MAIN ADMIN WORKSPACE */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
