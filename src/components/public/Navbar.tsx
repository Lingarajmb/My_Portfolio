import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useAuth } from '../../context/AuthContext';
import {
  Moon,
  Sun,
  Shield,
  Menu,
  X,
  Download,
  Clock,
  UserCheck,
  UserX,
  LogIn,
} from 'lucide-react';

interface NavbarProps {
  onOpenAdminLogin: () => void;
  onNavigateToAdmin: () => void;
  onNavigateToMemberHub?: () => void;
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdminLogin,
  onNavigateToAdmin,
  onNavigateToMemberHub,
  onNavigateHome,
}) => {
  const { resumeDownloadUrl, downloadActiveResume } = usePortfolio();
  const { user, isAdmin, isApproved, isPending, isRejected } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  const navLinks = [
    { label: 'About', href: '#home' },
    { label: 'Journey', href: '#journey' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigateHome();

    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-md ${
        isScrolled
          ? 'bg-white/80 dark:bg-slate-900/80 shadow-[0_10px_35px_rgba(0,0,0,0.08)] border-b border-slate-200/50 dark:border-slate-800'
          : 'bg-white/60 dark:bg-slate-900/60 border-b border-transparent'
      }`}
    >
      <div className="max-w-[1300px] w-[90%] mx-auto h-[85px] flex items-center justify-between">
        {/* LOGO */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, '#home')}
          className="text-3xl font-extrabold tracking-tight font-heading text-slate-900 dark:text-white flex items-center gap-1 group"
        >
          <span className="text-[#2563eb] group-hover:scale-110 transition-transform">L</span>
          <span>B</span>
        </a>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#2563eb] dark:hover:text-[#60a5fa] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#2563eb] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            id="themeToggle"
            title="Toggle Dark / Light Theme"
            className="w-11 h-11 rounded-full flex items-center justify-center bg-white/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:text-[#2563eb] hover:border-[#2563eb] transition-all shadow-sm"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User / Admin Authentication State */}
          {isAdmin ? (
            <button
              onClick={onNavigateToAdmin}
              title="Open Admin Dashboard"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-semibold hover:bg-amber-100 transition-colors"
            >
              <Shield className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Admin CMS</span>
            </button>
          ) : user && isPending ? (
            <button
              onClick={onNavigateToMemberHub}
              title="Your registration is awaiting admin approval."
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-semibold hover:bg-amber-100 transition-colors"
            >
              <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
              <span className="hidden sm:inline">Awaiting Approval</span>
            </button>
          ) : user && isApproved ? (
            <button
              onClick={onNavigateToMemberHub}
              title="Open QA Member Hub"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors"
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Member Hub</span>
            </button>
          ) : user && isRejected ? (
            <button
              onClick={onNavigateToMemberHub}
              title="Registration status: Rejected"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors"
            >
              <UserX className="w-4 h-4 text-rose-600" />
              <span className="hidden sm:inline">Review Status</span>
            </button>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              title="Sign In or Register for Member Access"
              className="w-11 h-11 rounded-full flex items-center justify-center bg-white/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-[#2563eb] hover:border-[#2563eb] transition-all shadow-sm"
            >
              <Shield className="w-4 h-4" />
            </button>
          )}

          {/* Resume Download CTA */}
          <a
            href={resumeDownloadUrl}
            onClick={(e) => {
              e.preventDefault();
              downloadActiveResume();
            }}
            download="Lingaraj_Belagali_Resume_QA_Immediate_Joiner.pdf"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563eb] text-white text-sm font-semibold hover:bg-[#1d4ed8] hover:-translate-y-0.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            title="Download verified QA Resume"
          >
            <Download className="w-4 h-4" />
            <span>Resume</span>
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl text-slate-800 dark:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[85px] left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-6 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-base font-semibold text-slate-700 dark:text-slate-200 hover:text-[#2563eb] py-2 border-b border-slate-100 dark:border-slate-800/60"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-3 flex flex-col gap-3">
              <a
                href={resumeDownloadUrl}
                onClick={(e) => {
                  e.preventDefault();
                  downloadActiveResume();
                }}
                download="Lingaraj_Belagali_Resume_QA_Immediate_Joiner.pdf"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#2563eb] text-white font-semibold text-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume</span>
              </a>

              {isAdmin ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateToAdmin();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-amber-500 text-white font-semibold text-sm"
                >
                  <Shield className="w-4 h-4" />
                  <span>Go to Admin Dashboard</span>
                </button>
              ) : user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onNavigateToMemberHub) onNavigateToMemberHub();
                  }}
                  className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white font-semibold text-sm ${
                    isPending
                      ? 'bg-amber-600'
                      : isApproved
                      ? 'bg-emerald-600'
                      : 'bg-rose-600'
                  }`}
                >
                  {isPending ? (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>Registration Awaiting Approval</span>
                    </>
                  ) : isApproved ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Open Member Hub</span>
                    </>
                  ) : (
                    <>
                      <UserX className="w-4 h-4" />
                      <span>Check Registration Status</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdminLogin();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In / Register</span>
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
