import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  HeroData,
  WorkExperience,
  JourneyMilestone,
  SkillItem,
  ProjectItem,
  CaseStudyFile,
  ResumeVersion,
  ContactInfo,
  EducationItem,
  CertificationItem,
  QAChecklistItem,
} from '../types/portfolio';
import {
  initialHeroData,
  initialWorkExperience,
  initialMilestones,
  initialSkills,
  initialProjects,
  initialCaseStudyFiles,
  initialResumes,
  initialContactInfo,
  initialEducation,
  initialCertifications,
  initialQAChecklist,
} from '../data/initialPortfolioData';
import { getSupabaseClient, getSupabaseCredentials } from '../lib/supabase';
import {
  uploadAndVerifyResume,
  deleteOldResumeStorageFile,
  rollbackUploadedResumeFile,
  getResumeDownloadUrl,
  triggerResumeDownload,
} from '../lib/storage';

export interface PortfolioContextType {
  hero: HeroData;
  workExperience: WorkExperience[];
  milestones: JourneyMilestone[];
  journeyMilestones: JourneyMilestone[];
  skills: SkillItem[];
  projects: ProjectItem[];
  caseStudyFiles: CaseStudyFile[];
  resumes: ResumeVersion[];
  resumeVersions: ResumeVersion[];
  contactInfo: ContactInfo;
  education: EducationItem[];
  certifications: CertificationItem[];
  qaChecklist: QAChecklistItem[];
  activeResume: ResumeVersion | null;
  resumeDownloadUrl: string;
  isSupabaseConnected: boolean;
  isSupabaseConfigured: boolean;
  isLoading: boolean;
  isSyncing: boolean;
  syncStatus: 'synced' | 'local' | 'error';
  lastSavedAt: string | null;

  setSupabaseConfigured: (val: boolean) => void;
  refreshFromDatabase: () => Promise<boolean>;
  seedSupabaseDatabase: () => Promise<{ success: boolean; message: string }>;

  // Actions
  updateHero: (data: Partial<HeroData>) => Promise<boolean>;
  updateContactInfo: (data: Partial<ContactInfo>) => Promise<boolean>;

  // Work Experience Management
  addExperience: (exp: WorkExperience | Omit<WorkExperience, 'id'>) => Promise<boolean>;
  addWorkExperience: (exp: WorkExperience | Omit<WorkExperience, 'id'>) => Promise<boolean>;
  updateExperience: (idOrExp: string | WorkExperience, patch?: Partial<WorkExperience>) => Promise<boolean>;
  updateWorkExperience: (idOrExp: string | WorkExperience, patch?: Partial<WorkExperience>) => Promise<boolean>;
  deleteExperience: (id: string) => Promise<boolean>;
  deleteWorkExperience: (id: string) => Promise<boolean>;
  toggleExperiencePublish: (id: string) => Promise<boolean>;

  // Journey Milestones
  addMilestone: (milestone: Omit<JourneyMilestone, 'id'>) => Promise<boolean>;
  updateMilestone: (id: string, milestone: Partial<JourneyMilestone>) => Promise<boolean>;
  deleteMilestone: (id: string) => Promise<boolean>;

  // Skills Management
  addSkill: (skill: SkillItem | Omit<SkillItem, 'id'>) => Promise<boolean>;
  updateSkill: (idOrSkill: string | SkillItem, patch?: Partial<SkillItem>) => Promise<boolean>;
  deleteSkill: (id: string) => Promise<boolean>;

  // Project & Case Study Management
  addProject: (proj: ProjectItem | Omit<ProjectItem, 'id'>) => Promise<boolean>;
  updateProject: (idOrProj: string | ProjectItem, patch?: Partial<ProjectItem>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  toggleProjectPublish: (id: string) => Promise<boolean>;

  // Project-specific File Management
  addCaseStudyFile: (file: CaseStudyFile | Omit<CaseStudyFile, 'id'>) => Promise<boolean>;
  deleteCaseStudyFile: (id: string) => Promise<boolean>;
  updateCaseStudyFile: (id: string, data: Partial<CaseStudyFile>) => Promise<boolean>;

  // Single Active Resume Management
  replaceActiveResume: (
    file: File,
    title?: string,
    notes?: string
  ) => Promise<{ success: boolean; error?: string; oldFileDeleted?: boolean }>;
  downloadActiveResume: () => Promise<void>;
  addResumeVersion: (resume: ResumeVersion | Omit<ResumeVersion, 'id'>) => Promise<boolean>;
  activateResumeVersion: (id: string) => Promise<boolean>;
  setActiveResumeVersion: (id: string) => Promise<boolean>;
  deleteResumeVersion: (id: string) => Promise<boolean>;

  // QA Checklist toggle
  toggleChecklistItem: (id: string) => void;

  // Reset to initial defaults
  resetToDefaults: () => void;
  syncWithSupabase: () => Promise<boolean>;
}

const STORAGE_KEY_PORTFOLIO = 'lingaraj_portfolio_data_v2';

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hero, setHero] = useState<HeroData>(initialHeroData);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>(initialWorkExperience);
  const [milestones, setMilestones] = useState<JourneyMilestone[]>(initialMilestones);
  const [skills, setSkills] = useState<SkillItem[]>(initialSkills);
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [caseStudyFiles, setCaseStudyFiles] = useState<CaseStudyFile[]>(initialCaseStudyFiles);
  const [resumes, setResumes] = useState<ResumeVersion[]>(initialResumes);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(initialContactInfo);
  const [education, setEducation] = useState<EducationItem[]>(initialEducation);
  const [certifications, setCertifications] = useState<CertificationItem[]>(initialCertifications);
  const [qaChecklist, setQaChecklist] = useState<QAChecklistItem[]>(initialQAChecklist);

  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    setIsLoading(true);

    // 1. Load cached state if available for instant display
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(STORAGE_KEY_PORTFOLIO);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.hero) setHero(parsed.hero);
          if (parsed.workExperience) setWorkExperience(parsed.workExperience);
          if (parsed.milestones) setMilestones(parsed.milestones);
          if (parsed.skills) setSkills(parsed.skills);
          if (parsed.projects) setProjects(parsed.projects);
          if (parsed.caseStudyFiles) setCaseStudyFiles(parsed.caseStudyFiles);
          if (parsed.resumes) setResumes(parsed.resumes);
          if (parsed.contactInfo) setContactInfo(parsed.contactInfo);
          if (parsed.education) setEducation(parsed.education);
          if (parsed.certifications) setCertifications(parsed.certifications);
        } catch (e) {
          console.warn('Failed to parse cached portfolio data:', e);
        }
      }
    }

    // 2. Fetch live data from Supabase
    const { isConfigured } = getSupabaseCredentials();
    if (isConfigured) {
      await fetchFromSupabase();
    }

    setIsLoading(false);
  };

  /**
   * Fetches published portfolio data dynamically from Supabase
   */
  const fetchFromSupabase = async (): Promise<boolean> => {
    setIsSyncing(true);
    const supabase = getSupabaseClient();
    if (!supabase) {
      setIsSyncing(false);
      return false;
    }

    try {
      // 1. Projects
      const { data: dbProjects, error: projError } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!projError && dbProjects && dbProjects.length > 0) {
        setIsSupabaseConnected(true);
        const mappedProjects = dbProjects.map((p: any) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          tagLabel: p.tag_label || p.category,
          category: p.category,
          colorTheme: p.color_theme || 'blue',
          shortDescription: p.short_description,
          overview: p.overview || '',
          problemStatement: p.problem_statement || '',
          solutionApproach: p.solution_approach || '',
          techStack: p.tech_stack || [],
          features: p.features || [],
          stats: p.stats || [],
          workflowSteps: p.workflow_steps || [],
          testScenarios: p.test_scenarios || [],
          responsibilities: p.responsibilities || [],
          achievements: p.achievements || [],
          lessonsLearned: p.lessons_learned || [],
          thumbnailUrl: p.thumbnail_url || '',
          demoUrl: p.demo_url || '',
          githubUrl: p.github_url || '',
          hasHtmlReport: Boolean(p.has_html_report),
          htmlReportUrl: p.html_report_url || '',
          isFeatured: Boolean(p.is_featured),
          sortOrder: p.sort_order || 1,
          isPublished: Boolean(p.is_published),
        }));
        setProjects(mappedProjects);
      }

      // 2. Work Experience
      const { data: dbExp, error: expError } = await supabase
        .from('portfolio_work_experience')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!expError && dbExp && dbExp.length > 0) {
        setIsSupabaseConnected(true);
        const mappedExp = dbExp.map((e: any) => ({
          id: e.id,
          companyName: e.company_name,
          designation: e.designation,
          period: e.period,
          startDate: e.start_date,
          endDate: e.end_date,
          isCurrent: Boolean(e.is_current),
          employmentType: e.employment_type || 'Full-time',
          domain: e.domain || '',
          summary: e.summary,
          responsibilities: e.responsibilities || [],
          technologies: e.technologies || [],
          achievements: e.achievements || [],
          sortOrder: e.sort_order || 1,
          isPublished: Boolean(e.is_published),
        }));
        setWorkExperience(mappedExp);
      }

      // 3. Technical Skills
      const { data: dbSkills, error: skillsError } = await supabase
        .from('portfolio_skills')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!skillsError && dbSkills && dbSkills.length > 0) {
        const mappedSkills = dbSkills.map((s: any) => ({
          id: s.id,
          name: s.name,
          category: s.category,
          proficiency: s.proficiency,
          icon: s.icon,
          sortOrder: s.sort_order,
          isPublished: Boolean(s.is_published),
        }));
        setSkills(mappedSkills);
      }

      // 4. Hero Content
      const { data: dbHero, error: heroError } = await supabase
        .from('portfolio_hero')
        .select('*')
        .limit(1)
        .single();

      if (!heroError && dbHero) {
        setHero({
          fullName: dbHero.full_name || initialHeroData.fullName,
          designation: dbHero.designation || initialHeroData.designation,
          typingWords: dbHero.typing_words || initialHeroData.typingWords,
          bio: dbHero.bio || initialHeroData.bio,
          availabilityStatus: dbHero.availability_status || initialHeroData.availabilityStatus,
          isAvailable: Boolean(dbHero.is_available),
          yearsOfExperience: Number(dbHero.years_of_experience) || initialHeroData.yearsOfExperience,
          testCasesCount: Number(dbHero.test_cases_count) || initialHeroData.testCasesCount,
          releasesCount: Number(dbHero.releases_count) || initialHeroData.releasesCount,
          toolsCount: Number(dbHero.tools_count) || initialHeroData.toolsCount,
          primaryCtaText: dbHero.primary_cta_text || initialHeroData.primaryCtaText,
          primaryCtaLink: dbHero.primary_cta_link || initialHeroData.primaryCtaLink,
          secondaryCtaText: dbHero.secondary_cta_text || initialHeroData.secondaryCtaText,
          secondaryCtaLink: dbHero.secondary_cta_link || initialHeroData.secondaryCtaLink,
          profileImageUrl: dbHero.profile_image_url || initialHeroData.profileImageUrl,
          floatingBadges: dbHero.floating_badges || initialHeroData.floatingBadges,
        });
      }

      // 5. Contact Info
      const { data: dbContact, error: contactError } = await supabase
        .from('portfolio_contact')
        .select('*')
        .limit(1)
        .single();

      if (!contactError && dbContact) {
        setContactInfo({
          email: dbContact.email || initialContactInfo.email,
          phone: dbContact.phone || initialContactInfo.phone,
          linkedInUrl: dbContact.linkedin_url || initialContactInfo.linkedInUrl,
          gitHubUrl: dbContact.github_url || initialContactInfo.gitHubUrl,
          statusBadge: dbContact.status_badge || initialContactInfo.statusBadge,
          roleHeadline: dbContact.role_headline || initialContactInfo.roleHeadline,
          availabilitySummary: dbContact.availability_summary || initialContactInfo.availabilitySummary,
          availabilityTags: dbContact.availability_tags || initialContactInfo.availabilityTags,
        });
      }

      // 6. Resumes
      const { data: dbResumes, error: resError } = await supabase
        .from('portfolio_resume_versions')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (!resError && dbResumes && dbResumes.length > 0) {
        const mappedResumes = dbResumes.map((r: any) => ({
          id: r.id,
          title: r.title,
          fileName: r.file_name,
          storagePath: r.storage_path,
          version: r.version,
          fileSize: r.file_size,
          isActive: Boolean(r.is_active),
          uploadedAt: r.uploaded_at,
          notes: r.notes || '',
        }));
        setResumes(mappedResumes);
      }

      // 7. Case Study Attachments / Screenshots
      const { data: dbFiles, error: filesError } = await supabase
        .from('portfolio_case_study_files')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!filesError && dbFiles && dbFiles.length > 0) {
        const mappedFiles = dbFiles.map((f: any) => ({
          id: f.id,
          projectId: f.project_id,
          title: f.title,
          description: f.description,
          fileType: f.file_type || 'image',
          url: f.url,
          fileName: f.file_name,
          fileSize: f.file_size,
          sortOrder: f.sort_order || 1,
          uploadedAt: f.uploaded_at,
        }));
        setCaseStudyFiles(mappedFiles);
      }

      // 8. Journey Milestones
      const { data: dbMilestones, error: mileError } = await supabase
        .from('portfolio_journey_milestones')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!mileError && dbMilestones && dbMilestones.length > 0) {
        setMilestones(dbMilestones.map((m: any) => ({
          id: m.id,
          year: m.year,
          title: m.title,
          description: m.description,
          isCurrent: Boolean(m.is_current),
        })));
      }

      // 9. Education
      const { data: dbEdu, error: eduError } = await supabase
        .from('portfolio_education')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!eduError && dbEdu && dbEdu.length > 0) {
        setEducation(dbEdu.map((e: any) => ({
          id: e.id,
          degree: e.degree,
          institution: e.institution,
          university: e.university,
          year: e.year,
          score: e.score,
        })));
      }

      // 10. Certifications
      const { data: dbCert, error: certError } = await supabase
        .from('portfolio_certifications')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!certError && dbCert && dbCert.length > 0) {
        setCertifications(dbCert.map((c: any) => ({
          id: c.id,
          name: c.name,
          issuer: c.issuer,
          issueDate: c.issue_date,
          certificateUrl: c.certificate_url,
        })));
      }

      setIsSyncing(false);
      return true;
    } catch (err) {
      console.warn('Supabase fetch failed:', err);
      setIsSyncing(false);
      return false;
    }
  };

  /**
   * One-click seed function: Seeds all verified initial portfolio data into a fresh Supabase database
   */
  const seedSupabaseDatabase = async (): Promise<{ success: boolean; message: string }> => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, message: 'Supabase client is not connected.' };
    }

    try {
      setIsSyncing(true);

      // 1. Seed Hero
      await supabase.from('portfolio_hero').upsert({
        id: 'default',
        full_name: initialHeroData.fullName,
        designation: initialHeroData.designation,
        typing_words: initialHeroData.typingWords,
        bio: initialHeroData.bio,
        availability_status: initialHeroData.availabilityStatus,
        is_available: initialHeroData.isAvailable,
        years_of_experience: initialHeroData.yearsOfExperience,
        test_cases_count: initialHeroData.testCasesCount,
        releases_count: initialHeroData.releasesCount,
        tools_count: initialHeroData.toolsCount,
        primary_cta_text: initialHeroData.primaryCtaText,
        primary_cta_link: initialHeroData.primaryCtaLink,
        secondary_cta_text: initialHeroData.secondaryCtaText,
        secondary_cta_link: initialHeroData.secondaryCtaLink,
        profile_image_url: initialHeroData.profileImageUrl,
      });

      // 2. Seed Contact
      await supabase.from('portfolio_contact').upsert({
        id: 'default',
        email: initialContactInfo.email,
        phone: initialContactInfo.phone,
        linkedin_url: initialContactInfo.linkedInUrl,
        github_url: initialContactInfo.gitHubUrl,
        status_badge: initialContactInfo.statusBadge,
        role_headline: initialContactInfo.roleHeadline,
        availability_summary: initialContactInfo.availabilitySummary,
        availability_tags: initialContactInfo.availabilityTags,
      });

      // 3. Seed Projects
      for (const p of initialProjects) {
        await supabase.from('portfolio_projects').upsert({
          id: p.id,
          slug: p.slug,
          title: p.title,
          tag_label: p.tagLabel,
          category: p.category,
          color_theme: p.colorTheme,
          short_description: p.shortDescription,
          overview: p.overview,
          problem_statement: p.problemStatement,
          solution_approach: p.solutionApproach,
          tech_stack: p.techStack,
          features: p.features,
          stats: p.stats,
          workflow_steps: p.workflowSteps,
          test_scenarios: p.testScenarios,
          responsibilities: p.responsibilities,
          achievements: p.achievements,
          lessons_learned: p.lessonsLearned,
          thumbnail_url: p.thumbnailUrl,
          demo_url: p.demoUrl,
          github_url: p.githubUrl,
          has_html_report: p.hasHtmlReport,
          html_report_url: p.htmlReportUrl,
          is_featured: p.isFeatured,
          sort_order: p.sortOrder,
          is_published: p.isPublished,
        });
      }

      // 4. Seed Work Experience
      for (const exp of initialWorkExperience) {
        await supabase.from('portfolio_work_experience').upsert({
          id: exp.id,
          company_name: exp.companyName,
          designation: exp.designation,
          period: exp.period,
          start_date: exp.startDate,
          end_date: exp.endDate || null,
          is_current: exp.isCurrent,
          employment_type: exp.employmentType,
          domain: exp.domain,
          summary: exp.summary,
          responsibilities: exp.responsibilities,
          technologies: exp.technologies,
          achievements: exp.achievements || [],
          sort_order: exp.sortOrder,
          is_published: exp.isPublished,
        });
      }

      // 5. Seed Skills
      for (const s of initialSkills) {
        await supabase.from('portfolio_skills').upsert({
          id: s.id,
          name: s.name,
          category: s.category,
          proficiency: s.proficiency,
          icon: s.icon,
          sort_order: s.sortOrder,
          is_published: s.isPublished,
        });
      }

      // 6. Seed Case Study Files
      for (const f of initialCaseStudyFiles) {
        await supabase.from('portfolio_case_study_files').upsert({
          id: f.id,
          project_id: f.projectId,
          title: f.title,
          description: f.description,
          file_type: f.fileType,
          url: f.url,
          file_name: f.fileName,
          file_size: f.fileSize,
          sort_order: f.sortOrder,
        });
      }

      // 7. Seed Resume
      for (const r of initialResumes) {
        await supabase.from('portfolio_resume_versions').upsert({
          id: r.id,
          title: r.title,
          file_name: r.fileName,
          storage_path: r.storagePath,
          version: r.version,
          file_size: r.fileSize,
          is_active: r.isActive,
          notes: r.notes,
        });
      }

      await fetchFromSupabase();
      setIsSyncing(false);
      return { success: true, message: 'All portfolio tables pre-seeded successfully in Supabase!' };
    } catch (err: any) {
      setIsSyncing(false);
      return { success: false, message: err?.message || 'Failed to seed database tables.' };
    }
  };

  const persistLocalCache = (overrides?: any) => {
    const dataToSave = {
      hero: overrides?.hero ?? hero,
      workExperience: overrides?.workExperience ?? workExperience,
      milestones: overrides?.milestones ?? milestones,
      skills: overrides?.skills ?? skills,
      projects: overrides?.projects ?? projects,
      caseStudyFiles: overrides?.caseStudyFiles ?? caseStudyFiles,
      resumes: overrides?.resumes ?? resumes,
      contactInfo: overrides?.contactInfo ?? contactInfo,
      education: overrides?.education ?? education,
      certifications: overrides?.certifications ?? certifications,
      qaChecklist: overrides?.qaChecklist ?? qaChecklist,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_PORTFOLIO, JSON.stringify(dataToSave));
    }
    setLastSavedAt(new Date().toLocaleTimeString());
  };

  const [signedResumeUrl, setSignedResumeUrl] = useState<string>(
    '/assets/Lingaraj_QA_Automation_Tester_Immediate_Joiner_resume.pdf'
  );

  const activeResume = resumes.find((r) => r.isActive) || resumes[0] || null;

  useEffect(() => {
    let isMounted = true;
    const targetPath = activeResume?.storagePath || hero.secondaryCtaLink;
    if (targetPath) {
      getResumeDownloadUrl(targetPath).then((url) => {
        if (isMounted && url) {
          setSignedResumeUrl(url);
        }
      });
    } else {
      setSignedResumeUrl('/assets/Lingaraj_QA_Automation_Tester_Immediate_Joiner_resume.pdf');
    }
    return () => {
      isMounted = false;
    };
  }, [activeResume?.storagePath, hero.secondaryCtaLink]);

  const resumeDownloadUrl = signedResumeUrl;

  // MUTATION ACTIONS (PERSIST DIRECTLY TO SUPABASE)

  const updateHero = async (data: Partial<HeroData>): Promise<boolean> => {
    const updated = { ...hero, ...data };
    setHero(updated);
    persistLocalCache({ hero: updated });

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('portfolio_hero').upsert({
          id: 'default',
          full_name: updated.fullName,
          designation: updated.designation,
          typing_words: updated.typingWords,
          bio: updated.bio,
          availability_status: updated.availabilityStatus,
          is_available: updated.isAvailable,
          years_of_experience: updated.yearsOfExperience,
          test_cases_count: updated.testCasesCount,
          releases_count: updated.releasesCount,
          tools_count: updated.toolsCount,
          primary_cta_text: updated.primaryCtaText,
          primary_cta_link: updated.primaryCtaLink,
          secondary_cta_text: updated.secondaryCtaText,
          secondary_cta_link: updated.secondaryCtaLink,
          profile_image_url: updated.profileImageUrl,
          updated_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Supabase hero upsert error:', e);
      }
    }
    return true;
  };

  const updateContactInfo = async (data: Partial<ContactInfo>): Promise<boolean> => {
    const updated = { ...contactInfo, ...data };
    setContactInfo(updated);
    persistLocalCache({ contactInfo: updated });

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('portfolio_contact').upsert({
          id: 'default',
          email: updated.email,
          phone: updated.phone,
          linkedin_url: updated.linkedInUrl,
          github_url: updated.gitHubUrl,
          status_badge: updated.statusBadge,
          role_headline: updated.roleHeadline,
          availability_summary: updated.availabilitySummary,
          availability_tags: updated.availabilityTags,
          updated_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Supabase contact upsert error:', e);
      }
    }
    return true;
  };

  // Work Experience
  const addWorkExperience = async (exp: WorkExperience | Omit<WorkExperience, 'id'>): Promise<boolean> => {
    const newId = (exp as WorkExperience).id || 'exp-' + Date.now();
    const newRecord: WorkExperience = { ...exp, id: newId };
    const updated = [newRecord, ...workExperience];
    setWorkExperience(updated);
    persistLocalCache({ workExperience: updated });

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('portfolio_work_experience').insert({
          id: newId,
          company_name: exp.companyName,
          designation: exp.designation,
          period: exp.period,
          start_date: exp.startDate || '2025-01-01',
          end_date: exp.endDate || null,
          is_current: exp.isCurrent,
          employment_type: exp.employmentType,
          domain: exp.domain,
          summary: exp.summary,
          responsibilities: exp.responsibilities,
          technologies: exp.technologies,
          achievements: exp.achievements || [],
          sort_order: exp.sortOrder,
          is_published: exp.isPublished,
        });
      } catch (e) {
        console.warn('Supabase add experience error:', e);
      }
    }
    return true;
  };

  const updateWorkExperience = async (
    idOrExp: string | WorkExperience,
    patch?: Partial<WorkExperience>
  ): Promise<boolean> => {
    const id = typeof idOrExp === 'string' ? idOrExp : idOrExp.id;
    const patchData = typeof idOrExp === 'string' ? patch || {} : idOrExp;

    const updated = workExperience.map((item) => (item.id === id ? { ...item, ...patchData } : item));
    setWorkExperience(updated);
    persistLocalCache({ workExperience: updated });

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const p: any = { updated_at: new Date().toISOString() };
        if (patchData.companyName !== undefined) p.company_name = patchData.companyName;
        if (patchData.designation !== undefined) p.designation = patchData.designation;
        if (patchData.period !== undefined) p.period = patchData.period;
        if (patchData.startDate !== undefined) p.start_date = patchData.startDate;
        if (patchData.endDate !== undefined) p.end_date = patchData.endDate;
        if (patchData.isCurrent !== undefined) p.is_current = patchData.isCurrent;
        if (patchData.employmentType !== undefined) p.employment_type = patchData.employmentType;
        if (patchData.domain !== undefined) p.domain = patchData.domain;
        if (patchData.summary !== undefined) p.summary = patchData.summary;
        if (patchData.responsibilities !== undefined) p.responsibilities = patchData.responsibilities;
        if (patchData.technologies !== undefined) p.technologies = patchData.technologies;
        if (patchData.achievements !== undefined) p.achievements = patchData.achievements;
        if (patchData.sortOrder !== undefined) p.sort_order = patchData.sortOrder;
        if (patchData.isPublished !== undefined) p.is_published = patchData.isPublished;

        await supabase.from('portfolio_work_experience').update(p).eq('id', id);
      } catch (e) {
        console.warn('Supabase update experience error:', e);
      }
    }
    return true;
  };

  const deleteWorkExperience = async (id: string): Promise<boolean> => {
    const updated = workExperience.filter((item) => item.id !== id);
    setWorkExperience(updated);
    persistLocalCache({ workExperience: updated });

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('portfolio_work_experience').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete experience error:', e);
      }
    }
    return true;
  };

  const toggleExperiencePublish = async (id: string): Promise<boolean> => {
    const target = workExperience.find((item) => item.id === id);
    if (!target) return false;
    return updateWorkExperience(id, { isPublished: !target.isPublished });
  };

  // Milestones
  const addMilestone = async (milestone: Omit<JourneyMilestone, 'id'>): Promise<boolean> => {
    const newId = 'm-' + Date.now();
    const updated = [...milestones, { ...milestone, id: newId }];
    setMilestones(updated);
    persistLocalCache({ milestones: updated });

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('portfolio_journey_milestones').insert({
          id: newId,
          year: milestone.year,
          title: milestone.title,
          description: milestone.description,
          is_current: Boolean(milestone.isCurrent),
          sort_order: milestones.length + 1,
        });
      } catch (e) {
        console.warn('Supabase add milestone error:', e);
      }
    }
    return true;
  };

  const updateMilestone = async (id: string, milestone: Partial<JourneyMilestone>): Promise<boolean> => {
    const updated = milestones.map((m) => (m.id === id ? { ...m, ...milestone } : m));
    setMilestones(updated);
    persistLocalCache({ milestones: updated });

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('portfolio_journey_milestones').update(milestone).eq('id', id);
      } catch (e) {
        console.warn('Supabase update milestone error:', e);
      }
    }
    return true;
  };

  const deleteMilestone = async (id: string): Promise<boolean> => {
    const updated = milestones.filter((m) => m.id !== id);
    setMilestones(updated);
    persistLocalCache({ milestones: updated });

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('portfolio_journey_milestones').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete milestone error:', e);
      }
    }
    return true;
  };

  // Skills
  const addSkill = async (skill: SkillItem | Omit<SkillItem, 'id'>): Promise<boolean> => {
    const newId = (skill as SkillItem).id || 's-' + Date.now();
    const newRecord: SkillItem = { ...skill, id: newId };
    const updated = [...skills, newRecord];
    setSkills(updated);
    persistLocalCache({ skills: updated });

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('portfolio_skills').insert({
          id: newId,
          name: skill.name,
          category: skill.category,
          proficiency: skill.proficiency,
          icon: skill.icon,
          sort_order: skill.sortOrder,
          is_published: skill.isPublished,
        });
      } catch (e) {
        console.warn('Supabase add skill error:', e);
      }
    }
    return true;
  };

  const updateSkill = async (idOrSkill: string | SkillItem, patch?: Partial<SkillItem>): Promise<boolean> => {
    const id = typeof idOrSkill === 'string' ? idOrSkill : idOrSkill.id;
    const patchData = typeof idOrSkill === 'string' ? patch || {} : idOrSkill;

    const updated = skills.map((item) => (item.id === id ? { ...item, ...patchData } : item));
    setSkills(updated);
    persistLocalCache({ skills: updated });

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('portfolio_skills').update(patchData).eq('id', id);
      } catch (e) {
        console.warn('Supabase update skill error:', e);
      }
    }
    return true;
  };

  const deleteSkill = async (id: string): Promise<boolean> => {
    const updated = skills.filter((item) => item.id !== id);
    setSkills(updated);
    persistLocalCache({ skills: updated });

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('portfolio_skills').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete skill error:', e);
      }
    }
    return true;
  };

  // Projects
  const addProject = async (proj: ProjectItem | Omit<ProjectItem, 'id'>): Promise<boolean> => {
    const newId = (proj as ProjectItem).id || 'proj-' + Date.now();
    const newRecord: ProjectItem = { ...proj, id: newId };
    const updated = [newRecord, ...projects];
    setProjects(updated);
    persistLocalCache({ projects: updated });

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('portfolio_projects').insert({
          id: newId,
          slug: proj.slug,
          title: proj.title,
          tag_label: proj.tagLabel,
          category: proj.category,
          color_theme: proj.colorTheme,
          short_description: proj.shortDescription,
          overview: proj.overview,
          problem_statement: proj.problemStatement,
          solution_approach: proj.solutionApproach,
          tech_stack: proj.techStack,
          features: proj.features,
          stats: proj.stats,
          workflow_steps: proj.workflowSteps,
          test_scenarios: proj.testScenarios,
          responsibilities: proj.responsibilities,
          achievements: proj.achievements,
          lessons_learned: proj.lessonsLearned,
          thumbnail_url: proj.thumbnailUrl,
          demo_url: proj.demoUrl,
          github_url: proj.githubUrl,
          has_html_report: proj.hasHtmlReport,
          html_report_url: proj.htmlReportUrl,
          is_featured: proj.isFeatured,
          sort_order: proj.sortOrder,
          is_published: proj.isPublished,
        });
      } catch (e) {
        console.warn('Supabase add project error:', e);
      }
    }
    return true;
  };

  const updateProject = async (idOrProj: string | ProjectItem, patch?: Partial<ProjectItem>): Promise<boolean> => {
    const id = typeof idOrProj === 'string' ? idOrProj : idOrProj.id;
    const patchData = typeof idOrProj === 'string' ? patch || {} : idOrProj;

    const updated = projects.map((item) => (item.id === id ? { ...item, ...patchData } : item));
    setProjects(updated);
    persistLocalCache({ projects: updated });

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const dbPatch: any = { updated_at: new Date().toISOString() };
        if (patchData.title !== undefined) dbPatch.title = patchData.title;
        if (patchData.slug !== undefined) dbPatch.slug = patchData.slug;
        if (patchData.tagLabel !== undefined) dbPatch.tag_label = patchData.tagLabel;
        if (patchData.category !== undefined) dbPatch.category = patchData.category;
        if (patchData.colorTheme !== undefined) dbPatch.color_theme = patchData.colorTheme;
        if (patchData.shortDescription !== undefined) dbPatch.short_description = patchData.shortDescription;
        if (patchData.overview !== undefined) dbPatch.overview = patchData.overview;
        if (patchData.problemStatement !== undefined) dbPatch.problem_statement = patchData.problemStatement;
        if (patchData.solutionApproach !== undefined) dbPatch.solution_approach = patchData.solutionApproach;
        if (patchData.techStack !== undefined) dbPatch.tech_stack = patchData.techStack;
        if (patchData.features !== undefined) dbPatch.features = patchData.features;
        if (patchData.stats !== undefined) dbPatch.stats = patchData.stats;
        if (patchData.workflowSteps !== undefined) dbPatch.workflow_steps = patchData.workflowSteps;
        if (patchData.testScenarios !== undefined) dbPatch.test_scenarios = patchData.testScenarios;
        if (patchData.responsibilities !== undefined) dbPatch.responsibilities = patchData.responsibilities;
        if (patchData.achievements !== undefined) dbPatch.achievements = patchData.achievements;
        if (patchData.lessonsLearned !== undefined) dbPatch.lessons_learned = patchData.lessonsLearned;
        if (patchData.thumbnailUrl !== undefined) dbPatch.thumbnail_url = patchData.thumbnailUrl;
        if (patchData.demoUrl !== undefined) dbPatch.demo_url = patchData.demoUrl;
        if (patchData.githubUrl !== undefined) dbPatch.github_url = patchData.githubUrl;
        if (patchData.hasHtmlReport !== undefined) dbPatch.has_html_report = patchData.hasHtmlReport;
        if (patchData.htmlReportUrl !== undefined) dbPatch.html_report_url = patchData.htmlReportUrl;
        if (patchData.isFeatured !== undefined) dbPatch.is_featured = patchData.isFeatured;
        if (patchData.sortOrder !== undefined) dbPatch.sort_order = patchData.sortOrder;
        if (patchData.isPublished !== undefined) dbPatch.is_published = patchData.isPublished;

        await supabase.from('portfolio_projects').update(dbPatch).eq('id', id);
      } catch (e) {
        console.warn('Supabase update project error:', e);
      }
    }
    return true;
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    const updated = projects.filter((item) => item.id !== id);
    setProjects(updated);
    const updatedFiles = caseStudyFiles.filter((f) => f.projectId !== id);
    setCaseStudyFiles(updatedFiles);
    persistLocalCache({ projects: updated, caseStudyFiles: updatedFiles });

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('portfolio_projects').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete project error:', e);
      }
    }
    return true;
  };

  const toggleProjectPublish = async (id: string): Promise<boolean> => {
    const target = projects.find((item) => item.id === id);
    if (!target) return false;
    return updateProject(id, { isPublished: !target.isPublished });
  };

  // Case Study Files
  const addCaseStudyFile = async (file: CaseStudyFile | Omit<CaseStudyFile, 'id'>): Promise<boolean> => {
    const newId = (file as CaseStudyFile).id || 'file-' + Date.now();
    const updated = [...caseStudyFiles, { ...file, id: newId }];
    setCaseStudyFiles(updated);
    persistLocalCache({ caseStudyFiles: updated });

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('portfolio_case_study_files').insert({
          id: newId,
          project_id: file.projectId,
          title: file.title,
          description: file.description,
          file_type: file.fileType,
          url: file.url,
          file_name: file.fileName,
          file_size: file.fileSize,
          sort_order: file.sortOrder,
        });
      } catch (e) {
        console.warn('Supabase add file error:', e);
      }
    }
    return true;
  };

  const deleteCaseStudyFile = async (id: string): Promise<boolean> => {
    const updated = caseStudyFiles.filter((item) => item.id !== id);
    setCaseStudyFiles(updated);
    persistLocalCache({ caseStudyFiles: updated });

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('portfolio_case_study_files').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete file error:', e);
      }
    }
    return true;
  };

  const updateCaseStudyFile = async (id: string, data: Partial<CaseStudyFile>): Promise<boolean> => {
    const updated = caseStudyFiles.map((f) => (f.id === id ? { ...f, ...data } : f));
    setCaseStudyFiles(updated);
    persistLocalCache({ caseStudyFiles: updated });
    return true;
  };

  /**
   * Centralized Single Resume Replacement Workflow:
   * 1. Uploads new PDF to private 'portfolio-resumes' Supabase Storage bucket.
   * 2. Verifies upload integrity.
   * 3. Inserts new record into 'portfolio_resume_versions' and marks is_active = true.
   * 4. Deletes previous resume file from Supabase Storage.
   * 5. Deletes previous resume record from database.
   * 6. Retains strictly ONE active resume across portfolio.
   * 7. Preserves previous resume untouched if new upload fails.
   */
  /**
   * Safe Centralized Single Resume Replacement Workflow:
   * 1. Validate and upload the new PDF to private 'portfolio-resumes' bucket.
   * 2. Verify the uploaded file (via signed URL test).
   * 3. Activate and verify the new database record (using atomic replace_active_resume RPC or transactional sequence).
   * 4. Confirm exactly one active resume exists in the database.
   * 5. Only then delete the old Storage file and previous database records.
   * 6. If any step fails, preserve the existing working resume, rollback uncommitted files, and report cleanup failures clearly.
   * 7. Refresh UI state ONLY after successful database confirmation.
   */
  const replaceActiveResume = async (
    file: File,
    title?: string,
    notes?: string
  ): Promise<{ success: boolean; error?: string; oldFileDeleted?: boolean }> => {
    const supabase = getSupabaseClient();
    const oldResume = resumes.find((r) => r.isActive) || resumes[0];
    const oldStoragePath = oldResume?.storagePath;
    const oldId = oldResume?.id;

    // STEP 1 & 2: Validate, upload, and verify new PDF file in Storage (old file remains untouched!)
    let storageResult;
    if (supabase) {
      storageResult = await uploadAndVerifyResume(file);
      if (!storageResult.success || !storageResult.storagePath) {
        return {
          success: false,
          error: storageResult.error || 'Failed to upload and verify new resume in storage. Existing resume preserved.',
        };
      }
    }

    const newId = `res-${Date.now()}`;
    const newStoragePath = storageResult?.storagePath || `resumes/${Date.now()}_${file.name}`;
    const newFileName = file.name;
    const newFileSize = storageResult?.fileSize || `${Math.round(file.size / 1024)} KB`;
    const newTitle = title?.trim() || 'Lingaraj QA Automation Tester Resume';

    const newRecord: ResumeVersion = {
      id: newId,
      title: newTitle,
      fileName: newFileName,
      storagePath: newStoragePath,
      version: 'v1.0 (Active)',
      fileSize: newFileSize,
      isActive: true,
      uploadedAt: new Date().toISOString(),
      notes: notes?.trim() || 'Active QA Automation Resume',
    };

    let oldStoragePathsToPurge: string[] = [];

    // STEP 3: Activate and verify new database record with concurrency locking
    if (supabase) {
      try {
        // Try atomic PostgreSQL function with table EXCLUSIVE lock
        const { data: rpcData, error: rpcError } = await supabase.rpc('replace_active_resume', {
          p_id: newRecord.id,
          p_title: newRecord.title,
          p_file_name: newRecord.fileName,
          p_storage_path: newRecord.storagePath,
          p_version: newRecord.version,
          p_file_size: newRecord.fileSize,
          p_notes: newRecord.notes,
        });

        if (rpcError) {
          // Fallback if RPC is not yet deployed: execute safe client sequence
          console.warn('RPC replace_active_resume fallback:', rpcError.message);

          // 3a. Deactivate existing active records
          const { error: deactivateError } = await supabase
            .from('portfolio_resume_versions')
            .update({ is_active: false })
            .eq('is_active', true);

          if (deactivateError) {
            await rollbackUploadedResumeFile(newStoragePath);
            return {
              success: false,
              error: `Database deactivation failed: ${deactivateError.message}. Existing resume preserved.`,
            };
          }

          // 3b. Insert new active resume record
          const { error: insertError } = await supabase.from('portfolio_resume_versions').insert({
            id: newRecord.id,
            title: newRecord.title,
            file_name: newRecord.fileName,
            storage_path: newRecord.storagePath,
            version: newRecord.version,
            file_size: newRecord.fileSize,
            is_active: true,
            notes: newRecord.notes,
            uploaded_at: newRecord.uploadedAt,
          });

          if (insertError) {
            // Rollback uploaded file and restore previous active state
            await rollbackUploadedResumeFile(newStoragePath);
            if (oldId) {
              await supabase.from('portfolio_resume_versions').update({ is_active: true }).eq('id', oldId);
            }
            return {
              success: false,
              error: `Database insert failed: ${insertError.message}. Existing resume preserved.`,
            };
          }
        } else if (rpcData?.old_storage_paths) {
          oldStoragePathsToPurge = rpcData.old_storage_paths;
        }

        // STEP 4: Confirm exactly one active resume exists in the database
        const { data: activeResumes, error: verifyError } = await supabase
          .from('portfolio_resume_versions')
          .select('id, storage_path, is_active')
          .eq('is_active', true);

        if (verifyError || !activeResumes || activeResumes.length !== 1 || activeResumes[0].id !== newRecord.id) {
          await rollbackUploadedResumeFile(newStoragePath);
          return {
            success: false,
            error: `Integrity check failed: Expected 1 active resume, found ${activeResumes?.length || 0}. Existing resume preserved.`,
          };
        }

        // STEP 5: Database confirmation complete. Update hero link and purge old DB records
        const { error: heroError } = await supabase
          .from('portfolio_hero')
          .update({
            secondary_cta_link: newStoragePath,
            updated_at: new Date().toISOString(),
          })
          .eq('id', 'default');

        if (heroError) {
          console.warn('Hero secondary CTA update warning:', heroError.message);
        }

        // Delete all older database records to maintain zero accumulation
        const { error: deleteOldDbError } = await supabase
          .from('portfolio_resume_versions')
          .delete()
          .neq('id', newRecord.id);

        if (deleteOldDbError) {
          console.warn('Older resume DB records cleanup warning:', deleteOldDbError.message);
        }

      } catch (dbErr: any) {
        await rollbackUploadedResumeFile(newStoragePath);
        return {
          success: false,
          error: `Database transaction error: ${dbErr?.message || 'Unknown database error'}. Existing resume preserved.`,
        };
      }
    }

    // STEP 6: Delete the old Storage file only AFTER database record is active and verified
    let oldFileDeleted = true;
    if (supabase) {
      const pathsToDelete = new Set<string>();
      if (oldStoragePath && oldStoragePath !== newStoragePath && !oldStoragePath.startsWith('/assets/')) {
        pathsToDelete.add(oldStoragePath);
      }
      for (const p of oldStoragePathsToPurge) {
        if (p && p !== newStoragePath && !p.startsWith('/assets/')) {
          pathsToDelete.add(p);
        }
      }

      for (const path of pathsToDelete) {
        const deleted = await deleteOldResumeStorageFile(path);
        if (!deleted) {
          oldFileDeleted = false;
        }
      }
    }

    // STEP 7: Update UI state ONLY after successful database operations
    const updatedResumes = [newRecord];
    setResumes(updatedResumes);
    setHero((prev) => ({ ...prev, secondaryCtaLink: newStoragePath }));

    persistLocalCache({
      resumes: updatedResumes,
      hero: { ...hero, secondaryCtaLink: newStoragePath },
    });

    if (storageResult?.url) {
      setSignedResumeUrl(storageResult.url);
    }

    return {
      success: true,
      oldFileDeleted,
    };
  };

  /**
   * Centralized resume download function: All public and admin buttons use this single resolver.
   */
  const downloadActiveResume = async (): Promise<void> => {
    const path = activeResume?.storagePath || hero.secondaryCtaLink;
    const fileName = activeResume?.fileName || 'Lingaraj_Belagali_Resume_QA_Immediate_Joiner.pdf';
    await triggerResumeDownload(path, fileName);
  };

  // Resumes (Backwards compatible helper methods)
  const addResumeVersion = async (resume: ResumeVersion | Omit<ResumeVersion, 'id'>): Promise<boolean> => {
    const newId = (resume as ResumeVersion).id || 'res-' + Date.now();
    let updatedResumes = resumes.map((r) => (resume.isActive ? { ...r, isActive: false } : r));
    const newRecord: ResumeVersion = { ...resume, id: newId };
    updatedResumes = [newRecord, ...updatedResumes];

    setResumes(updatedResumes);
    persistLocalCache({ resumes: updatedResumes });

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        if (resume.isActive) {
          await supabase.from('portfolio_resume_versions').update({ is_active: false }).neq('id', newId);
        }
        await supabase.from('portfolio_resume_versions').insert({
          id: newId,
          title: resume.title,
          file_name: resume.fileName,
          storage_path: resume.storagePath,
          version: resume.version,
          file_size: resume.fileSize,
          is_active: resume.isActive,
          notes: resume.notes,
        });
      } catch (e) {
        console.warn('Supabase add resume error:', e);
      }
    }
    return true;
  };

  const activateResumeVersion = async (id: string): Promise<boolean> => {
    const updated = resumes.map((r) => ({
      ...r,
      isActive: r.id === id,
    }));
    setResumes(updated);

    const target = resumes.find((r) => r.id === id);
    if (target) {
      setHero((prev) => ({ ...prev, secondaryCtaLink: target.storagePath }));
    }

    persistLocalCache({
      resumes: updated,
      hero: target ? { ...hero, secondaryCtaLink: target.storagePath } : hero,
    });

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('portfolio_resume_versions').update({ is_active: false }).neq('id', id);
        await supabase.from('portfolio_resume_versions').update({ is_active: true }).eq('id', id);
      } catch (e) {
        console.warn('Supabase activate resume error:', e);
      }
    }
    return true;
  };

  const deleteResumeVersion = async (id: string): Promise<boolean> => {
    const remaining = resumes.filter((r) => r.id !== id);
    if (remaining.length > 0 && !remaining.some((r) => r.isActive)) {
      remaining[0].isActive = true;
      setHero((prev) => ({ ...prev, secondaryCtaLink: remaining[0].storagePath }));
    }
    setResumes(remaining);
    persistLocalCache({ resumes: remaining });

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('portfolio_resume_versions').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete resume error:', e);
      }
    }
    return true;
  };

  const toggleChecklistItem = (id: string) => {
    const updated = qaChecklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setQaChecklist(updated);
    persistLocalCache({ qaChecklist: updated });
  };

  const resetToDefaults = () => {
    setHero(initialHeroData);
    setWorkExperience(initialWorkExperience);
    setMilestones(initialMilestones);
    setSkills(initialSkills);
    setProjects(initialProjects);
    setCaseStudyFiles(initialCaseStudyFiles);
    setResumes(initialResumes);
    setContactInfo(initialContactInfo);
    setEducation(initialEducation);
    setCertifications(initialCertifications);
    setQaChecklist(initialQAChecklist);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_PORTFOLIO);
    }
  };

  const syncWithSupabase = async (): Promise<boolean> => {
    return await fetchFromSupabase();
  };

  return (
    <PortfolioContext.Provider
      value={{
        hero,
        workExperience,
        milestones,
        journeyMilestones: milestones,
        skills,
        projects,
        caseStudyFiles,
        resumes,
        resumeVersions: resumes,
        contactInfo,
        education,
        certifications,
        qaChecklist,
        activeResume,
        resumeDownloadUrl,
        isSupabaseConnected,
        isSupabaseConfigured: isSupabaseConnected,
        isLoading,
        isSyncing,
        syncStatus: isSupabaseConnected ? 'synced' : 'local',
        lastSavedAt,
        setSupabaseConfigured: (val: boolean) => setIsSupabaseConnected(val),
        refreshFromDatabase: fetchFromSupabase,
        seedSupabaseDatabase,
        updateHero,
        updateContactInfo,
        addExperience: addWorkExperience,
        addWorkExperience,
        updateExperience: updateWorkExperience,
        updateWorkExperience,
        deleteExperience: deleteWorkExperience,
        deleteWorkExperience,
        toggleExperiencePublish,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        addSkill,
        updateSkill,
        deleteSkill,
        addProject,
        updateProject,
        deleteProject,
        toggleProjectPublish,
        addCaseStudyFile,
        deleteCaseStudyFile,
        updateCaseStudyFile,
        replaceActiveResume,
        downloadActiveResume,
        addResumeVersion,
        activateResumeVersion,
        setActiveResumeVersion: activateResumeVersion,
        deleteResumeVersion,
        toggleChecklistItem,
        resetToDefaults,
        syncWithSupabase,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
