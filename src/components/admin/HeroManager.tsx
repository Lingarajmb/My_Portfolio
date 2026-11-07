import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Sparkles, Save, CheckCircle, Plus, X } from 'lucide-react';

export const HeroManager: React.FC = () => {
  const { hero, updateHero } = usePortfolio();
  const [formData, setFormData] = useState({ ...hero });
  const [newWord, setNewWord] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateHero(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAddWord = () => {
    if (!newWord.trim()) return;
    setFormData({
      ...formData,
      typingWords: [...formData.typingWords, newWord.trim()],
    });
    setNewWord('');
  };

  const handleRemoveWord = (idx: number) => {
    setFormData({
      ...formData,
      typingWords: formData.typingWords.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#2563eb]" />
            <span>Hero & Profile Details</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Configure your headline, typing banner phrases, counter stats, and availability indicator.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-300">
            <CheckCircle className="w-4 h-4" />
            <span>Changes Saved!</span>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Designation / Headline
              </label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
            </div>
          </div>

          {/* Typing words list */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
              Typing Effect Rotation Phrases
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.typingWords.map((word, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-[#2563eb] dark:text-blue-300 text-xs font-bold"
                >
                  <span>{word}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveWord(idx)}
                    className="hover:text-rose-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="e.g. Playwright Specialist"
                className="flex-1 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
              <button
                type="button"
                onClick={handleAddWord}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-300"
              >
                Add Word
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
              Profile Summary / Bio
            </label>
            <textarea
              rows={4}
              required
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            />
          </div>

          {/* Counter Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                Years of Exp
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                Test Cases
              </label>
              <input
                type="number"
                value={formData.testCasesCount}
                onChange={(e) => setFormData({ ...formData, testCasesCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                Prod Releases
              </label>
              <input
                type="number"
                value={formData.releasesCount}
                onChange={(e) => setFormData({ ...formData, releasesCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                Tools Count
              </label>
              <input
                type="number"
                value={formData.toolsCount}
                onChange={(e) => setFormData({ ...formData, toolsCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Availability Status Tag
              </label>
              <input
                type="text"
                value={formData.availabilityStatus}
                onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
                placeholder="e.g. Immediate Joiner / Available"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Profile Image Path
              </label>
              <input
                type="text"
                value={formData.profileImageUrl}
                onChange={(e) => setFormData({ ...formData, profileImageUrl: e.target.value })}
                placeholder="/assets/profile.png"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8] shadow-md shadow-blue-500/20 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
