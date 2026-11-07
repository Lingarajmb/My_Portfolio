import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ProjectItem } from '../../types/portfolio';
import {
  FolderGit2,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Star,
  ExternalLink,
  FileCheck2,
  Save,
  X,
  FileText,
} from 'lucide-react';

interface ProjectsManagerProps {
  onOpenCaseStudyEditor: (projectId: string) => void;
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({ onOpenCaseStudyEditor }) => {
  const { projects, addProject, updateProject, deleteProject } = usePortfolio();
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTech, setNewTech] = useState('');

  const emptyProject: ProjectItem = {
    id: '',
    slug: '',
    title: '',
    tagLabel: 'Automation Framework',
    category: 'Automation',
    colorTheme: 'blue',
    shortDescription: '',
    overview: '',
    problemStatement: '',
    solutionApproach: '',
    techStack: ['Playwright', 'TypeScript', 'Allure'],
    features: [],
    stats: [
      { label: 'Automated Tests', value: '100+' },
      { label: 'Pass Rate', value: '99.5%' },
    ],
    workflowSteps: [],
    testScenarios: [],
    responsibilities: [],
    achievements: [],
    lessonsLearned: [],
    thumbnailUrl: '/assets/screenshots/playwright/framework.png',
    hasHtmlReport: false,
    htmlReportUrl: '/assets/screenshots/playwright/index.html',
    isFeatured: true,
    sortOrder: projects.length + 1,
    isPublished: true,
  };

  const [formData, setFormData] = useState<ProjectItem>(emptyProject);

  const handleStartCreate = () => {
    const newId = `proj-${Date.now()}`;
    setFormData({
      ...emptyProject,
      id: newId,
      slug: `project-${Date.now()}`,
      sortOrder: projects.length + 1,
    });
    setIsCreating(true);
    setEditingProject(null);
  };

  const handleStartEdit = (p: ProjectItem) => {
    setFormData({ ...p });
    setEditingProject(p);
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (isCreating) {
      await addProject(formData);
    } else {
      await updateProject(formData);
    }

    setIsCreating(false);
    setEditingProject(null);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete case study "${title}"?`)) {
      await deleteProject(id);
    }
  };

  const handleTogglePublish = async (p: ProjectItem) => {
    await updateProject({ ...p, isPublished: !p.isPublished });
  };

  const handleToggleFeatured = async (p: ProjectItem) => {
    await updateProject({ ...p, isFeatured: !p.isFeatured });
  };

  const handleAddTech = () => {
    if (!newTech.trim()) return;
    if (!formData.techStack.includes(newTech.trim())) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, newTech.trim()],
      });
    }
    setNewTech('');
  };

  const handleRemoveTech = (t: string) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter((item) => item !== t),
    });
  };

  const sortedProjects = [...projects].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-[#2563eb]" />
            <span>Projects & QA Case Studies</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Create new portfolio projects, configure metadata, and edit case study architectures.
          </p>
        </div>

        {!isCreating && !editingProject && (
          <button
            onClick={handleStartCreate}
            className="px-4 py-2.5 rounded-xl bg-[#2563eb] text-white text-xs sm:text-sm font-bold hover:bg-[#1d4ed8] shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Project</span>
          </button>
        )}
      </div>

      {/* CREATE / QUICK EDIT MODAL OR FORM */}
      {(isCreating || editingProject) && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isCreating ? 'Create New Project' : `Edit Basic Info: ${formData.title}`}
            </h3>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingProject(null);
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
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Playwright End-to-End Automation Framework"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="e.g. playwright-framework"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  <option value="API">API</option>
                  <option value="Enterprise">Enterprise</option>
                  <option value="AI Platform">AI Platform</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Tag / Pill Label
                </label>
                <input
                  type="text"
                  value={formData.tagLabel}
                  onChange={(e) => setFormData({ ...formData, tagLabel: e.target.value })}
                  placeholder="e.g. Enterprise Automation"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Thumbnail Image Path
                </label>
                <input
                  type="text"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  placeholder="/assets/screenshots/playwright/framework.png"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Short Description (Cards)
              </label>
              <textarea
                rows={2}
                required
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Brief summary visible on project cards..."
                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Live HTML Test Report URL (Optional)
                </label>
                <input
                  type="text"
                  value={formData.htmlReportUrl || ''}
                  onChange={(e) => setFormData({ ...formData, htmlReportUrl: e.target.value, hasHtmlReport: !!e.target.value })}
                  placeholder="/assets/screenshots/playwright/index.html"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  GitHub Repository URL
                </label>
                <input
                  type="text"
                  value={formData.githubUrl || ''}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/Lingarajmb/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
            </div>

            {/* Tech Stack tags */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Tech Stack Badges
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-[#2563eb] dark:text-blue-300 text-xs font-semibold"
                  >
                    <span>{tech}</span>
                    <button type="button" onClick={() => handleRemoveTech(tech)}>
                      <X className="w-3 h-3 hover:text-rose-500" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="Add technology..."
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded text-[#2563eb] w-4 h-4"
                />
                <span>Published</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded text-[#2563eb] w-4 h-4"
                />
                <span>Featured on Homepage</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.hasHtmlReport}
                  onChange={(e) => setFormData({ ...formData, hasHtmlReport: e.target.checked })}
                  className="rounded text-[#2563eb] w-4 h-4"
                />
                <span>Include Live HTML Report Tab</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingProject(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8] shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Project</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PROJECTS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedProjects.map((project) => (
          <div
            key={project.id}
            className={`p-6 rounded-3xl bg-white dark:bg-slate-800 border transition-all flex flex-col justify-between ${
              project.isPublished ? 'border-slate-200 dark:border-slate-700 shadow-sm' : 'border-dashed border-slate-300 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/40 text-[#2563eb]">
                    {project.category}
                  </span>
                  {project.isFeatured && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      Featured
                    </span>
                  )}
                  {project.hasHtmlReport && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Report
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleTogglePublish(project)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
                    title={project.isPublished ? 'Unpublish' : 'Publish'}
                  >
                    {project.isPublished ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleStartEdit(project)}
                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                    title="Edit Metadata"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id, project.title)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {project.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {project.shortDescription}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {project.testScenarios.length} Scenarios • {project.workflowSteps.length} Workflow Steps
              </span>

              <button
                onClick={() => onOpenCaseStudyEditor(project.id)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-[#2563eb] dark:text-blue-300 text-xs font-bold hover:bg-blue-100 flex items-center gap-1.5"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Edit Case Study Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
