import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { usePortfolio } from './context/PortfolioContext';
import { ProjectItem } from './types/portfolio';

// Public components
import { Preloader } from './components/public/Preloader';
import { ScrollProgress } from './components/public/ScrollProgress';
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { Journey } from './components/public/Journey';
import { Skills } from './components/public/Skills';
import { Projects } from './components/public/Projects';
import { CaseStudyModal } from './components/public/CaseStudyModal';
import { Contact } from './components/public/Contact';
import { Footer } from './components/public/Footer';

// Member Hub (Protected resources & approval status)
import { MemberHub } from './components/member/MemberHub';

// Admin components
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { DashboardOverview } from './components/admin/DashboardOverview';
import { UserManager } from './components/admin/UserManager';
import { HeroManager } from './components/admin/HeroManager';
import { ExperienceManager } from './components/admin/ExperienceManager';
import { SkillsManager } from './components/admin/SkillsManager';
import { ProjectsManager } from './components/admin/ProjectsManager';
import { CaseStudyEditor } from './components/admin/CaseStudyEditor';
import { ResumeManager } from './components/admin/ResumeManager';
import { FileManager } from './components/admin/FileManager';
import { ContactManager } from './components/admin/ContactManager';
import { SupabaseSetupGuide } from './components/admin/SupabaseSetupGuide';

export const App: React.FC = () => {
  const { isAdmin, user, isApproved, isPending, isRejected } = useAuth();
  const [isAdminView, setIsAdminView] = useState(false);
  const [isMemberView, setIsMemberView] = useState(false);
  const [adminTab, setAdminTab] = useState('overview');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<ProjectItem | null>(null);
  const [caseStudyEditorProjectId, setCaseStudyEditorProjectId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  // Quick initial loading screen for smoothness
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenAuthModal = () => {
    setIsLoginModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsLoginModalOpen(false);
    if (isAdmin) {
      setIsAdminView(true);
      setIsMemberView(false);
    } else {
      setIsMemberView(true);
      setIsAdminView(false);
    }
  };

  const handleNavigateToAdmin = () => {
    if (isAdmin) {
      setIsAdminView(true);
      setIsMemberView(false);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleNavigateToMemberHub = () => {
    setIsMemberView(true);
    setIsAdminView(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToPortfolio = () => {
    setIsAdminView(false);
    setIsMemberView(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCaseStudyEditor = (projectId: string) => {
    setCaseStudyEditorProjectId(projectId);
    setAdminTab('casestudies');
  };

  if (isLoading) {
    return <Preloader />;
  }

  // MEMBER HUB VIEW (For registered users: pending, approved, or rejected)
  if (isMemberView) {
    return (
      <MemberHub
        onReturnToPortfolio={handleReturnToPortfolio}
        onOpenLoginModal={handleOpenAuthModal}
      />
    );
  }

  // ADMIN CMS VIEW (Strictly for Lingaraj / lingarajmb1997@gmail.com)
  if (isAdminView) {
    if (!isAdmin) {
      return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
          <div className="max-w-md w-full p-8 rounded-3xl bg-slate-800 border border-slate-700 text-center space-y-4">
            <h2 className="text-xl font-bold">Admin Authentication Required</h2>
            <p className="text-xs text-slate-400">
              Only the authorized portfolio owner (lingarajmb1997@gmail.com) is permitted to access the CMS management dashboard.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setIsAdminView(false)}
                className="px-4 py-2 rounded-xl bg-slate-700 text-xs font-bold hover:bg-slate-600 transition-colors"
              >
                Back to Portfolio
              </button>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#2563eb] text-xs font-bold hover:bg-[#1d4ed8] transition-colors"
              >
                Sign In as Admin
              </button>
            </div>
          </div>
          <AdminLoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onSuccess={handleAuthSuccess}
          />
        </div>
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={setAdminTab}
        onReturnToPortfolio={handleReturnToPortfolio}
      >
        {adminTab === 'overview' && (
          <DashboardOverview
            onNavigateTab={setAdminTab}
            onReturnToPortfolio={handleReturnToPortfolio}
          />
        )}
        {adminTab === 'users' && <UserManager />}
        {adminTab === 'hero' && <HeroManager />}
        {adminTab === 'experience' && <ExperienceManager />}
        {adminTab === 'skills' && <SkillsManager />}
        {adminTab === 'projects' && (
          <ProjectsManager onOpenCaseStudyEditor={handleOpenCaseStudyEditor} />
        )}
        {adminTab === 'casestudies' && (
          <CaseStudyEditor initialProjectId={caseStudyEditorProjectId} />
        )}
        {adminTab === 'resumes' && <ResumeManager />}
        {adminTab === 'files' && <FileManager />}
        {adminTab === 'contact' && <ContactManager />}
        {adminTab === 'supabase' && <SupabaseSetupGuide />}
      </AdminLayout>
    );
  }

  // PUBLIC PORTFOLIO VIEW
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 selection:bg-blue-500 selection:text-white">
      <ScrollProgress />

      <Navbar
        onOpenAdminLogin={handleOpenAuthModal}
        onNavigateToAdmin={handleNavigateToAdmin}
        onNavigateToMemberHub={handleNavigateToMemberHub}
        onNavigateHome={() => {
          setIsAdminView(false);
          setIsMemberView(false);
          setSelectedCaseStudy(null);
        }}
      />

      <main>
        <Hero
          onExploreProjects={() => {
            const el = document.getElementById('projects');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onContactClick={() => {
            const el = document.getElementById('contact');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <Journey />

        <Skills />

        <Projects onSelectProject={(project) => setSelectedCaseStudy(project)} />

        <Contact />
      </main>

      <Footer
        onOpenAdminLogin={handleOpenAuthModal}
        onNavigateToAdmin={handleNavigateToAdmin}
      />

      {/* Case Study In-Depth Modal */}
      {selectedCaseStudy && (
        <CaseStudyModal
          project={selectedCaseStudy}
          onClose={() => setSelectedCaseStudy(null)}
        />
      )}

      {/* Auth / Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};
