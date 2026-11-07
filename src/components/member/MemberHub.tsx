import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Clock,
  LogOut,
  ArrowLeft,
  FileCheck2,
  CheckCircle2,
  Layers,
  Database,
  Terminal,
  Download,
  Search,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface MemberHubProps {
  onReturnToPortfolio: () => void;
  onOpenLoginModal?: () => void;
}

export const MemberHub: React.FC<MemberHubProps> = ({ onReturnToPortfolio, onOpenLoginModal }) => {
  const { user, isApproved, isPending, isRejected, logout } = useAuth();
  const { projects, qaChecklist, resumeDownloadUrl, downloadActiveResume } = usePortfolio();
  const [activeTab, setActiveTab] = useState<'scenarios' | 'checklist' | 'framework'>('scenarios');
  const [scenarioFilter, setScenarioFilter] = useState('all');

  const handleSignOut = async () => {
    await logout();
    onReturnToPortfolio();
  };

  // 1. PENDING REGISTRATION VIEW
  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-800 border border-slate-700 text-center space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
              Registration Under Review
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Your registration is awaiting admin approval.
            </h2>
            <p className="text-xs text-slate-400">
              Welcome, <span className="text-slate-200 font-semibold">{user?.fullName || user?.email}</span>. Your registration request has been received. Protected QA verification resources will be unlocked once approved by Lingaraj.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 text-xs text-left space-y-2 font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Account Email:</span>
              <span className="text-white">{user?.email}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Current Status:</span>
              <span className="text-amber-400 font-bold uppercase">Pending</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Assigned Role:</span>
              <span className="text-slate-300">Viewer (Pending)</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onReturnToPortfolio}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-700 text-xs font-bold hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portfolio</span>
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2.5 rounded-xl bg-rose-900/40 border border-rose-700 text-rose-300 text-xs font-bold hover:bg-rose-900/60 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. REJECTED REGISTRATION VIEW
  if (isRejected) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-800 border border-rose-900/40 text-center space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-400/20 text-rose-300 border border-rose-400/30">
              Access Restricted
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Access Denied
            </h2>
            <p className="text-xs text-slate-400">
              Your registration was reviewed and rejected by the administrator. Access to protected application features is restricted.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onReturnToPortfolio}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-700 text-xs font-bold hover:bg-slate-600 transition-colors"
            >
              Back to Portfolio
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. APPROVED MEMBER HUB VIEW
  const allScenarios = projects.flatMap((p) =>
    (p.testScenarios || []).map((s) => ({ ...s, projectTitle: p.title, projectSlug: p.slug }))
  );

  const filteredScenarios =
    scenarioFilter === 'all'
      ? allScenarios
      : allScenarios.filter((s) => s.projectSlug === scenarioFilter);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onReturnToPortfolio}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Return to Public Portfolio"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                APPROVED MEMBER
              </span>
              <h1 className="text-base font-bold text-white">
                QA Verification & Test Repository Hub
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Logged in as <span className="text-slate-200 font-semibold">{user?.fullName || user?.email}</span> (Viewer Role)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => downloadActiveResume()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Resume</span>
          </button>

          <button
            onClick={handleSignOut}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-700"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Hub Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Welcome Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-800 border border-blue-500/20 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Protected Member Access Enabled</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">
                Welcome to the Verified QA Resource Center
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                As an approved viewer, you have full access to Lingaraj Belagali's verified test case repositories, enterprise financial reconciliation matrices, Playwright automation suites, and QA checklists.
              </p>
            </div>

            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/20 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Status: Approved</span>
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'scenarios'
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Test Case Repository ({allScenarios.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'checklist'
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>QA Release Checklist</span>
          </button>

          <button
            onClick={() => setActiveTab('framework')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'framework'
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Automation Architecture</span>
          </button>
        </div>

        {/* TAB 1: TEST SCENARIO REPOSITORY */}
        {activeTab === 'scenarios' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-800">
              <div className="text-xs text-slate-400">
                Filter verified test scenarios by project:
              </div>

              <select
                value={scenarioFilter}
                onChange={(e) => setScenarioFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:ring-2 focus:ring-[#2563eb]"
              >
                <option value="all">All Projects ({allScenarios.length} Scenarios)</option>
                {projects.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredScenarios.map((sc, idx) => (
                <div
                  key={sc.id || idx}
                  className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {sc.type || 'Functional'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{sc.status || 'Verified'}</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">{sc.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {sc.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="truncate max-w-[240px] text-slate-300">
                      {sc.projectTitle}
                    </span>
                    <span className="text-[#2563eb]">Case #{sc.id || idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: QA RELEASE CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="p-6 rounded-3xl bg-slate-800 border border-slate-700 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Standard Quality Gate & Pre-Release Checklist
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Comprehensive 16-point verification standard adhered to across manual, automated, API, and database test phases.
              </p>
            </div>

            <div className="divide-y divide-slate-700/60">
              {qaChecklist.map((item) => (
                <div key={item.id} className="py-3.5 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300 font-mono">
                        {item.category}
                      </span>
                      <span className="text-xs font-semibold text-white">{item.task}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: AUTOMATION ARCHITECTURE */}
        {activeTab === 'framework' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-slate-800 border border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <Terminal className="w-5 h-5" />
                <span>Playwright TypeScript Framework</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Industrial Page Object Model (POM) architecture featuring dynamic locators, parallel test sharding across Chromium/WebKit/Firefox, custom fixtures, auto-waiting assertions, and HTML artifact reporting.
              </p>
              <div className="p-3 rounded-xl bg-slate-900 font-mono text-[11px] text-slate-400 space-y-1">
                <div>• Zero flaky tests via network idle assertions</div>
                <div>• Multi-browser parallel execution (4 workers)</div>
                <div>• Automated video recording and trace logging</div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-800 border border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Database className="w-5 h-5" />
                <span>Database & SQL Ledger Reconciliation</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Advanced database verification queries for enterprise Capital Markets ledgers, validating multi-currency cash flows, transaction immutability, and relational integrity.
              </p>
              <div className="p-3 rounded-xl bg-slate-900 font-mono text-[11px] text-slate-400 space-y-1">
                <div>• Multi-table aggregation & balance joins</div>
                <div>• MongoDB document schema validation</div>
                <div>• Audit trail compliance assertion</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
