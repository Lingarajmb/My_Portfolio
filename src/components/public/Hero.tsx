import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ArrowDown, Download, Briefcase, ListChecks, Rocket, Wrench } from 'lucide-react';

interface HeroProps {
  onExploreClick?: () => void;
  onExploreProjects?: () => void;
  onContactClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onExploreProjects, onContactClick }) => {
  const { hero, resumeDownloadUrl, downloadActiveResume } = usePortfolio();
  const handleExplore = onExploreProjects || onExploreClick;

  // Typing effect
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const words = hero.typingWords && hero.typingWords.length > 0
      ? hero.typingWords
      : ["Quality Assurance Engineer", "Manual Testing Expert", "Playwright Automation"];

    const currentWord = words[currentWordIndex] || words[0];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentCharIndex < currentWord.length) {
          setCurrentCharIndex(prev => prev + 1);
        } else {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), 1600);
        }
      } else {
        if (currentCharIndex > 0) {
          setCurrentCharIndex(prev => prev - 1);
        } else {
          setIsDeleting(false);
          setCurrentWordIndex(prev => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 40 : 80);

    return () => clearTimeout(timer);
  }, [currentCharIndex, isDeleting, currentWordIndex, hero.typingWords]);

  const words = hero.typingWords && hero.typingWords.length > 0 ? hero.typingWords : ["QA Engineer"];
  const currentWord = words[currentWordIndex] || "";
  const displayedText = currentWord.substring(0, currentCharIndex);

  const resumeUrl = resumeDownloadUrl;

  return (
    <section id="home" className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden">
      {/* Background radial glow circles */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-40 -right-20 w-[450px] h-[450px] bg-sky-400/20 dark:bg-sky-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-indigo-400/15 dark:bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1300px] w-[90%] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
        {/* LEFT CONTENT */}
        <div className="flex flex-col items-start">
          {/* Availability Badge */}
          {hero.isAvailable && (
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 backdrop-blur-md shadow-sm mb-6 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse-glow" />
              <span>{hero.availabilityStatus || "Available for Immediate Joining"}</span>
            </div>
          )}

          <p className="text-[#2563eb] dark:text-[#60a5fa] text-lg font-semibold mb-2">
            👋 Hello, I'm
          </p>

          <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold font-heading text-slate-900 dark:text-white leading-[1.08] mb-3">
            {hero.fullName}
          </h1>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2 font-heading">
            {hero.designation}
          </h2>

          {/* Animated typing headline */}
          <div className="h-9 mb-6 flex items-center">
            <span className="text-xl sm:text-2xl font-bold text-[#2563eb] dark:text-[#60a5fa] font-heading">
              {displayedText}
            </span>
            <span className="inline-block w-[3px] h-6 bg-[#2563eb] dark:bg-[#60a5fa] ml-1 animate-pulse" />
          </div>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
            {hero.bio}
          </p>

          {/* Hero CTA buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-12 w-full sm:w-auto">
            <button
              onClick={handleExplore}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:-translate-y-1 transition-all text-center"
            >
              {hero.primaryCtaText || "Explore My Work"}
            </button>

            <a
              href={resumeUrl}
              onClick={(e) => {
                e.preventDefault();
                downloadActiveResume();
              }}
              download="Lingaraj_Belagali_Resume_QA_Immediate_Joiner.pdf"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl border-2 border-[#2563eb] text-[#2563eb] dark:text-blue-400 bg-white dark:bg-slate-800 font-semibold text-base hover:bg-[#2563eb] hover:text-white dark:hover:text-white hover:-translate-y-1 transition-all text-center shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{hero.secondaryCtaText || "Download Resume"}</span>
            </a>
          </div>

          {/* Stats counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-md text-center shadow-sm hover:-translate-y-1 transition-transform">
              <Briefcase className="w-5 h-5 text-[#2563eb] mx-auto mb-1.5" />
              <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
                {hero.yearsOfExperience}+
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Years Experience
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-md text-center shadow-sm hover:-translate-y-1 transition-transform">
              <ListChecks className="w-5 h-5 text-[#2563eb] mx-auto mb-1.5" />
              <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
                {hero.testCasesCount}+
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Test Cases
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-md text-center shadow-sm hover:-translate-y-1 transition-transform">
              <Rocket className="w-5 h-5 text-[#2563eb] mx-auto mb-1.5" />
              <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
                {hero.releasesCount}+
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Releases
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-md text-center shadow-sm hover:-translate-y-1 transition-transform">
              <Wrench className="w-5 h-5 text-[#2563eb] mx-auto mb-1.5" />
              <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
                {hero.toolsCount}+
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                QA Tools
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE WITH FLOATING BADGES */}
        <div className="relative flex justify-center items-center mt-6 lg:mt-0">
          <div className="relative w-[320px] sm:w-[420px] xl:w-[460px] h-[400px] sm:h-[500px] xl:h-[540px] rounded-[36px] bg-gradient-to-tr from-white/90 to-blue-50/60 dark:from-slate-800/90 dark:to-slate-900/60 border border-slate-200/80 dark:border-slate-700 backdrop-blur-xl shadow-2xl flex items-end justify-center overflow-hidden group">
            <img
              src={hero.profileImageUrl || "/assets/profile.png"}
              alt={hero.fullName}
              className="w-[88%] h-auto object-cover object-bottom transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* 7 Floating Tech Badges */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-md text-sm font-bold text-slate-800 dark:text-slate-200 absolute -top-4 -left-6 animate-float">
            <i className="fa-solid fa-code text-[#2563eb]" />
            <span>Playwright</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-md text-sm font-bold text-slate-800 dark:text-slate-200 absolute top-20 -right-6 animate-float-delayed-1">
            <i className="fa-solid fa-plug text-[#2563eb]" />
            <span>REST API</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-md text-sm font-bold text-slate-800 dark:text-slate-200 absolute top-52 -left-8 animate-float-delayed-2">
            <i className="fa-solid fa-database text-[#2563eb]" />
            <span>SQL</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-md text-sm font-bold text-slate-800 dark:text-slate-200 absolute bottom-36 -right-6 animate-float">
            <i className="fa-solid fa-leaf text-emerald-500" />
            <span>MongoDB</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-md text-sm font-bold text-slate-800 dark:text-slate-200 absolute -bottom-3 left-4 animate-float-delayed-1">
            <i className="fa-solid fa-bug text-blue-500" />
            <span>JIRA</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-md text-sm font-bold text-slate-800 dark:text-slate-200 absolute top-1/2 -right-10 animate-float-delayed-2">
            <i className="fa-solid fa-robot text-purple-500" />
            <span>Mabl</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-md text-sm font-bold text-slate-800 dark:text-slate-200 absolute -bottom-4 right-10 animate-float">
            <i className="fa-solid fa-layer-group text-amber-500" />
            <span>Agile</span>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-semibold animate-bounce-slow">
        <span>Scroll Down</span>
        <ArrowDown className="w-4 h-4 text-[#2563eb]" />
      </div>
    </section>
  );
};
