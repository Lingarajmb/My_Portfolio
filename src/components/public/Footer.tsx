import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ArrowUp, Mail, Shield } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/SocialIcons';

interface FooterProps {
  onOpenAdminLogin: () => void;
  onNavigateToAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminLogin, onNavigateToAdmin }) => {
  const { hero, contactInfo } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 relative">
      <div className="max-w-[1240px] w-[90%] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div>
            <div className="text-2xl font-extrabold text-white flex items-center gap-1 font-heading">
              <span className="text-[#2563eb]">L</span>
              <span>B</span>
              <span className="text-xs uppercase tracking-widest text-slate-500 ml-2 font-normal">
                QA Portfolio & Architecture
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 max-w-md">
              Designed & engineered by {hero.fullName || 'Lingaraj Belagali'}. Built for scalability, test automation precision, and continuous quality delivery.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href={contactInfo.gitHubUrl}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-[#2563eb] text-slate-300 hover:text-white flex items-center justify-center transition-all"
              aria-label="GitHub"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
            <a
              href={contactInfo.linkedInUrl}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-[#2563eb] text-slate-300 hover:text-white flex items-center justify-center transition-all"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${contactInfo.email}`}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-[#2563eb] text-slate-300 hover:text-white flex items-center justify-center transition-all"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-[#2563eb] text-slate-300 hover:text-white flex items-center justify-center transition-all ml-2"
              title="Scroll to Top"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            © {new Date().getFullYear()} {hero.fullName || 'Lingaraj Belagali'}. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <a href="#home" className="hover:text-white transition-colors">About</a>
            <a href="#journey" className="hover:text-white transition-colors">Journey</a>
            <a href="#skills" className="hover:text-white transition-colors">Skills</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>

            {/* Admin CMS Trigger */}
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1.5 text-slate-500 hover:text-amber-400 transition-colors ml-2"
              title="Admin CMS Login"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
