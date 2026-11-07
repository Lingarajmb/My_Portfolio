import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { JourneyMilestone } from '../../types/portfolio';
import { Briefcase, GraduationCap, Calendar, CheckCircle2, Award, Building, Sparkles } from 'lucide-react';

export const Journey: React.FC = () => {
  const { workExperience, journeyMilestones, education } = usePortfolio();
  const [activeTab, setActiveTab] = useState<'experience' | 'education' | 'milestones'>('experience');

  const publishedExperience = workExperience
    .filter((exp) => exp.isPublished)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section id="journey" className="py-24 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1240px] w-[90%] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-[#2563eb] dark:text-blue-400 text-xs font-semibold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Career & Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Professional <span className="text-[#2563eb]">Journey</span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Hands-on QA automation engineer with experience scaling quality assurance across enterprise capital markets, AI agents, and high-concurrency API microservices.
          </p>

          {/* Tab Selector */}
          <div className="inline-flex p-1 mt-6 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('experience')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'experience'
                  ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Experience ({publishedExperience.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'education'
                  ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Education</span>
            </button>
            <button
              onClick={() => setActiveTab('milestones')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'milestones'
                  ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Milestones</span>
            </button>
          </div>
        </div>

        {/* TAB 1: WORK EXPERIENCE */}
        {activeTab === 'experience' && (
          <div className="relative">
            {/* Timeline center line on desktop */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-400 to-slate-300 dark:to-slate-700 -translate-x-1/2" />

            <div className="space-y-10 lg:space-y-16">
              {publishedExperience.map((exp, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={exp.id}
                    className={`relative flex flex-col lg:flex-row items-center ${
                      isEven ? 'lg:flex-row-reverse' : ''
                    } gap-8`}
                  >
                    {/* Center Icon */}
                    <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white dark:bg-slate-800 border-4 border-[#2563eb] shadow-lg items-center justify-center z-20">
                      <Briefcase className="w-5 h-5 text-[#2563eb]" />
                    </div>

                    {/* Card Content */}
                    <div className="w-full lg:w-[calc(50%-2.5rem)]">
                      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700/80 shadow-md hover:shadow-xl transition-all duration-300 group">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-[#2563eb] dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            <Building className="w-3.5 h-3.5" />
                            {exp.companyName}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                            {exp.period}
                            {exp.isCurrent && (
                              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                Current
                              </span>
                            )}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-[#2563eb] transition-colors">
                          {exp.designation}
                        </h3>

                        {exp.domain && (
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                            Domain: <span className="text-indigo-600 dark:text-indigo-400">{exp.domain}</span>
                          </p>
                        )}

                        <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                          {exp.summary}
                        </p>

                        {/* Responsibilities list */}
                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                          <div className="mt-5 space-y-2 border-t border-slate-100 dark:border-slate-700/60 pt-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                              Key QA Responsibilities:
                            </h4>
                            <ul className="space-y-1.5">
                              {exp.responsibilities.map((resp, rIdx) => (
                                <li key={rIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{resp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Tech tags */}
                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="mt-5 flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                            {exp.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Spacer for other side on desktop */}
                    <div className="hidden lg:block w-[calc(50%-2.5rem)]" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: EDUCATION */}
        {activeTab === 'education' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-5"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-[#2563eb] flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-[#2563eb] dark:text-blue-300">
                    {edu.year}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                    {edu.degree}
                  </h3>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">
                    {edu.institution}
                  </p>
                  {edu.university && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {edu.university}
                    </p>
                  )}
                  {edu.score && (
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
                      Academic Score: {edu.score}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: MILESTONES */}
        {activeTab === 'milestones' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {journeyMilestones.map((m: JourneyMilestone) => (
              <div
                key={m.id}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shrink-0 shadow-sm">
                  {m.year}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {m.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    {m.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
