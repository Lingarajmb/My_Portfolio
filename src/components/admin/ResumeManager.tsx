import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { getResumeDownloadUrl } from '../../lib/storage';
import {
  FileText,
  Upload,
  CheckCircle2,
  Eye,
  Download,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Lock,
  RefreshCw,
  HardDrive,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';

export const ResumeManager: React.FC = () => {
  const { activeResume, replaceActiveResume, downloadActiveResume } = usePortfolio();

  const [title, setTitle] = useState(activeResume?.title || 'Lingaraj QA Automation Tester Resume');
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setFeedback({
        type: 'error',
        title: 'Invalid File Type',
        message: 'Only PDF documents (.pdf) are permitted for resume uploads.',
      });
      setSelectedFile(null);
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setFeedback({
        type: 'error',
        title: 'File Too Large',
        message: `File exceeds the 15MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB).`,
      });
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setFeedback(null);
  };

  const handleExecuteReplacement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setFeedback({
        type: 'error',
        title: 'No File Selected',
        message: 'Please choose a valid PDF file to replace the current active resume.',
      });
      return;
    }

    setIsProcessing(true);
    setFeedback(null);
    setCurrentStep(1); // Step 1: Uploading & replacing in private storage

    try {
      setCurrentStep(2); // Step 2: Uploading to Supabase
      const result = await replaceActiveResume(selectedFile, title, notes);

      if (!result.success) {
        setIsProcessing(false);
        setCurrentStep(0);
        setFeedback({
          type: 'error',
          title: 'Replacement Failed',
          message:
            result.error ||
            'Failed to replace resume. The existing resume was preserved safely with zero data loss.',
        });
        return;
      }

      setCurrentStep(3); // Step 3: Verified and activated
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      if (result.oldFileDeleted === false) {
        setFeedback({
          type: 'warning',
          title: 'New Resume Activated (Storage Notice)',
          message:
            'The new resume has been successfully uploaded and set as active in the database. Note: The previous file could not be automatically deleted from storage (it may have already been cleaned up or used a static fallback path).',
        });
      } else {
        setFeedback({
          type: 'success',
          title: 'Resume Replaced Successfully',
          message:
            'New resume PDF is now active across all public download buttons. Previous file and database records have been purged. Strictly ONE active resume retained.',
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        title: 'Unexpected Error',
        message: err?.message || 'An unexpected error occurred during replacement.',
      });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setCurrentStep(0), 4000);
    }
  };

  const handleOpenPreview = async () => {
    if (!activeResume?.storagePath) return;
    const url = await getResumeDownloadUrl(activeResume.storagePath);
    setPreviewUrl(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#2563eb]" />
            <span>Centralized Resume Management</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Maintain strictly ONE active resume. Uploading replaces the file in private Supabase Storage (<code>portfolio-resumes</code>), updates the database, and purges previous versions.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/40 text-[#2563eb] dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Lock className="w-3.5 h-3.5" />
            <span>Private Storage Bucket</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Single Active File</span>
          </span>
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : feedback.type === 'warning'
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
          }`}
        >
          {feedback.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
          {feedback.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
          {feedback.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
          <div className="flex-1 text-xs sm:text-sm">
            <h4 className="font-bold">{feedback.title}</h4>
            <p className="mt-0.5 opacity-90">{feedback.message}</p>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-bold opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* CURRENT ACTIVE RESUME HERO CARD */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shrink-0 shadow-inner">
              <ShieldCheck className="w-8 h-8 text-amber-300" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-400 text-slate-900 uppercase tracking-wide">
                  CURRENT ACTIVE RESUME
                </span>
                <span className="text-xs font-mono bg-white/15 px-2 py-0.5 rounded-md">
                  Strict Single-Resume Policy
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {activeResume?.title || 'Lingaraj QA Automation Tester Resume'}
              </h3>
              <p className="text-xs text-blue-100 font-mono truncate max-w-xl">
                File: {activeResume?.fileName || 'Lingaraj_Belagali_Resume_QA_Immediate_Joiner.pdf'} •{' '}
                {activeResume?.fileSize || '420 KB'}
              </p>
              <div className="text-[11px] text-blue-200/90 font-mono pt-1">
                Storage: <span className="font-bold">portfolio-resumes (Private)</span> | Path:{' '}
                <span className="text-white">{activeResume?.storagePath || 'resumes/active.pdf'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
            <button
              onClick={handleOpenPreview}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-sm transition-all flex items-center gap-2 border border-white/20"
              title="Preview via signed URL"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>

            <button
              onClick={() => downloadActiveResume()}
              className="px-5 py-2.5 rounded-xl bg-white text-[#2563eb] text-xs font-bold hover:bg-blue-50 shadow-md transition-all flex items-center gap-2"
              title="Test centralized public download resolver"
            >
              <Download className="w-4 h-4" />
              <span>Test Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* SINGLE REPLACEMENT ACTION PANEL */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-5 border-b border-slate-100 dark:border-slate-700/60 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#2563eb] flex items-center justify-center">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Replace Active Resume
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload a new PDF to atomic-replace the current resume. Automatically deletes previous file from storage and database.
            </p>
          </div>
        </div>

        <form onSubmit={handleExecuteReplacement} className="space-y-5">
          {/* File Drag & Drop / Input */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              selectedFile
                ? 'border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20'
                : 'border-slate-300 dark:border-slate-700 hover:border-[#2563eb] hover:bg-blue-50/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            {selectedFile ? (
              <div className="flex flex-col items-center gap-2">
                <FileCheck className="w-10 h-10 text-emerald-500" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {(selectedFile.size / 1024).toFixed(1)} KB • PDF Document Validated
                </span>
                <span className="text-xs text-[#2563eb] hover:underline font-semibold mt-1">
                  Click to select a different PDF
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-10 h-10 text-slate-400 group-hover:text-[#2563eb]" />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Click to select new resume PDF or drag & drop here
                </span>
                <span className="text-xs text-slate-500">
                  Strictly PDF (.pdf) format only • Maximum 15MB file size
                </span>
              </div>
            )}
          </div>

          {/* Optional Title and Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Resume Display Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Lingaraj QA Automation Tester Resume"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#2563eb] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Version Note (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Updated with recent Playwright and MongoDB achievements"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#2563eb] outline-none"
              />
            </div>
          </div>

          {/* Progress Steps during Execution */}
          {isProcessing && (
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#2563eb]">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Executing Safe Resume Replacement Workflow...</span>
              </div>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                <li className={currentStep >= 1 ? 'text-emerald-600 font-semibold' : ''}>
                  ✓ 1. Validating PDF document format & size (max 15MB)
                </li>
                <li className={currentStep >= 2 ? 'text-emerald-600 font-semibold' : ''}>
                  {currentStep >= 2 ? '✓' : '•'} 2. Uploading & verifying new PDF in private 'portfolio-resumes'
                </li>
                <li className={currentStep >= 3 ? 'text-emerald-600 font-semibold' : ''}>
                  {currentStep >= 3 ? '✓' : '•'} 3. Database lock, activation & confirming exactly 1 active resume
                </li>
                <li className={currentStep >= 3 ? 'text-emerald-600 font-semibold' : ''}>
                  {currentStep >= 3 ? '✓' : '•'} 4. Purging old Storage file & database records
                </li>
              </ul>
            </div>
          )}

          {/* Action Button */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Only ONE resume is kept in storage and database at all times.
            </span>

            <button
              type="submit"
              disabled={!selectedFile || isProcessing}
              className="px-6 py-3 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Replacing Resume...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Upload & Replace Active Resume</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ARCHITECTURE & SECURITY AUDIT PANEL */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <HardDrive className="w-4 h-4 text-[#2563eb]" />
          <span>Security & Database Enforcement Standards</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Storage Bucket Privacy</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              <code>portfolio-resumes</code> is strictly configured as <code>public = false</code>. Direct public URL enumeration is blocked.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Centralized Signed URL Resolver</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Public download buttons request short-lived 1-hour signed URLs for the active resume only. Inactive files cannot be downloaded.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Partial Unique Index Constraint</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              PostgreSQL index <code>idx_only_one_active_resume</code> ensures that multiple active resume records cannot exist simultaneously.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero-Accumulation Retention</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Upon successful replacement, the previous storage object and database record are purged, maintaining 0 archives and 1 active file.
            </p>
          </div>
        </div>
      </div>

      {/* PDF PREVIEW MODAL */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[85vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono truncate">
                Previewing Active Resume via Signed URL
              </span>
              <button
                onClick={() => setPreviewUrl(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold hover:bg-slate-300 text-slate-800 dark:text-slate-200"
              >
                Close Preview
              </button>
            </div>
            <iframe
              src={previewUrl}
              title="Active Resume Preview"
              className="w-full flex-1 border-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};
