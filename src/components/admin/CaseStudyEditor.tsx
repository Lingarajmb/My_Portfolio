import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ProjectItem, CaseStudyWorkflowStep, TestCaseScenario } from '../../types/portfolio';
import {
  FileCheck2,
  Save,
  CheckCircle,
  Plus,
  Trash2,
  Workflow,
  Sparkles,
  Award,
  Lightbulb,
} from 'lucide-react';

interface CaseStudyEditorProps {
  initialProjectId?: string;
}

export const CaseStudyEditor: React.FC<CaseStudyEditorProps> = ({ initialProjectId }) => {
  const { projects, updateProject } = usePortfolio();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjectId || (projects[0]?.id || '')
  );

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const [formData, setFormData] = useState<ProjectItem | null>(activeProject ? { ...activeProject } : null);
  const [saved, setSaved] = useState(false);

  // New step / scenario drafts
  const [newStep, setNewStep] = useState({ title: '', description: '' });
  const [newScenario, setNewScenario] = useState({ title: '', description: '', type: 'Functional' });
  const [newStat, setNewStat] = useState({ label: '', value: '' });

  // Update formData when activeProject changes
  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    const p = projects.find((item) => item.id === id);
    if (p) setFormData({ ...p });
  };

  if (!formData) {
    return <div className="p-8 text-center text-slate-500">No projects found. Please create a project first.</div>;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    await updateProject(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAddWorkflowStep = () => {
    if (!newStep.title.trim()) return;
    const nextStep: CaseStudyWorkflowStep = {
      stepNumber: formData.workflowSteps.length + 1,
      title: newStep.title.trim(),
      description: newStep.description.trim(),
      icon: 'check',
    };
    setFormData({
      ...formData,
      workflowSteps: [...formData.workflowSteps, nextStep],
    });
    setNewStep({ title: '', description: '' });
  };

  const handleRemoveWorkflowStep = (index: number) => {
    const updated = formData.workflowSteps
      .filter((_, i) => i !== index)
      .map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setFormData({ ...formData, workflowSteps: updated });
  };

  const handleAddScenario = () => {
    if (!newScenario.title.trim()) return;
    const nextScenario: TestCaseScenario = {
      id: `sc-${Date.now()}`,
      title: newScenario.title.trim(),
      description: newScenario.description.trim(),
      type: newScenario.type,
      status: 'Automated',
    };
    setFormData({
      ...formData,
      testScenarios: [...formData.testScenarios, nextScenario],
    });
    setNewScenario({ title: '', description: '', type: 'Functional' });
  };

  const handleRemoveScenario = (id: string) => {
    setFormData({
      ...formData,
      testScenarios: formData.testScenarios.filter((s) => s.id !== id),
    });
  };

  const handleAddStat = () => {
    if (!newStat.label.trim() || !newStat.value.trim()) return;
    setFormData({
      ...formData,
      stats: [...(formData.stats || []), { label: newStat.label.trim(), value: newStat.value.trim() }],
    });
    setNewStat({ label: '', value: '' });
  };

  const handleRemoveStat = (index: number) => {
    setFormData({
      ...formData,
      stats: formData.stats.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-[#2563eb]" />
            <span>Deep Case Study Editor</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Customize execution workflows, test scenarios, problem & solution architecture, and metrics.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-300">
            <CheckCircle className="w-4 h-4" />
            <span>Case Study Saved!</span>
          </div>
        )}
      </div>

      {/* PROJECT SELECTOR DROPDOWN */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="text-xs font-bold uppercase text-slate-500 whitespace-nowrap">
          Active Case Study:
        </label>
        <select
          value={selectedProjectId}
          onChange={(e) => handleSelectProject(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} ({p.category})
            </option>
          ))}
        </select>
      </div>

      {/* MAIN CASE STUDY FORM */}
      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION 1: ARCHITECTURAL OVERVIEW */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#2563eb]" />
            <span>Problem Statement & Architectural Solution</span>
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
              Case Study Full Overview
            </label>
            <textarea
              rows={3}
              value={formData.overview || ''}
              onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
              placeholder="In-depth narrative of the project context and scope..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-amber-700 dark:text-amber-400 mb-1">
                The QA Challenge / Problem Statement
              </label>
              <textarea
                rows={3}
                value={formData.problemStatement || ''}
                onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                placeholder="What bottlenecks, flakiness, or performance challenges occurred..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-emerald-700 dark:text-emerald-400 mb-1">
                QA Solution & Architecture Approach
              </label>
              <textarea
                rows={3}
                value={formData.solutionApproach || ''}
                onChange={(e) => setFormData({ ...formData, solutionApproach: e.target.value })}
                placeholder="How the framework solved this using POM, data fixtures, CI/CD..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
            </div>
          </div>

          {/* Key Metrics / Stats */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-2">
              Key Metrics / Stats Badges
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              {formData.stats?.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-bold text-[#2563eb]">{stat.value}</div>
                    <div className="text-[10px] text-slate-500 uppercase">{stat.label}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveStat(idx)}
                    className="p-1 text-rose-500 hover:text-rose-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                placeholder="Value (e.g. 99.8%)"
                value={newStat.value}
                onChange={(e) => setNewStat({ ...newStat, value: e.target.value })}
                className="w-1/2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
              />
              <input
                type="text"
                placeholder="Label (e.g. Pass Rate)"
                value={newStat.label}
                onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
                className="w-1/2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
              />
              <button
                type="button"
                onClick={handleAddStat}
                className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold hover:bg-slate-300"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2: WORKFLOW & EXECUTION PIPELINE */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Workflow className="w-5 h-5 text-[#2563eb]" />
            <span>Workflow & Pipeline Steps ({formData.workflowSteps?.length || 0})</span>
          </h3>

          <div className="space-y-3">
            {formData.workflowSteps?.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#2563eb] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {step.stepNumber}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{step.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveWorkflowStep(idx)}
                  className="p-1.5 text-rose-500 hover:text-rose-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-500">Add Workflow Step</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Step Title (e.g. Test Fixture Initialization)"
                value={newStep.title}
                onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
              />
              <input
                type="text"
                placeholder="Description of execution actions..."
                value={newStep.description}
                onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
              />
            </div>
            <button
              type="button"
              onClick={handleAddWorkflowStep}
              className="px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8]"
            >
              + Add Workflow Step
            </button>
          </div>
        </div>

        {/* SECTION 3: TEST SCENARIOS */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-[#2563eb]" />
            <span>Validated Test Scenarios ({formData.testScenarios?.length || 0})</span>
          </h3>

          <div className="space-y-3">
            {formData.testScenarios?.map((sc, idx) => (
              <div
                key={sc.id || idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      #{idx + 1} {sc.title}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 dark:bg-slate-700">
                      {sc.type}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {sc.status || 'Automated'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{sc.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveScenario(sc.id)}
                  className="p-1.5 text-rose-500 hover:text-rose-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-500">Add Test Scenario</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Scenario Title (e.g. Order Booking Validation)"
                value={newScenario.title}
                onChange={(e) => setNewScenario({ ...newScenario, title: e.target.value })}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:col-span-2"
              />
              <select
                value={newScenario.type}
                onChange={(e) => setNewScenario({ ...newScenario, type: e.target.value })}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
              >
                <option value="Functional">Functional</option>
                <option value="API / Microservices">API / Microservices</option>
                <option value="Negative">Negative / Boundary</option>
                <option value="Security / Auth">Security / Auth</option>
                <option value="Regression">Regression</option>
              </select>
            </div>
            <textarea
              rows={2}
              placeholder="Detailed test assertions and expected behavior..."
              value={newScenario.description}
              onChange={(e) => setNewScenario({ ...newScenario, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
            />
            <button
              type="button"
              onClick={handleAddScenario}
              className="px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8]"
            >
              + Add Scenario
            </button>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-8 py-3 rounded-2xl bg-[#2563eb] text-white text-sm font-bold hover:bg-[#1d4ed8] shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Complete Case Study</span>
          </button>
        </div>
      </form>
    </div>
  );
};
