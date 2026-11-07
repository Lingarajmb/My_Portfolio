import React, { useState } from 'react';
import { ProjectItem } from '../../types/portfolio';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  X,
  ExternalLink,
  CheckCircle2,
  FileCheck,
  Workflow,
  Image,
  Award,
  Lightbulb,
  Maximize2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { GithubIcon } from '../common/SocialIcons';

interface CaseStudyModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ project, onClose }) => {
  const { caseStudyFiles } = usePortfolio();
  const [activeTab, setActiveTab] = useState<'overview' | 'workflow' | 'scenarios' | 'gallery' | 'report'>('overview');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  if (!project) return null;

  // Filter media files belonging to this project
  const projectMedia = caseStudyFiles
    .filter((f) => f.projectId === project.id)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col my-auto">
        {/* MODAL HEADER */}
        <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#2563eb] text-white">
              {project.tagLabel || project.category}
            </span>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span>Projects</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                {project.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="View GitHub Repository"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Open Live Demonstration"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Close Case Study"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* HERO BANNER */}
        <div className="px-6 sm:px-8 py-6 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white shrink-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {project.title}
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            {project.overview || project.shortDescription}
          </p>

          {/* Quick Metrics */}
          {project.stats && project.stats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-700/60">
              {project.stats.map((s, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
                  <div className="text-lg font-extrabold text-blue-400">{s.value}</div>
                  <div className="text-[11px] text-slate-300 uppercase tracking-wider font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 shrink-0 overflow-x-auto gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 px-2 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'border-[#2563eb] text-[#2563eb] dark:text-blue-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Overview</span>
          </button>

          {project.workflowSteps && project.workflowSteps.length > 0 && (
            <button
              onClick={() => setActiveTab('workflow')}
              className={`py-3.5 px-2 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === 'workflow'
                  ? 'border-[#2563eb] text-[#2563eb] dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Workflow className="w-4 h-4" />
              <span>Workflow & Pipeline</span>
            </button>
          )}

          {project.testScenarios && project.testScenarios.length > 0 && (
            <button
              onClick={() => setActiveTab('scenarios')}
              className={`py-3.5 px-2 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === 'scenarios'
                  ? 'border-[#2563eb] text-[#2563eb] dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Test Scenarios ({project.testScenarios.length})</span>
            </button>
          )}

          {projectMedia.length > 0 && (
            <button
              onClick={() => setActiveTab('gallery')}
              className={`py-3.5 px-2 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === 'gallery'
                  ? 'border-[#2563eb] text-[#2563eb] dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Image className="w-4 h-4" />
              <span>Proof & Screenshots ({projectMedia.length})</span>
            </button>
          )}

          {project.hasHtmlReport && (
            <button
              onClick={() => setActiveTab('report')}
              className={`py-3.5 px-2 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === 'report'
                  ? 'border-[#2563eb] text-[#2563eb] dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileCheck className="w-4 h-4 text-emerald-500" />
              <span>HTML Test Report</span>
            </button>
          )}
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white dark:bg-slate-900 space-y-8">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Problem & Solution Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.problemStatement && (
                  <div className="p-6 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      The Challenge / Problem
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {project.problemStatement}
                    </p>
                  </div>
                )}

                {project.solutionApproach && (
                  <div className="p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      QA Solution & Architecture
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {project.solutionApproach}
                    </p>
                  </div>
                )}
              </div>

              {/* Technologies */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                  Technologies & Frameworks
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Responsibilities */}
              {project.responsibilities && project.responsibilities.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                    Key QA Responsibilities
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.responsibilities.map((r, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#2563eb] shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{r.title}</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{r.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements & Impact */}
              {project.achievements && project.achievements.length > 0 && (
                <div className="p-6 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-2 mb-4">
                    <Award className="w-4 h-4 text-[#2563eb]" />
                    Measurable Outcomes & Achievements
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.achievements.map((ach, i) => (
                      <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-blue-100 dark:border-slate-700">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ach.title}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{ach.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lessons Learned */}
              {project.lessonsLearned && project.lessonsLearned.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    Key Learnings & Best Practices
                  </h3>
                  <ul className="space-y-2">
                    {project.lessonsLearned.map((lesson, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WORKFLOW & PIPELINE */}
          {activeTab === 'workflow' && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Execution Workflow & Architecture Stages
              </h3>
              <div className="space-y-4">
                {project.workflowSteps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md shadow-blue-500/20">
                      {step.stepNumber}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {step.title}
                      </h4>
                      <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TEST SCENARIOS */}
          {activeTab === 'scenarios' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Validated Test Scenarios ({project.testScenarios.length})
                </h3>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                {project.testScenarios.map((sc, idx) => (
                  <div key={sc.id || idx} className="p-4 sm:p-5 bg-white dark:bg-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          #{idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {sc.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {sc.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {sc.type}
                      </span>
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {sc.status || 'Automated'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SCREENSHOTS GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Execution Artifacts & Visual Proof ({projectMedia.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projectMedia.map((media) => (
                  <div
                    key={media.id}
                    className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shadow-sm cursor-pointer"
                    onClick={() => setLightboxImage(media.url)}
                  >
                    <div className="h-56 w-full overflow-hidden">
                      <img
                        src={media.url}
                        alt={media.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {media.title}
                        </h4>
                        {media.description && (
                          <p className="text-[11px] text-slate-500 truncate">{media.description}</p>
                        )}
                      </div>
                      <button className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#2563eb]">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: HTML TEST REPORT */}
          {activeTab === 'report' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <div>
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    Interactive HTML Test Report
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Live execution report with full test suite breakdown, duration, assertions, and status.
                  </p>
                </div>
                <a
                  href={project.htmlReportUrl || '/assets/screenshots/playwright/index.html'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Report in New Tab</span>
                </a>
              </div>

              {/* Embedded Iframe */}
              <div className="w-full h-[520px] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner bg-slate-900">
                <iframe
                  src={project.htmlReportUrl || '/assets/screenshots/playwright/index.html'}
                  title="Playwright Live Test Report"
                  className="w-full h-full border-none"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Automated QA Architecture by Lingaraj Belagali
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* LIGHTBOX FOR SCREENSHOT ZOOM */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-slate-300"
            >
              <X className="w-7 h-7" />
            </button>
            <img
              src={lightboxImage}
              alt="Zoomed Screenshot"
              className="rounded-xl max-h-[85vh] object-contain shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </div>
  );
};
