import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { CaseStudyFile } from '../../types/portfolio';
import { uploadAssetToStorage } from '../../lib/storage';
import { Image, Plus, Trash2, Eye, Filter, X, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export const FileManager: React.FC = () => {
  const { caseStudyFiles, projects, addCaseStudyFile, deleteCaseStudyFile } = usePortfolio();
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [newFile, setNewFile] = useState<CaseStudyFile>({
    id: '',
    projectId: projects[0]?.id || '',
    title: '',
    fileType: 'image',
    url: '',
    fileName: '',
    fileSize: '',
    uploadedAt: new Date().toISOString(),
    sortOrder: caseStudyFiles.length + 1,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFile(true);
    setUploadFeedback(null);

    const project = projects.find((p) => p.id === newFile.projectId);
    const folder = project?.slug || 'general';

    const res = await uploadAssetToStorage(file, folder);
    setIsUploadingFile(false);

    if (res.success && res.url) {
      setNewFile((prev) => ({
        ...prev,
        url: res.url!,
        fileName: res.fileName || file.name,
        fileSize: res.fileSize || '',
        title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      }));
      setUploadFeedback({ type: 'success', text: `Uploaded to Supabase Storage: ${res.fileName}` });
    } else {
      setUploadFeedback({ type: 'error', text: res.error || 'Failed to upload to Supabase Storage.' });
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFile.title.trim() || !newFile.url.trim()) return;

    await addCaseStudyFile({
      ...newFile,
      id: `file-${Date.now()}`,
      fileName: newFile.fileName || newFile.url.split('/').pop() || 'screenshot.png',
      uploadedAt: new Date().toISOString(),
    });

    setIsAdding(false);
    setUploadFeedback(null);
    setNewFile({
      id: '',
      projectId: projects[0]?.id || '',
      title: '',
      fileType: 'image',
      url: '',
      fileName: '',
      fileSize: '',
      uploadedAt: new Date().toISOString(),
      sortOrder: caseStudyFiles.length + 1,
    });
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Delete screenshot "${title}"?`)) {
      await deleteCaseStudyFile(id);
    }
  };

  const filteredFiles = caseStudyFiles.filter((f) => {
    if (selectedProjectFilter === 'All') return true;
    return f.projectId === selectedProjectFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Image className="w-6 h-6 text-[#2563eb]" />
            <span>Screenshot & Media Gallery (Supabase Storage)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Upload and associate project screenshots, architecture diagrams, and reports with Supabase Storage bucket <code>portfolio-assets</code>.
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2.5 rounded-xl bg-[#2563eb] text-white text-xs sm:text-sm font-bold hover:bg-[#1d4ed8] shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Screenshot / Media</span>
          </button>
        )}
      </div>

      {/* FILTER & STATS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold uppercase text-slate-500">Filter by Project:</span>
          <select
            value={selectedProjectFilter}
            onChange={(e) => setSelectedProjectFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
          >
            <option value="All">All Projects ({caseStudyFiles.length})</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-400">
          Showing {filteredFiles.length} media artifacts
        </span>
      </div>

      {/* ADD / UPLOAD MEDIA FORM */}
      {isAdding && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#2563eb]" />
              <span>Upload or Register Case Study Screenshot</span>
            </h3>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          {uploadFeedback && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                uploadFeedback.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-300'
                  : 'bg-red-50 dark:bg-red-950/40 border-red-300 text-red-800 dark:text-red-300'
              }`}
            >
              {uploadFeedback.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{uploadFeedback.text}</span>
            </div>
          )}

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Assign to Project *
                </label>
                <select
                  value={newFile.projectId}
                  onChange={(e) => setNewFile({ ...newFile, projectId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Artifact Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Test Execution Report Dashboard"
                  value={newFile.title}
                  onChange={(e) => setNewFile({ ...newFile, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm"
                />
              </div>
            </div>

            {/* DIRECT FILE UPLOADER TO SUPABASE STORAGE */}
            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-3">
              <label className="block text-xs font-bold uppercase text-blue-900 dark:text-blue-300">
                Direct Upload to Supabase Storage
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingFile}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors flex items-center justify-center gap-2"
                >
                  {isUploadingFile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Choose Image File (Max 10MB)</span>
                    </>
                  )}
                </button>
                <span className="text-xs text-slate-500 truncate">
                  {newFile.fileName ? `Selected: ${newFile.fileName}` : 'PNG, JPG, WebP supported'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Image URL or Storage Path *
              </label>
              <input
                type="text"
                required
                placeholder="https://gazndzdqljivpdsobrnq.supabase.co/storage/v1/object/public/... or /assets/screenshots/..."
                value={newFile.url}
                onChange={(e) => setNewFile({ ...newFile, url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-mono"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8]"
              >
                Save Media Artifact
              </button>
            </div>
          </form>
        </div>
      )}

      {/* GRID OF MEDIA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFiles.map((file) => {
          const project = projects.find((p) => p.id === file.projectId);
          return (
            <div
              key={file.id}
              className="rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between"
            >
              <div
                className="h-44 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden cursor-pointer relative group"
                onClick={() => setPreviewImage(file.url)}
              >
                <img
                  src={file.url}
                  alt={file.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                  <Eye className="w-4 h-4" />
                  <span>Click to Zoom</span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563eb]">
                    {project?.title || 'General'}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 truncate">
                    {file.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                    {file.url}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <button
                    onClick={() => setPreviewImage(file.url)}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleDelete(file.id, file.title)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                    title="Delete Artifact"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* LIGHTBOX PREVIEW */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh]">
            <img
              src={previewImage}
              alt="Zoomed"
              className="rounded-2xl max-h-[85vh] object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
