import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  saveSupabaseConfig,
  getSupabaseConfig,
  testSupabaseConnection,
  DEFAULT_SUPABASE_URL,
} from '../../lib/supabase';
import {
  Database,
  CheckCircle,
  Copy,
  ExternalLink,
  Key,
  FileCode,
  Check,
  AlertTriangle,
  RefreshCw,
  Download,
  Sparkles,
  Server,
} from 'lucide-react';
import fullSqlSchema from '../../../supabase/migrations/20261105_portfolio_schema.sql?raw';

export const SupabaseSetupGuide: React.FC = () => {
  const { isSupabaseConfigured, setSupabaseConfigured, seedSupabaseDatabase, refreshFromDatabase } =
    usePortfolio();
  const currentConfig = getSupabaseConfig();

  const [supabaseUrl, setSupabaseUrl] = useState(
    currentConfig?.supabaseUrl || DEFAULT_SUPABASE_URL
  );
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(currentConfig?.supabaseAnonKey || '');
  const [isTesting, setIsTesting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setTestResult(null);

    const result = await testSupabaseConnection(supabaseUrl.trim(), supabaseAnonKey.trim());
    setIsTesting(false);
    setTestResult(result);

    if (result.success) {
      saveSupabaseConfig(supabaseUrl.trim(), supabaseAnonKey.trim());
      setSupabaseConfigured(true);
      await refreshFromDatabase();
    }
  };

  const handleSeedDatabase = async () => {
    if (!window.confirm('Seed your Supabase PostgreSQL tables with Lingaraj Belagali initial portfolio content?')) {
      return;
    }
    setIsSeeding(true);
    setSeedResult(null);

    const res = await seedSupabaseDatabase();
    setIsSeeding(false);
    setSeedResult(res);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(fullSqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleDownloadSql = () => {
    const element = document.createElement('a');
    const file = new Blob([fullSqlSchema], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = '20261105_portfolio_schema.sql';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-[#2563eb]" />
            <span>Supabase Backend Integration (gazndzdqljivpdsobrnq)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Connected to Supabase project <code className="font-mono text-xs text-blue-600 font-bold">gazndzdqljivpdsobrnq</code>. Run the migration to initialize tables, Storage, and RLS.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://supabase.com/dashboard/project/gazndzdqljivpdsobrnq"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Supabase Dashboard</span>
          </a>
        </div>
      </div>

      {/* CREDENTIALS TEST & SAVE BOX */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-[#2563eb]" />
              <span>Project gazndzdqljivpdsobrnq Configuration</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your publishable API key (<code className="font-mono text-xs">sb_publishable_...</code> or anon key) to activate real database sync.
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              isSupabaseConfigured
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
            }`}
          >
            {isSupabaseConfigured ? 'Status: Connected' : 'Status: API Key Needed'}
          </span>
        </div>

        {testResult && (
          <div
            className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
              testResult.success
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200'
            }`}
          >
            {testResult.success ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold">{testResult.success ? 'Connection Validated!' : 'Connection Feedback'}</div>
              <p className="mt-0.5">{testResult.message}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleTestAndSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Supabase Project URL *
              </label>
              <input
                type="url"
                required
                placeholder="https://gazndzdqljivpdsobrnq.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Supabase Publishable Key (sb_publishable_... or anon) *
              </label>
              <input
                type="text"
                required
                placeholder="sb_publishable_... or eyJhbGci..."
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-mono"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-slate-500">
              Only publishable / anon keys are stored. Never use service-role keys.
            </span>
            <button
              type="submit"
              disabled={isTesting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8] shadow-md flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Testing Connection...' : 'Save & Test Connection'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* ONE-CLICK INITIAL DATA SEEDER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Database Data Initializer & Content Seeder</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Populate all 11 tables in Supabase with Lingaraj's verified projects (Playwright, API, Mabl, SEI, AI Platform), TCS & Spire.ai experience, and skills.
            </p>
          </div>

          <button
            onClick={handleSeedDatabase}
            disabled={isSeeding || !isSupabaseConfigured}
            className="px-4 py-2.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center gap-2 shrink-0"
          >
            <Sparkles className={`w-4 h-4 ${isSeeding ? 'animate-spin' : ''}`} />
            <span>{isSeeding ? 'Seeding Tables...' : 'Seed Content to Supabase'}</span>
          </button>
        </div>

        {seedResult && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              seedResult.success
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-950/40 border-red-300 text-red-800 dark:text-red-300'
            }`}
          >
            {seedResult.success ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{seedResult.message}</span>
          </div>
        )}
      </div>

      {/* ONE-CLICK SQL SCHEMA COPIER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-[#2563eb]" />
              <span>PostgreSQL SQL Migration Script (Audited & Hardened)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Copy and execute this script inside your Supabase Project's <b>SQL Editor</b>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySql}
              className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-[#2563eb] dark:text-blue-300 text-xs font-bold hover:bg-blue-100 flex items-center gap-1.5"
            >
              {copiedSql ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
            </button>
            <button
              onClick={handleDownloadSql}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download .sql</span>
            </button>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-56 overflow-y-auto bg-slate-950 p-4 font-mono text-xs text-slate-300">
          <pre>{fullSqlSchema}</pre>
        </div>
      </div>

      {/* QUICK EXECUTION INSTRUCTIONS */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
          <Server className="w-4 h-4 text-[#2563eb]" />
          <span>How to execute this migration in Supabase in 60 seconds:</span>
        </h4>
        <ol className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 list-decimal list-inside leading-relaxed">
          <li>
            Go to{' '}
            <a
              href="https://supabase.com/dashboard/project/gazndzdqljivpdsobrnq/sql/new"
              target="_blank"
              rel="noreferrer"
              className="text-[#2563eb] underline font-bold"
            >
              Supabase SQL Editor for gazndzdqljivpdsobrnq
            </a>
            .
          </li>
          <li>Click <b>"New query"</b>.</li>
          <li>Click <b>"Copy SQL Script"</b> above and paste the entire script into the query editor.</li>
          <li>Click <b>"Run"</b> (green button).</li>
          <li>Return to this dashboard and click <b>"Save & Test Connection"</b>.</li>
        </ol>
      </div>
    </div>
  );
};
