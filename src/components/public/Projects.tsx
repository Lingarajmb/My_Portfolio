import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ProjectItem } from '../../types/portfolio';
import { FolderGit2, Search, ArrowRight, ExternalLink, FileText, CheckCircle } from 'lucide-react';

interface ProjectsProps {
  onSelectProject: (project: ProjectItem) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ onSelectProject }) => {
  const { projects } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Automation', 'API', 'Enterprise', 'AI Platform'];

  const publishedProjects = projects
    .filter((p) => p.isPublished)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const filteredProjects = publishedProjects.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <section id="projects" className="py-24 bg-slate-50 dark:bg-slate-900/60 relative">
      <div className="max-w-[1240px] w-[90%] mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-[#2563eb] dark:text-blue-400 text-xs font-semibold tracking-wide uppercase mb-3">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Case Studies & Frameworks</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Featured QA <span className="text-[#2563eb]">Projects</span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Detailed case studies with real execution workflows, test scenarios, automated test reports, and enterprise validation architectures.
          </p>
        </div>

        {/* Controls: Category Filter + Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects or tech stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            />
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Project Image & Badge */}
              <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden cursor-pointer" onClick={() => onSelectProject(project)}>
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  onError={(e) => {
                    // Fallback to placeholder if asset not found
                    (e.target as HTMLImageElement).src = '/assets/screenshots/playwright/framework.png';
                  }}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 dark:bg-slate-900/95 text-[#2563eb] shadow-sm backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                    {project.tagLabel || project.category}
                  </span>
                </div>
                {project.hasHtmlReport && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/90 text-white shadow-sm flex items-center gap-1 backdrop-blur-sm">
                      <CheckCircle className="w-3 h-3" />
                      Live Report
                    </span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => onSelectProject(project)}
                    className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#2563eb] transition-colors cursor-pointer"
                  >
                    {project.title}
                  </h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-300 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                    {project.shortDescription}
                  </p>

                  {/* Project Stats Chips */}
                  {project.stats && project.stats.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                      {project.stats.slice(0, 2).map((s, idx) => (
                        <div key={idx} className="bg-slate-50 dark:bg-slate-700/40 p-2 rounded-xl text-center">
                          <div className="text-xs font-bold text-[#2563eb] dark:text-blue-400">
                            {s.value}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {s.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tech stack badges */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-700/60 text-slate-500">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectProject(project)}
                    className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#2563eb] hover:text-[#1d4ed8] dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    <span>View Case Study</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {project.hasHtmlReport && project.htmlReportUrl && (
                    <a
                      href={project.htmlReportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                      title="Open Live HTML Test Report"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Test Report</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 text-slate-500 dark:text-slate-400 text-sm">
            No projects matched your criteria.
          </div>
        )}
      </div>
    </section>
  );
};
