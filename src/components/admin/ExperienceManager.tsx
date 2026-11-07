import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { WorkExperience } from '../../types/portfolio';
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Building,
  Save,
  X,
  PlusCircle,
} from 'lucide-react';

export const ExperienceManager: React.FC = () => {
  const { workExperience, addWorkExperience, updateWorkExperience, deleteWorkExperience } = usePortfolio();
  const [editingExp, setEditingExp] = useState<WorkExperience | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newTech, setNewTech] = useState('');

  const emptyExperience: WorkExperience = {
    id: '',
    companyName: '',
    designation: 'QA Automation Engineer',
    period: '2025 - Present',
    startDate: '2025-01',
    isCurrent: false,
    employmentType: 'Full-time',
    domain: 'Enterprise Software',
    summary: '',
    responsibilities: [],
    technologies: ['Playwright', 'TypeScript', 'CI/CD'],
    achievements: [],
    sortOrder: workExperience.length + 1,
    isPublished: true,
  };

  const [formData, setFormData] = useState<WorkExperience>(emptyExperience);

  const handleStartCreate = () => {
    setFormData({
      ...emptyExperience,
      id: `exp-${Date.now()}`,
      sortOrder: workExperience.length + 1,
    });
    setIsCreating(true);
    setEditingExp(null);
  };

  const handleStartEdit = (exp: WorkExperience) => {
    setFormData({ ...exp });
    setEditingExp(exp);
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim()) return;

    if (isCreating) {
      await addWorkExperience(formData);
    } else {
      await updateWorkExperience(formData);
    }

    setIsCreating(false);
    setEditingExp(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from your work experiences?`)) {
      await deleteWorkExperience(id);
    }
  };

  const handleTogglePublish = async (exp: WorkExperience) => {
    await updateWorkExperience({
      ...exp,
      isPublished: !exp.isPublished,
    });
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= workExperience.length) return;

    const currentItem = workExperience[index];
    const targetItem = workExperience[targetIndex];

    const currentOrder = currentItem.sortOrder;
    const targetOrder = targetItem.sortOrder;

    await updateWorkExperience({ ...currentItem, sortOrder: targetOrder });
    await updateWorkExperience({ ...targetItem, sortOrder: currentOrder });
  };

  const handleAddResponsibility = () => {
    if (!newResponsibility.trim()) return;
    setFormData({
      ...formData,
      responsibilities: [...formData.responsibilities, newResponsibility.trim()],
    });
    setNewResponsibility('');
  };

  const handleRemoveResponsibility = (idx: number) => {
    setFormData({
      ...formData,
      responsibilities: formData.responsibilities.filter((_, i) => i !== idx),
    });
  };

  const handleAddTech = () => {
    if (!newTech.trim()) return;
    if (!formData.technologies.includes(newTech.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, newTech.trim()],
      });
    }
    setNewTech('');
  };

  const handleRemoveTech = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech),
    });
  };

  const sortedList = [...workExperience].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-[#2563eb]" />
            <span>Work Experience & Future Jobs</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage your employment history (Tata Consultancy Services, Spire.ai, and future employers). Changes appear on your live portfolio immediately.
          </p>
        </div>

        {!isCreating && !editingExp && (
          <button
            onClick={handleStartCreate}
            className="px-4 py-2.5 rounded-xl bg-[#2563eb] text-white text-xs sm:text-sm font-bold hover:bg-[#1d4ed8] shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Experience</span>
          </button>
        )}
      </div>

      {/* CREATE / EDIT FORM */}
      {(isCreating || editingExp) && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-[#2563eb]" />
              <span>{isCreating ? 'Add New Job Experience' : `Edit ${formData.companyName}`}</span>
            </h3>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingExp(null);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Tata Consultancy Services, Microsoft, Google"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Designation / Role Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="e.g. System Engineer (QA Automation), SDET"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Period Display *
                </label>
                <input
                  type="text"
                  required
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  placeholder="e.g. 2022 - 2025 or 2025 - Present"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Domain / Industry
                </label>
                <input
                  type="text"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  placeholder="e.g. Capital Markets, FinTech, AI SaaS"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Employment Type
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.isCurrent}
                  onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                  className="rounded text-[#2563eb] w-4 h-4"
                />
                <span>Currently Working Here</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded text-[#2563eb] w-4 h-4"
                />
                <span>Published on Live Portfolio</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Role Summary
              </label>
              <textarea
                rows={3}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="High-level overview of role, client, or team responsibilities..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
            </div>

            {/* Key Responsibilities list */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                QA Responsibilities & Achievements (Bullet Points)
              </label>
              <div className="space-y-2 mb-2">
                {formData.responsibilities.map((resp, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <span className="text-slate-800 dark:text-slate-200">{resp}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveResponsibility(i)}
                      className="p-1 text-rose-500 hover:text-rose-700 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newResponsibility}
                  onChange={(e) => setNewResponsibility(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddResponsibility();
                    }
                  }}
                  placeholder="e.g. Architected Playwright framework reducing regression cycles by 40%..."
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
                <button
                  type="button"
                  onClick={handleAddResponsibility}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-300"
                >
                  Add Bullet
                </button>
              </div>
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Technologies Used
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-[#2563eb] dark:text-blue-300 text-xs font-semibold"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(tech)}
                      className="hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTech();
                    }
                  }}
                  placeholder="e.g. Playwright, Jenkins, SQL..."
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-300"
                >
                  Add Tech
                </button>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingExp(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8] shadow-md shadow-blue-500/20 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Experience</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EXPERIENCE LIST */}
      <div className="space-y-4">
        {sortedList.map((exp, index) => (
          <div
            key={exp.id}
            className={`p-6 rounded-3xl bg-white dark:bg-slate-800 border transition-all ${
              exp.isPublished
                ? 'border-slate-200 dark:border-slate-700 shadow-sm'
                : 'border-dashed border-slate-300 dark:border-slate-700 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {exp.companyName}
                  </h3>
                  {exp.isCurrent && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      Current Job
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {exp.period}
                  </span>
                  {!exp.isPublished && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      Draft (Unpublished)
                    </span>
                  )}
                </div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {exp.designation} • Domain: {exp.domain || 'QA Software'}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  {exp.summary}
                </p>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                <button
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30"
                  title="Move Up"
                >
                  <MoveUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === sortedList.length - 1}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30"
                  title="Move Down"
                >
                  <MoveDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleTogglePublish(exp)}
                  className={`p-2 rounded-xl transition-colors ${
                    exp.isPublished ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:text-emerald-600'
                  }`}
                  title={exp.isPublished ? 'Unpublish' : 'Publish'}
                >
                  {exp.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleStartEdit(exp)}
                  className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                  title="Edit Experience"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(exp.id, exp.companyName)}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tags preview */}
            <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-700/60">
              {exp.technologies?.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                >
                  {tech}
                </span>
              ))}
              <span className="text-[11px] text-slate-400 ml-2">
                {exp.responsibilities?.length || 0} bullet points
              </span>
            </div>
          </div>
        ))}

        {sortedList.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No work experiences added yet. Click "Add New Experience" above.
          </div>
        )}
      </div>
    </div>
  );
};
