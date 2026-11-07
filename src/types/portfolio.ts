export interface HeroData {
  fullName: string;
  designation: string;
  typingWords: string[];
  bio: string;
  availabilityStatus: string;
  isAvailable: boolean;
  yearsOfExperience: number;
  testCasesCount: number;
  releasesCount: number;
  toolsCount: number;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  profileImageUrl: string;
  floatingBadges: Array<{ id: string; name: string; icon: string }>;
}

export interface JourneyMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
  isCurrent?: boolean;
}

export interface WorkExperience {
  id: string;
  companyName: string;
  designation: string;
  period: string; // e.g. "2022 - 2025" or "2025 - Present"
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  employmentType: 'Full-time' | 'Contract' | 'Part-time' | 'Internship';
  domain: string; // e.g. "Capital Markets" or "AI Platforms"
  summary: string;
  responsibilities: string[];
  technologies: string[];
  achievements?: string[];
  sortOrder: number;
  isPublished: boolean;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Testing' | 'Automation' | 'Database' | 'Process' | 'Tools';
  proficiency: number; // 0 - 100
  icon: string;
  sortOrder: number;
  isPublished: boolean;
}

export interface CaseStudyWorkflowStep {
  stepNumber: number;
  title: string;
  description: string;
  icon: string;
}

export interface TestCaseScenario {
  id: string;
  title: string;
  description: string;
  type: string;
  status?: 'Passed' | 'Automated' | 'In Progress';
}

export interface CaseStudyFile {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  fileType: 'image' | 'video' | 'document' | 'report';
  url: string;
  fileName: string;
  fileSize?: string;
  uploadedAt: string;
  sortOrder: number;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  tagLabel: string;
  category: 'Automation' | 'API' | 'Enterprise' | 'AI Platform' | 'Personal';
  colorTheme: 'blue' | 'green' | 'purple' | 'orange';
  shortDescription: string;
  overview: string;
  problemStatement?: string;
  solutionApproach?: string;
  techStack: string[];
  features: string[];
  stats: Array<{ label: string; value: string }>;
  workflowSteps: CaseStudyWorkflowStep[];
  testScenarios: TestCaseScenario[];
  responsibilities: Array<{ title: string; description: string; icon: string }>;
  achievements: Array<{ title: string; description: string }>;
  lessonsLearned: string[];
  thumbnailUrl: string;
  demoUrl?: string;
  githubUrl?: string;
  hasHtmlReport?: boolean;
  htmlReportUrl?: string;
  isFeatured: boolean;
  sortOrder: number;
  isPublished: boolean;
}

export interface ResumeVersion {
  id: string;
  title: string;
  fileName: string;
  storagePath: string;
  version: string;
  fileSize: string;
  isActive: boolean;
  uploadedAt: string;
  notes?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  linkedInUrl: string;
  gitHubUrl: string;
  statusBadge: string;
  roleHeadline: string;
  availabilitySummary: string;
  availabilityTags: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  university?: string;
  year: string;
  score?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  certificateUrl?: string;
  credentialId?: string;
}

export interface QAChecklistItem {
  id: string;
  category: string;
  task: string;
  completed: boolean;
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type UserRole = 'admin' | 'viewer' | 'member';

export interface UserRegistration {
  id: string;
  userId?: string;
  email: string;
  fullName: string;
  status: ApprovalStatus;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

