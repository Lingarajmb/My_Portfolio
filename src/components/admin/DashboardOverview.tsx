import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  FolderGit2,
  Wrench,
  FileText,
  Database,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Users,
} from 'lucide-react';

interface DashboardOverviewProps {
  onNavigateTab: (tab: string) => void;
  onReturnToPortfolio: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigateTab,
  onReturnToPortfolio,
}) => {
  const {
    hero,
    workExperience,
    projects,
    skills,
    resumeVersions,
    activeResume,
    isSupabaseConfigured,
  } = usePortfolio();
  const { pendingRegistrationsCount } = useAuth();

  const publishedExp = workExperience.filter((e) => e.isPublished).length;
  const publishedProjects = projects.filter((p) => p.isPublished).length;
  const publishedSkills = skills.filter((s) => s.isPublished).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* PENDING USER REGISTRATIONS ALERT BANNER */}
      {pendingRegistrationsCount > 0 && (
        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-600 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-amber-950 dark:text-amber-100">
                  {pendingRegistrationsCount} New User Registration{pendingRegistrationsCount > 1 ? 's' : ''} Awaiting Review
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white animate-pulse">
                  ACTION REQUIRED
                </span>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                New accounts are locked in pending status until you approve or reject them.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('users')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0"
          >
            <span>Review Registrations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* WELCOME BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Administrator Control Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {hero.fullName || 'Lingaraj'}!
          </h2>
          <p className="mt-1 text-blue-100 text-sm max-w-xl">
            Manage your QA projects, future employment history, test scenarios, skills, and active resume without editing code.
          </p>
        </div>

        <button
          onClick={onReturnToPortfolio}
          className="px-5 py-3 rounded-2xl bg-white text-blue-700 font-bold text-xs sm:text-sm hover:bg-blue-50 shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <span>Preview Live Portfolio</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* SUPABASE STATUS CARD */}
      <div
        className={`p-6 rounded-3xl border transition-all ${
          isSupabaseConfigured
            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
            : 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                isSupabaseConfigured
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300'
                  : 'bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300'
              }`}
            >
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Supabase Backend Status (gazndzdqljivpdsobrnq)
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    isSupabaseConfigured
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                  }`}
                >
                  {isSupabaseConfigured ? 'Connected & Active' : 'API Key Setup Needed'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
                {isSupabaseConfigured
                  ? 'Connected to https://gazndzdqljivpdsobrnq.supabase.co. All CRUD edits persist directly to your PostgreSQL database and storage buckets.'
                  : 'Project URL https://gazndzdqljivpdsobrnq.supabase.co is pre-configured. Open the Setup Guide to enter your publishable key and execute the SQL migration.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('supabase')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs shrink-0 flex items-center gap-1.5 transition-all ${
              isSupabaseConfigured
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-amber-600 text-white hover:bg-amber-700 shadow-md shadow-amber-500/20'
            }`}
          >
            <span>{isSupabaseConfigured ? 'View Supabase Settings' : 'Open Setup Guide'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Work Experience */}
        <div
          onClick={() => onNavigateTab('experience')}
          className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-[#2563eb] flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 group-hover:text-[#2563eb] flex items-center gap-1">
              Manage <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {publishedExp}
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
            Work Experiences
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            TCS, Spire.ai + ready for new jobs
          </div>
        </div>

        {/* Featured Projects */}
        <div
          onClick={() => onNavigateTab('projects')}
          className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 group-hover:text-purple-600 flex items-center gap-1">
              Manage <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {publishedProjects}
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
            Published Case Studies
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Automated workflows & reports
          </div>
        </div>

        {/* Skills */}
        <div
          onClick={() => onNavigateTab('skills')}
          className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-600 flex items-center gap-1">
              Manage <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {publishedSkills}
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
            QA Tools & Skills
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Automation, API, DB & Process
          </div>
        </div>

        {/* Resume Version */}
        <div
          onClick={() => onNavigateTab('resumes')}
          className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 group-hover:text-amber-600 flex items-center gap-1">
              Manage <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white truncate">
            {activeResume?.fileSize || '420 KB'}
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
            Single Active Resume
          </div>
          <div className="text-[11px] text-slate-400 mt-2 truncate">
            {activeResume?.fileName || 'Lingaraj_Belagali_Resume.pdf'}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS & MODULE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Recent QA Case Studies
          </h3>
          <div className="space-y-3">
            {projects.slice(0, 4).map((p) => (
              <div
                key={p.id}
                onClick={() => onNavigateTab('casestudies')}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {p.title}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {p.category} • {p.testScenarios.length} Scenarios
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#2563eb]">Edit Case Study →</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Work Experience Pipeline
          </h3>
          <div className="space-y-3">
            {workExperience.map((exp) => (
              <div
                key={exp.id}
                onClick={() => onNavigateTab('experience')}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{exp.companyName}</span>
                    {exp.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {exp.designation} • {exp.period}
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#2563eb]">Edit Details →</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => onNavigateTab('experience')}
            className="w-full mt-4 py-2.5 rounded-xl border border-dashed border-blue-400 text-[#2563eb] text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
          >
            + Add New Future Work Experience
          </button>
        </div>
      </div>
    </div>
  );
};
