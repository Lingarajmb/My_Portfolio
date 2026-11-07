import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SkillItem } from '../../types/portfolio';
import { Wrench, Plus, Pencil, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';

export const SkillsManager: React.FC = () => {
  const { skills, addSkill, updateSkill, deleteSkill } = usePortfolio();
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const emptySkill: SkillItem = {
    id: '',
    name: '',
    category: 'Automation',
    proficiency: 85,
    icon: 'playwright',
    sortOrder: skills.length + 1,
    isPublished: true,
  };

  const [formData, setFormData] = useState<SkillItem>(emptySkill);

  const handleStartCreate = () => {
    setFormData({
      ...emptySkill,
      id: `skill-${Date.now()}`,
      sortOrder: skills.length + 1,
    });
    setIsCreating(true);
    setEditingSkill(null);
  };

  const handleStartEdit = (skill: SkillItem) => {
    setFormData({ ...skill });
    setEditingSkill(skill);
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (isCreating) {
      await addSkill(formData);
    } else {
      await updateSkill(formData);
    }

    setIsCreating(false);
    setEditingSkill(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete skill "${name}"?`)) {
      await deleteSkill(id);
    }
  };

  const handleTogglePublish = async (skill: SkillItem) => {
    await updateSkill({ ...skill, isPublished: !skill.isPublished });
  };

  const sortedSkills = [...skills].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-[#2563eb]" />
            <span>Skills & Tech Stack Manager</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Add, update proficiency percentages, and categorize your QA tooling and technical skills.
          </p>
        </div>

        {!isCreating && !editingSkill && (
          <button
            onClick={handleStartCreate}
            className="px-4 py-2.5 rounded-xl bg-[#2563eb] text-white text-xs sm:text-sm font-bold hover:bg-[#1d4ed8] shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Skill</span>
          </button>
        )}
      </div>

      {/* CREATE / EDIT FORM */}
      {(isCreating || editingSkill) && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isCreating ? 'Add Technical Skill' : `Edit ${formData.name}`}
            </h3>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingSkill(null);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Playwright, Postman, TypeScript..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                >
                  <option value="Automation">Automation</option>
                  <option value="Testing">Testing</option>
                  <option value="Database">Database</option>
                  <option value="Tools">Tools</option>
                  <option value="Process">Process</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  Proficiency Level: {formData.proficiency}%
                </label>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                step="5"
                value={formData.proficiency}
                onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) || 50 })}
                className="w-full accent-[#2563eb] h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded text-[#2563eb] w-4 h-4"
                />
                <span>Visible on Portfolio</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingSkill(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8] shadow-md flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Skill</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SKILLS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedSkills.map((skill) => (
          <div
            key={skill.id}
            className={`p-4 rounded-2xl bg-white dark:bg-slate-800 border flex items-center justify-between ${
              skill.isPublished ? 'border-slate-200 dark:border-slate-700 shadow-sm' : 'border-dashed border-slate-300 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{skill.name}</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-[#2563eb] font-semibold">
                  {skill.proficiency}%
                </span>
              </div>
              <span className="text-xs text-slate-500">{skill.category}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleTogglePublish(skill)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                title={skill.isPublished ? 'Hide' : 'Show'}
              >
                {skill.isPublished ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleStartEdit(skill)}
                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(skill.id, skill.name)}
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
