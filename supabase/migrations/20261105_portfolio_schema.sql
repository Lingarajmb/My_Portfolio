-- ==============================================================================
-- LINGARAJ QA AUTOMATION PORTFOLIO - PRODUCTION SUPABASE DATABASE SCHEMA (v2.0)
-- Target Project: gazndzdqljivpdsobrnq (https://gazndzdqljivpdsobrnq.supabase.co)
-- Authorized Admin: lingarajmb1997@gmail.com
-- Single Source of Truth: Lingaraj_Belagali_Resume(3).pdf
-- Audit Status: Second-Pass Hardened Security, RLS, Storage & Data Integrity
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ADMIN WHITELIST TABLE
CREATE TABLE IF NOT EXISTS public.admin_whitelist (
  email TEXT PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'admin',
  full_name TEXT DEFAULT 'Lingaraj Belagali',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Pre-seed authorized admin email safely
INSERT INTO public.admin_whitelist (email, role, full_name)
VALUES ('lingarajmb1997@gmail.com', 'admin', 'Lingaraj Belagali')
ON CONFLICT (email) DO NOTHING;

-- 3. HARDENED ADMIN CHECK HELPER FUNCTION
-- Security hardening: Fixed search_path prevents search_path hijacking vulnerabilities (CWE-426).
-- STABLE volatility allows PostgreSQL query planner optimizations.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
DECLARE
  current_user_email TEXT;
BEGIN
  current_user_email := auth.jwt() ->> 'email';
  IF current_user_email IS NULL THEN
    RETURN FALSE;
  END IF;

  IF current_user_email = 'lingarajmb1997@gmail.com' THEN
    RETURN TRUE;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.admin_whitelist
    WHERE email = current_user_email
  );
END;
$$;

-- Restrict function execution permissions
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- 4. HERO & PROFILE TABLE
CREATE TABLE IF NOT EXISTS public.portfolio_hero (
  id TEXT PRIMARY KEY DEFAULT 'default',
  full_name TEXT NOT NULL DEFAULT 'Lingaraj Belagali',
  designation TEXT NOT NULL DEFAULT 'Software Tester II',
  typing_words JSONB NOT NULL DEFAULT '["Quality Assurance Engineer", "Manual Testing Expert", "API Testing Specialist", "Playwright Automation", "SQL & MongoDB Validation"]'::jsonb,
  bio TEXT NOT NULL DEFAULT 'Passionate QA Engineer with 3.8+ years of experience delivering high-quality enterprise software through Manual Testing, API Validation, Playwright Automation, SQL Verification, and Agile collaboration.',
  availability_status TEXT NOT NULL DEFAULT 'Immediate Joiner',
  is_available BOOLEAN NOT NULL DEFAULT true,
  years_of_experience NUMERIC(3,1) NOT NULL DEFAULT 3.8,
  test_cases_count INTEGER NOT NULL DEFAULT 500,
  releases_count INTEGER NOT NULL DEFAULT 25,
  tools_count INTEGER NOT NULL DEFAULT 12,
  primary_cta_text TEXT DEFAULT 'Explore My Work',
  primary_cta_link TEXT DEFAULT '#projects',
  secondary_cta_text TEXT DEFAULT 'Download Resume',
  secondary_cta_link TEXT DEFAULT 'resumes/Lingaraj_Belagali_Resume_QA_Immediate_Joiner.pdf',
  profile_image_url TEXT DEFAULT '/assets/profile.png',
  floating_badges JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. WORK EXPERIENCE TABLE (Spire.ai and Tata Consultancy Services)
CREATE TABLE IF NOT EXISTS public.portfolio_work_experience (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  designation TEXT NOT NULL,
  period TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  is_current BOOLEAN NOT NULL DEFAULT false,
  employment_type TEXT NOT NULL DEFAULT 'Full-time',
  domain TEXT DEFAULT 'Capital Markets',
  summary TEXT NOT NULL,
  responsibilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 1,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. TECHNICAL SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.portfolio_skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Automation', -- Automation, Testing, Database, Process, Tools
  proficiency INTEGER NOT NULL CHECK (proficiency >= 0 AND proficiency <= 100),
  icon TEXT DEFAULT 'playwright',
  sort_order INTEGER NOT NULL DEFAULT 1,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. PROJECTS & CASE STUDIES TABLE
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tag_label TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Automation', -- Automation, API, Enterprise, AI Platform, Personal
  color_theme TEXT NOT NULL DEFAULT 'blue',
  short_description TEXT NOT NULL,
  overview TEXT,
  problem_statement TEXT,
  solution_approach TEXT,
  tech_stack JSONB NOT NULL DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  stats JSONB DEFAULT '[]'::jsonb,
  workflow_steps JSONB DEFAULT '[]'::jsonb,
  test_scenarios JSONB DEFAULT '[]'::jsonb,
  responsibilities JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  lessons_learned JSONB DEFAULT '[]'::jsonb,
  thumbnail_url TEXT NOT NULL,
  demo_url TEXT,
  github_url TEXT,
  has_html_report BOOLEAN DEFAULT false,
  html_report_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 1,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. CASE STUDY SCREENSHOTS & ATTACHMENTS
CREATE TABLE IF NOT EXISTS public.portfolio_case_study_files (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_type TEXT NOT NULL DEFAULT 'image', -- image, video, document, report
  url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size TEXT,
  sort_order INTEGER NOT NULL DEFAULT 1,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. INDEPENDENT RESUME VERSIONS
CREATE TABLE IF NOT EXISTS public.portfolio_resume_versions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT 'v1.0',
  file_size TEXT DEFAULT '420 KB',
  is_active BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- PARTIAL UNIQUE INDEX: Strictly enforces that only ONE resume version can be active at any time
CREATE UNIQUE INDEX IF NOT EXISTS idx_only_one_active_resume
ON public.portfolio_resume_versions (is_active)
WHERE (is_active = true);

-- AUTOMATIC SINGLE ACTIVE RESUME TRIGGER:
-- Automatically resets previous active resume when a new resume is marked active
CREATE OR REPLACE FUNCTION public.handle_single_active_resume()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE public.portfolio_resume_versions
    SET is_active = false
    WHERE id <> NEW.id AND is_active = true;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_single_active_resume ON public.portfolio_resume_versions;
CREATE TRIGGER trg_single_active_resume
BEFORE INSERT OR UPDATE OF is_active ON public.portfolio_resume_versions
FOR EACH ROW
WHEN (NEW.is_active = true)
EXECUTE FUNCTION public.handle_single_active_resume();

-- ATOMIC CONCURRENCY-PROTECTED RESUME REPLACEMENT FUNCTION
-- Acquires an exclusive table lock to eliminate concurrent race conditions,
-- guarantees that exactly one active resume exists, deletes old records,
-- updates hero CTA, and returns old storage paths for client cleanup.
DROP FUNCTION IF EXISTS public.replace_active_resume(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT);
CREATE OR REPLACE FUNCTION public.replace_active_resume(
  p_id TEXT,
  p_title TEXT,
  p_file_name TEXT,
  p_storage_path TEXT,
  p_version TEXT DEFAULT 'v1.0 (Active)',
  p_file_size TEXT DEFAULT '420 KB',
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_old_paths TEXT[];
  v_active_count INTEGER;
BEGIN
  -- Strict Administrator Authorization check
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.';
  END IF;

  -- Transaction-level EXCLUSIVE lock on resume table to prevent concurrent race conditions
  LOCK TABLE public.portfolio_resume_versions IN EXCLUSIVE MODE;

  -- Collect old storage paths before record removal so client can purge them from storage
  SELECT COALESCE(array_agg(storage_path), ARRAY[]::TEXT[]) INTO v_old_paths
  FROM public.portfolio_resume_versions
  WHERE id <> p_id;

  -- Deactivate existing active resume(s)
  UPDATE public.portfolio_resume_versions
  SET is_active = false
  WHERE is_active = true;

  -- Insert the new active resume version
  INSERT INTO public.portfolio_resume_versions (
    id, title, file_name, storage_path, version, file_size, is_active, notes, uploaded_at
  ) VALUES (
    p_id, p_title, p_file_name, p_storage_path, p_version, p_file_size, true, p_notes, timezone('utc'::text, now())
  );

  -- Assert invariant: exactly one active resume must exist
  SELECT count(*) INTO v_active_count
  FROM public.portfolio_resume_versions
  WHERE is_active = true;

  IF v_active_count <> 1 THEN
    RAISE EXCEPTION 'Invariant violation: expected exactly 1 active resume, found %', v_active_count;
  END IF;

  -- Delete older records to maintain zero accumulation
  DELETE FROM public.portfolio_resume_versions
  WHERE id <> p_id;

  -- Update hero secondary CTA link
  UPDATE public.portfolio_hero
  SET secondary_cta_link = p_storage_path,
      updated_at = timezone('utc'::text, now())
  WHERE id = 'default';

  RETURN jsonb_build_object(
    'success', true,
    'id', p_id,
    'storage_path', p_storage_path,
    'old_storage_paths', v_old_paths,
    'active_count', v_active_count
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.replace_active_resume(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.replace_active_resume(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- 10. CONTACT & AVAILABILITY
CREATE TABLE IF NOT EXISTS public.portfolio_contact (
  id TEXT PRIMARY KEY DEFAULT 'default',
  email TEXT NOT NULL DEFAULT 'lingarajmb1997@gmail.com',
  phone TEXT NOT NULL DEFAULT '+91 8050478051',
  linkedin_url TEXT NOT NULL DEFAULT 'https://www.linkedin.com/in/lingarajmb',
  github_url TEXT NOT NULL DEFAULT 'https://github.com/Lingarajmb',
  status_badge TEXT NOT NULL DEFAULT 'Immediate Joiner',
  role_headline TEXT NOT NULL DEFAULT 'Software Tester II / QA Automation Engineer',
  availability_summary TEXT NOT NULL DEFAULT 'Available for full-time QA Automation / SDET roles. Immediate Joiner with zero notice period. Experienced in Manual Testing, API Validation, Playwright Automation, SQL Verification, and MongoDB.',
  availability_tags JSONB NOT NULL DEFAULT '["Immediate Joiner", "Full-Time", "Manual QA", "Playwright Automation", "API Testing", "SQL & MongoDB"]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. JOURNEY MILESTONES
CREATE TABLE IF NOT EXISTS public.portfolio_journey_milestones (
  id TEXT PRIMARY KEY,
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  is_current BOOLEAN DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 1,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. EDUCATION
CREATE TABLE IF NOT EXISTS public.portfolio_education (
  id TEXT PRIMARY KEY,
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  university TEXT,
  year TEXT NOT NULL,
  score TEXT,
  sort_order INTEGER NOT NULL DEFAULT 1,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. CERTIFICATIONS
CREATE TABLE IF NOT EXISTS public.portfolio_certifications (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  certificate_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 1,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. CONTACT MESSAGES (Inbound inquiries with database-level input validation)
CREATE TABLE IF NOT EXISTS public.portfolio_contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL CHECK (char_length(trim(name)) BETWEEN 1 AND 100),
  email TEXT NOT NULL CHECK (
    char_length(trim(email)) BETWEEN 5 AND 255
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  ),
  subject TEXT NOT NULL CHECK (char_length(trim(subject)) BETWEEN 1 AND 200),
  message TEXT NOT NULL CHECK (char_length(trim(message)) BETWEEN 5 AND 5000),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  is_read BOOLEAN NOT NULL DEFAULT false
);

-- ==============================================================================
-- INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.portfolio_projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.portfolio_projects(is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_work_exp_published ON public.portfolio_work_experience(is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_skills_cat_published ON public.portfolio_skills(category, is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_case_files_proj ON public.portfolio_case_study_files(project_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_journey_published ON public.portfolio_journey_milestones(is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_education_published ON public.portfolio_education(is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_cert_published ON public.portfolio_certifications(is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_contact_messages_submitted ON public.portfolio_contact_messages(submitted_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Security Model:
-- - Public visitors can only SELECT published/active content.
-- - Public case-study files are strictly restricted to published parent projects.
-- - Public visitors cannot read any contact messages; can only INSERT valid messages.
-- - Only authorized admin (lingarajmb1997@gmail.com) has full CRUD on all tables.
-- ==============================================================================
ALTER TABLE public.admin_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_case_study_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_resume_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_journey_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop previous policies for clean idempotent execution
DROP POLICY IF EXISTS "Public can view hero" ON public.portfolio_hero;
DROP POLICY IF EXISTS "Public can view published experience" ON public.portfolio_work_experience;
DROP POLICY IF EXISTS "Public can view published skills" ON public.portfolio_skills;
DROP POLICY IF EXISTS "Public can view published projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Public can view case study files" ON public.portfolio_case_study_files;
DROP POLICY IF EXISTS "Public can view active resume" ON public.portfolio_resume_versions;
DROP POLICY IF EXISTS "Public can view contact" ON public.portfolio_contact;
DROP POLICY IF EXISTS "Public can view milestones" ON public.portfolio_journey_milestones;
DROP POLICY IF EXISTS "Public can view education" ON public.portfolio_education;
DROP POLICY IF EXISTS "Public can view certifications" ON public.portfolio_certifications;
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.portfolio_contact_messages;

DROP POLICY IF EXISTS "Admin full hero" ON public.portfolio_hero;
DROP POLICY IF EXISTS "Admin full experience" ON public.portfolio_work_experience;
DROP POLICY IF EXISTS "Admin full skills" ON public.portfolio_skills;
DROP POLICY IF EXISTS "Admin full projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Admin full case study files" ON public.portfolio_case_study_files;
DROP POLICY IF EXISTS "Admin full resume" ON public.portfolio_resume_versions;
DROP POLICY IF EXISTS "Admin full contact" ON public.portfolio_contact;
DROP POLICY IF EXISTS "Admin full milestones" ON public.portfolio_journey_milestones;
DROP POLICY IF EXISTS "Admin full education" ON public.portfolio_education;
DROP POLICY IF EXISTS "Admin full certifications" ON public.portfolio_certifications;
DROP POLICY IF EXISTS "Admin full contact messages" ON public.portfolio_contact_messages;
DROP POLICY IF EXISTS "Admin full whitelist" ON public.admin_whitelist;

-- 1. Public Read Policies
CREATE POLICY "Public can view hero"
ON public.portfolio_hero FOR SELECT
USING (true);

CREATE POLICY "Public can view published experience"
ON public.portfolio_work_experience FOR SELECT
USING (is_published = true OR public.is_admin());

CREATE POLICY "Public can view published skills"
ON public.portfolio_skills FOR SELECT
USING (is_published = true OR public.is_admin());

CREATE POLICY "Public can view published projects"
ON public.portfolio_projects FOR SELECT
USING (is_published = true OR public.is_admin());

-- Hardened: Public can only view files for published projects. Draft project files are protected.
CREATE POLICY "Public can view case study files"
ON public.portfolio_case_study_files FOR SELECT
USING (
  (EXISTS (
    SELECT 1 FROM public.portfolio_projects p
    WHERE p.id = portfolio_case_study_files.project_id
      AND p.is_published = true
  ))
  OR public.is_admin()
);

CREATE POLICY "Public can view active resume"
ON public.portfolio_resume_versions FOR SELECT
USING (is_active = true OR public.is_admin());

CREATE POLICY "Public can view contact"
ON public.portfolio_contact FOR SELECT
USING (true);

CREATE POLICY "Public can view milestones"
ON public.portfolio_journey_milestones FOR SELECT
USING (is_published = true OR public.is_admin());

CREATE POLICY "Public can view education"
ON public.portfolio_education FOR SELECT
USING (is_published = true OR public.is_admin());

CREATE POLICY "Public can view certifications"
ON public.portfolio_certifications FOR SELECT
USING (is_published = true OR public.is_admin());

-- Public can submit messages with validation check; non-admins have ZERO read access
CREATE POLICY "Public can submit contact messages"
ON public.portfolio_contact_messages FOR INSERT
WITH CHECK (
  char_length(trim(name)) BETWEEN 1 AND 100
  AND char_length(trim(email)) BETWEEN 5 AND 255
  AND char_length(trim(subject)) BETWEEN 1 AND 200
  AND char_length(trim(message)) BETWEEN 5 AND 5000
);

-- 2. Admin Full Management Policies (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Admin full hero"
ON public.portfolio_hero FOR ALL
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full experience"
ON public.portfolio_work_experience FOR ALL
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full skills"
ON public.portfolio_skills FOR ALL
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full projects"
ON public.portfolio_projects FOR ALL
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full case study files"
ON public.portfolio_case_study_files FOR ALL
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full resume"
ON public.portfolio_resume_versions FOR ALL
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full contact"
ON public.portfolio_contact FOR ALL
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full milestones"
ON public.portfolio_journey_milestones FOR ALL
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full education"
ON public.portfolio_education FOR ALL
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full certifications"
ON public.portfolio_certifications FOR ALL
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full contact messages"
ON public.portfolio_contact_messages FOR ALL
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full whitelist"
ON public.admin_whitelist FOR ALL
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ==============================================================================
-- STORAGE BUCKETS SETUP & SECURITY
-- ==============================================================================

-- Bucket 1: portfolio-assets (Project media, screenshots, videos, documents, spreadsheets)
-- Limit: 50MB per file
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-assets',
  'portfolio-assets',
  true,
  52428800, -- 50MB limit
  ARRAY[
    'image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml',
    'video/mp4', 'video/webm',
    'application/pdf',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain', 'text/csv'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket 2: portfolio-resumes (Strictly PDF-only, PRIVATE bucket)
-- Access is restricted: only the currently active resume can be signed/downloaded
-- Limit: 15MB per file
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-resumes',
  'portfolio-resumes',
  false, -- Strictly PRIVATE bucket: access restricted to active resume via signed URLs
  15728640, -- 15MB limit
  ARRAY['application/pdf'] -- Strictly PDF-only
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Object Policies
DROP POLICY IF EXISTS "Public can view portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Public can view portfolio resumes" ON storage.objects;
DROP POLICY IF EXISTS "Public can view active resume" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update resumes" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete resumes" ON storage.objects;

-- Public can view assets in approved bucket
CREATE POLICY "Public can view portfolio assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-assets');

-- Strict Storage Access: Public can ONLY download the currently ACTIVE resume via signed URLs.
-- Inactive, historical, or deleted resumes cannot be downloaded or viewed by the public.
CREATE POLICY "Public can view active resume"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'portfolio-resumes'
  AND (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.portfolio_resume_versions r
      WHERE r.is_active = true
        AND (
          r.storage_path = storage.objects.name
          OR r.storage_path = 'resumes/' || storage.objects.name
          OR storage.objects.name = r.file_name
          OR storage.objects.name = replace(r.storage_path, 'resumes/', '')
        )
    )
  )
);

-- Admin full management for assets
CREATE POLICY "Admin can upload assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-assets' AND public.is_admin());

CREATE POLICY "Admin can update assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio-assets' AND public.is_admin())
WITH CHECK (bucket_id = 'portfolio-assets' AND public.is_admin());

CREATE POLICY "Admin can delete assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio-assets' AND public.is_admin());

-- Admin full management for resumes
CREATE POLICY "Admin can upload resumes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-resumes' AND public.is_admin());

CREATE POLICY "Admin can update resumes"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio-resumes' AND public.is_admin())
WITH CHECK (bucket_id = 'portfolio-resumes' AND public.is_admin());

CREATE POLICY "Admin can delete resumes"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio-resumes' AND public.is_admin());

-- ==============================================================================
-- SEED INITIAL DATA (Idempotent: ON CONFLICT DO NOTHING preserves admin modifications)
-- Single Source of Truth: Lingaraj_Belagali_Resume(3).pdf
-- ==============================================================================

-- 1. Hero Content
INSERT INTO public.portfolio_hero (
  id, full_name, designation, typing_words, bio, availability_status, is_available,
  years_of_experience, test_cases_count, releases_count, tools_count,
  primary_cta_text, primary_cta_link, secondary_cta_text, secondary_cta_link, profile_image_url
)
VALUES (
  'default',
  'Lingaraj Belagali',
  'Software Tester II',
  '["Quality Assurance Engineer", "Manual Testing Expert", "API Testing Specialist", "Playwright Automation", "SQL & MongoDB Validation"]'::jsonb,
  'Passionate QA Engineer with 3.8+ years of experience delivering high-quality enterprise software through Manual Testing, API Validation, Playwright Automation, SQL Verification, and Agile collaboration. Experienced across Capital Markets, Wealth Management, Application Modernization, and AI-driven platforms.',
  'Immediate Joiner',
  true,
  3.8,
  500,
  25,
  12,
  'Explore My Work',
  '#projects',
  'Download Resume',
  'resumes/Lingaraj_Belagali_Resume_QA_Immediate_Joiner.pdf',
  '/assets/profile.png'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Contact Information
INSERT INTO public.portfolio_contact (
  id, email, phone, linkedin_url, github_url, status_badge, role_headline,
  availability_summary, availability_tags
)
VALUES (
  'default',
  'lingarajmb1997@gmail.com',
  '+91 8050478051',
  'https://www.linkedin.com/in/lingarajmb',
  'https://github.com/Lingarajmb',
  'Immediate Joiner',
  'Software Tester II / QA Automation Engineer',
  'Available for full-time QA Automation / SDET roles. Immediate Joiner with zero notice period. Experienced in Manual Testing, API Validation, Playwright Automation, SQL Verification, and MongoDB.',
  '["Immediate Joiner", "Full-Time", "Manual QA", "Playwright Automation", "API Testing", "SQL & MongoDB"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 3. Work Experience (Single Source of Truth: Spire.ai and Tata Consultancy Services)
INSERT INTO public.portfolio_work_experience (
  id, company_name, designation, period, start_date, end_date, is_current,
  employment_type, domain, summary, responsibilities, technologies, achievements, sort_order, is_published
)
VALUES
(
  'exp-spire-ai',
  'Spire.ai',
  'Software Tester II',
  'November 2025 – May 2026',
  '2025-11-01',
  '2026-05-31',
  false, -- Explicitly NOT a current position
  'Full-time',
  'AI-Driven Enterprise Platforms',
  'Testing AI-powered enterprise applications through Manual Testing, API Testing, Playwright Automation, MongoDB Validation, and Agile sprint execution.',
  '["Performed Functional, Regression, Smoke, and Sanity testing across AI platform modules.", "Designed and executed test suites for REST APIs using Postman, Newman, and Swagger.", "Automated critical end-to-end user journeys using Playwright and TypeScript.", "Validated complex MongoDB documents, aggregations, and data ingestion pipelines.", "Identified, logged, and tracked defects in JIRA with comprehensive root-cause analysis.", "Collaborated closely with developers, product managers, and data engineers in 2-week Agile sprints."]'::jsonb,
  '["Playwright", "TypeScript", "Postman", "MongoDB", "JIRA", "Agile", "REST APIs", "Newman"]'::jsonb,
  '["Reduced manual regression time by 45% via Playwright automation.", "Improved API endpoint validation coverage to 92% across microservices."]'::jsonb,
  1,
  true
),
(
  'exp-tcs',
  'Tata Consultancy Services',
  'Software Tester I',
  'March 2022 – April 2025',
  '2022-03-01',
  '2025-04-30',
  false,
  'Full-time',
  'Capital Markets & Wealth Management (SEI)',
  'Delivered comprehensive quality assurance for enterprise wealth management and trading platforms, focusing on trade lifecycle validation, regulatory compliance, database integrity, and high-volume transaction processing.',
  '["Authored and executed 500+ manual test cases covering portfolio management, order routing, and settlement workflows.", "Conducted extensive backend database testing using complex SQL queries across Oracle and PostgreSQL.", "Validated RESTful and SOAP web services for third-party market data integrations.", "Executed regression testing for 25+ major production releases with zero critical production escapes.", "Participated in daily standups, sprint planning, and retrospective meetings following SAFe Agile practices."]'::jsonb,
  '["Manual Testing", "SQL", "Oracle", "PostgreSQL", "Postman", "JIRA", "Confluence", "SEI Wealth Platform"]'::jsonb,
  '["Zero critical defects escaped into production across 25+ releases.", "Awarded On-the-Spot Recognition for leading end-to-end modernization testing."]'::jsonb,
  2,
  true
)
ON CONFLICT (id) DO NOTHING;

-- 4. Projects & Case Studies (5 Verified Real-World Case Studies)
INSERT INTO public.portfolio_projects (
  id, slug, title, tag_label, category, color_theme, short_description,
  overview, problem_statement, solution_approach, tech_stack, features, stats,
  workflow_steps, test_scenarios, responsibilities, achievements, lessons_learned,
  thumbnail_url, demo_url, github_url, has_html_report, html_report_url,
  is_featured, sort_order, is_published
)
VALUES
(
  'proj-playwright-framework',
  'playwright-framework',
  'Playwright End-to-End Automation Framework',
  'Automation Framework',
  'Automation',
  'blue',
  'Robust, scalable Page Object Model (POM) test automation framework built with TypeScript and Playwright, featuring cross-browser execution, automated reporting, and CI/CD integration.',
  'A production-ready test automation framework engineered from scratch to validate modern single-page applications. Employs modular Page Object Model architecture, reusable fixture utilities, dynamic data generation, and interactive HTML reporting.',
  'Frequent release cycles and complex UI interactions led to high manual regression overhead and sporadic timing issues in legacy Selenium scripts.',
  'Engineered an ultra-fast Playwright framework with auto-waiting, isolated browser contexts, parallel worker execution, and built-in artifact capturing on failure.',
  '["Playwright", "TypeScript", "Node.js", "Allure Report", "GitHub Actions", "CI/CD"]'::jsonb,
  '["Page Object Model (POM) Architecture", "Cross-browser execution (Chromium, Firefox, WebKit)", "Automatic screenshot and trace recording on failure", "Allure and Playwright HTML visual reporting", "Parallel execution across multi-core workers"]'::jsonb,
  '[{"label": "Test Cases", "value": "150+"}, {"label": "Pass Rate", "value": "99.4%"}, {"label": "Exec Time", "value": "4.2 min"}, {"label": "Coverage", "value": "88%"}]'::jsonb,
  '[{"stepNumber": 1, "title": "Environment Setup", "description": "Initialize Playwright runner, load base fixtures, and configure multi-environment URLs.", "icon": "settings"}, {"stepNumber": 2, "title": "Parallel Test Execution", "description": "Run suites across Chromium, Firefox, and WebKit simultaneously using configured worker pools.", "icon": "play"}, {"stepNumber": 3, "title": "Artifact & Trace Capture", "description": "Auto-capture DOM snapshots, network HAR logs, and video traces on assertion failures.", "icon": "camera"}, {"stepNumber": 4, "title": "Interactive Report Generation", "description": "Generate comprehensive HTML test report with execution duration, step details, and failure logs.", "icon": "bar-chart"}]'::jsonb,
  '[{"id": "sc-1", "title": "User Authentication & MFA Validation", "description": "Verify successful sign-in with valid credentials, session preservation, and rejection of invalid tokens.", "type": "Functional / Security", "status": "Automated"}, {"id": "sc-2", "title": "Complex Multi-step Checkout", "description": "End-to-end checkout flow including address validation, payment gateway mock, and order confirmation receipt.", "type": "E2E Workflow", "status": "Automated"}, {"id": "sc-3", "title": "Responsive Viewport & Cross-browser Check", "description": "Ensure UI layouts render without overlap or horizontal scroll on Desktop (1920x1080), Tablet, and Mobile.", "type": "Cross-Browser", "status": "Automated"}]'::jsonb,
  '[{"title": "Framework Architecture", "description": "Architected clean TypeScript POM structure with type-safe fixtures and configuration.", "icon": "cpu"}, {"title": "CI/CD Integration", "description": "Integrated test runner into GitHub Actions pipeline with automated pull request status checks.", "icon": "git-branch"}]'::jsonb,
  '[{"title": "70% Faster Execution", "description": "Replaced slow legacy tests with parallel Playwright runs, reducing suite time from 20 minutes to 4 minutes."}, {"title": "Zero False Positives", "description": "Playwright auto-waiting eliminated flaky timeout failures completely."}]'::jsonb,
  '["Isolated browser contexts guarantee test independence without cross-test state leakage.", "Actionability auto-waiting drastically reduces the need for artificial sleep timers."]'::jsonb,
  '/assets/screenshots/playwright/framework.png',
  'https://lingaraj-qa-portfolio.netlify.app',
  'https://github.com/Lingarajmb',
  true,
  '/assets/screenshots/playwright/index.html',
  true,
  1,
  true
),
(
  'proj-api-testing',
  'api-testing',
  'REST API Automation & Validation Suite',
  'API Testing',
  'API',
  'green',
  'Comprehensive REST API test automation suite using Postman, Newman, and Swagger for validating microservices, data contracts, and authentication protocols.',
  'End-to-end testing of RESTful APIs supporting microservices architecture. Includes automated collection runs via Newman CLI, dynamic environment variable chaining, schema validation, and negative boundary analysis.',
  'Microservices endpoints lacked automated contract verification, causing integration breakages when backend payloads changed unexpectedly.',
  'Constructed Postman collections with JavaScript test assertions, JSON Schema validator, header authentication pre-request scripts, and Newman CI/CD integration.',
  '["Postman", "Newman", "JavaScript", "JSON Schema", "REST API", "Swagger", "JIRA"]'::jsonb,
  '["Automated test collection runs via Newman CLI", "JSON Schema contract validation on all endpoints", "Dynamic JWT and Bearer token generation", "Negative testing for boundary cases (400, 401, 403, 404, 500)", "Data-driven testing using JSON and CSV payloads"]'::jsonb,
  '[{"label": "Endpoints", "value": "60+"}, {"label": "Collections", "value": "12"}, {"label": "Pass Rate", "value": "99.8%"}, {"label": "Execution", "value": "45 sec"}]'::jsonb,
  '[{"stepNumber": 1, "title": "Pre-request Auth Chaining", "description": "Authenticate admin/user role and inject bearer tokens dynamically into collection variables.", "icon": "key"}, {"stepNumber": 2, "title": "Contract & Schema Verification", "description": "Assert HTTP status code, response time < 300ms, and complete JSON schema compliance.", "icon": "check-circle"}, {"stepNumber": 3, "title": "Data Chaining Across Endpoints", "description": "Extract created resource IDs from POST response to drive subsequent GET, PUT, and DELETE requests.", "icon": "link"}, {"stepNumber": 4, "title": "Newman CLI Report Export", "description": "Run via command line and export HTML/JSON test results for audit trails and CI validation.", "icon": "file-text"}]'::jsonb,
  '[{"id": "api-1", "title": "Authentication Token Ingestion & Expiry", "description": "Verify token generation, claim validation, and proper 401 Unauthorized handling for expired credentials.", "type": "Security", "status": "Automated"}, {"id": "api-2", "title": "Resource CRUD Operations Lifecycle", "description": "POST create resource, GET verify creation, PUT update fields, DELETE and assert 404 on subsequent read.", "type": "CRUD Workflow", "status": "Automated"}, {"id": "api-3", "title": "Rate Limiting & Payload Boundary", "description": "Send high-frequency bursts and oversized payloads to confirm 429 Too Many Requests and proper validation messages.", "type": "Edge Case", "status": "Automated"}]'::jsonb,
  '[{"title": "Test Suite Design", "description": "Built modular Postman collections organized by business domains.", "icon": "layers"}, {"title": "CI Integration", "description": "Automated Newman runs triggered upon new microservice deployments.", "icon": "terminal"}]'::jsonb,
  '[{"title": "100% Contract Compliance", "description": "Detected 14 payload regression issues prior to staging releases."}, {"title": "45s Full Suite Run", "description": "Full regression suite executes in under a minute via CLI."}]'::jsonb,
  '["Environment chaining makes test suites fully portable between local, dev, staging, and prod.", "Testing HTTP header constraints upfront catches security oversights early."]'::jsonb,
  '/assets/screenshots/api/collection.png',
  'https://lingaraj-qa-portfolio.netlify.app',
  'https://github.com/Lingarajmb',
  false,
  NULL,
  true,
  2,
  true
),
(
  'proj-mabl-automation',
  'mabl-automation',
  'Mabl AI-Powered Low-Code UI Automation',
  'AI-Powered QA',
  'Automation',
  'purple',
  'Intelligent automated regression suites leveraging Mabl machine learning and self-healing tests to drastically reduce maintenance on dynamic web applications.',
  'Implementation of Mabl AI test automation platform to accelerate testing cycles on rapidly evolving enterprise web portals. Features self-healing element locators, visual diff regression, and scheduled cloud executions.',
  'Frequent DOM structure refactoring in continuous delivery pipelines led to constant locator breakage in traditional scripted frameworks.',
  'Implemented Mabl smart auto-healing locators that analyze 30+ DOM attributes to maintain robust test reliability across releases without manual maintenance.',
  '["Mabl", "AI Automation", "Visual Testing", "Cloud Execution", "JIRA", "Slack Integration"]'::jsonb,
  '["Self-healing element locators driven by ML models", "Visual change detection and automated diff highlights", "Scheduled cross-browser cloud execution runs", "Integrated network performance tracking and console log analysis", "One-click defect logging directly into JIRA"]'::jsonb,
  '[{"label": "Journeys", "value": "45+"}, {"label": "Self-Healed", "value": "85%"}, {"label": "Run Time", "value": "12 min"}, {"label": "Maint. Saved", "value": "60%"}]'::jsonb,
  '[{"stepNumber": 1, "title": "User Journey Recording", "description": "Record critical business workflows using Mabl Trainer with intelligent assertion checkpoints.", "icon": "video"}, {"stepNumber": 2, "title": "Self-Healing Assertion", "description": "Mabl ML models analyze DOM changes and dynamically resolve updated element paths.", "icon": "refresh-cw"}, {"stepNumber": 3, "title": "Cloud Parallel Execution", "description": "Execute journeys concurrently in secure cloud browser environments.", "icon": "cloud"}, {"stepNumber": 4, "title": "Visual & Performance Analysis", "description": "Review automated visual diffs, network waterfalls, and console error traces.", "icon": "eye"}]'::jsonb,
  '[{"id": "mabl-1", "title": "Dynamic Grid Data Verification", "description": "Validate data tables with dynamic sorting, filtering, and pagination under changing screen resolutions.", "type": "UI Validation", "status": "Automated"}, {"id": "mabl-2", "title": "Visual Diff & UI Layout Shift", "description": "Compare baseline screenshots against release candidates to detect unintended layout shifts.", "type": "Visual Regression", "status": "Automated"}]'::jsonb,
  '[{"title": "Mabl Journey Architect", "description": "Created reusable flow components to modularize test steps across multiple journeys.", "icon": "code"}, {"title": "Defect Tracking", "description": "Configured automated Slack alerts and JIRA defect creation.", "icon": "bell"}]'::jsonb,
  '[{"title": "60% Maintenance Reduction", "description": "Eliminated hours spent on updating broken CSS and XPath locators."}, {"title": "Rapid Test Coverage", "description": "Automated 45 complex user journeys in just 3 sprints."}]'::jsonb,
  '["Low-code AI testing tools empower fast test creation while freeing SDETs for complex backend work.", "Visual diffing catches subtle layout regressions that functional assertions miss."]'::jsonb,
  '/assets/screenshots/mabl/dashboard.png',
  'https://lingaraj-qa-portfolio.netlify.app',
  'https://github.com/Lingarajmb',
  false,
  NULL,
  true,
  3,
  true
),
(
  'proj-sei-wealth',
  'sei-wealth',
  'SEI Wealth Platform Enterprise Modernization',
  'Enterprise Platform',
  'Enterprise',
  'blue',
  'Mission-critical quality assurance for SEI Wealth Platform (SWP), validating multi-asset portfolio accounting, trade settlement, and complex financial calculations.',
  'End-to-end QA validation of an enterprise-scale wealth management platform handling billions in assets under management. Involved extensive database verification, trade lifecycle testing, and legacy application modernization.',
  'Complex financial calculations and strict SEC/FINRA regulatory compliance required zero tolerance for data discrepancy across millions of daily transactions.',
  'Implemented rigorous multi-tier testing combining business logic verification, complex SQL reconciliation queries, and regression suites for 25+ major production releases.',
  '["Manual Testing", "SQL", "Oracle", "PostgreSQL", "SEI Platform", "JIRA", "HP ALM", "Agile"]'::jsonb,
  '["Multi-asset trade execution and settlement verification", "Complex financial reconciliation using advanced SQL queries", "User permission and role-based access control (RBAC) testing", "Performance testing under high transaction concurrency", "Legacy desktop modernization to modern cloud architecture"]'::jsonb,
  '[{"label": "Releases", "value": "25+"}, {"label": "Manual Cases", "value": "500+"}, {"label": "Prod Escapes", "value": "0"}, {"label": "Data Acc.", "value": "100%"}]'::jsonb,
  '[{"stepNumber": 1, "title": "Requirement & Regulatory Analysis", "description": "Deconstruct business requirements and compliance specifications into detailed test matrices.", "icon": "file-search"}, {"stepNumber": 2, "title": "Test Scenario Execution", "description": "Execute functional, integration, and negative test cases across trade lifecycle stages.", "icon": "check-square"}, {"stepNumber": 3, "title": "Database Reconciliation", "description": "Execute multi-table SQL joins and aggregation queries to verify accounting ledgers.", "icon": "database"}, {"stepNumber": 4, "title": "UAT & Production Sign-off", "description": "Facilitate user acceptance testing and provide quality sign-off for release deployment.", "icon": "shield-check"}]'::jsonb,
  '[{"id": "sei-1", "title": "Portfolio Rebalancing & Order Routing", "description": "Verify rebalancing algorithm calculates correct buy/sell lots and routes orders according to model weights.", "type": "Financial Logic", "status": "Passed"}, {"id": "sei-2", "title": "Multi-currency Trade Settlement", "description": "Confirm cash ledger and asset holdings update accurately on T+1 settlement with foreign exchange conversion.", "type": "Core Accounting", "status": "Passed"}, {"id": "sei-3", "title": "Database Ledger Audit Trail", "description": "Execute SQL queries to assert audit trail immutability and compliance timestamps.", "type": "Database Audit", "status": "Passed"}]'::jsonb,
  '[{"title": "Lead QA Analyst", "description": "Owned quality deliverables across 25+ release sprints for core wealth management modules.", "icon": "user-check"}, {"title": "Database Verification", "description": "Authored 200+ specialized SQL validation queries for financial integrity.", "icon": "database"}]'::jsonb,
  '[{"title": "Zero Production Escapes", "description": "Achieved pristine release record with zero critical bugs escaping to production."}, {"title": "On-the-Spot Excellence Award", "description": "Recognized by TCS leadership for exceptional quality ownership."}]'::jsonb,
  '["In financial applications, backend database validation is just as crucial as UI testing.", "Close partnership with business analysts early in requirement phases prevents defect leakage."]'::jsonb,
  '/assets/screenshots/sei/dashboard.png',
  'https://lingaraj-qa-portfolio.netlify.app',
  'https://github.com/Lingarajmb',
  false,
  NULL,
  true,
  4,
  true
),
(
  'proj-ai-platform',
  'ai-platform',
  'AI-Powered Enterprise Application Testing',
  'AI Platform',
  'AI Platform',
  'orange',
  'Specialized QA verification for AI-driven enterprise talent and skills platforms, featuring prompt engineering validation, MongoDB data integrity, and high-concurrency API performance.',
  'Comprehensive testing framework tailored for non-deterministic AI applications. Validated LLM response accuracy, pipeline data flows, vector embeddings, and multi-tenant access controls.',
  'AI application outputs can vary, making traditional binary assertions insufficient for validating semantic accuracy, token limits, and AI agent workflows.',
  'Developed hybrid validation strategies combining deterministic API/database tests with heuristic evaluation criteria for AI prompt responses and MongoDB document structures.',
  '["Playwright", "MongoDB", "Postman", "TypeScript", "Python", "Swagger", "JIRA", "Agile"]'::jsonb,
  '["Validation of AI prompt outputs and semantic relevance", "MongoDB document validation and aggregation pipeline testing", "REST API performance testing under high concurrent loads", "Playwright automated end-to-end testing of dynamic UI components", "Security testing for prompt injection and role-based data isolation"]'::jsonb,
  '[{"label": "AI Tests", "value": "80+"}, {"label": "API Endpoints", "value": "40+"}, {"label": "DB Collections", "value": "15"}, {"label": "Pass Rate", "value": "98.5%"}]'::jsonb,
  '[{"stepNumber": 1, "title": "Ingestion Pipeline Validation", "description": "Verify resume, skill profile, and job requisition data ingestion into MongoDB collections.", "icon": "database"}, {"stepNumber": 2, "title": "AI Model Response Evaluation", "description": "Assess model outputs against benchmark ground truth data for consistency and relevance.", "icon": "cpu"}, {"stepNumber": 3, "title": "API Microservices Integration", "description": "Automate endpoint tests to verify low-latency communication between AI services.", "icon": "zap"}, {"stepNumber": 4, "title": "E2E UI Workflow Automation", "description": "Run Playwright suites validating candidate matching and analytics dashboards.", "icon": "monitor"}]'::jsonb,
  '[{"id": "ai-1", "title": "Candidate Matching Algorithm Evaluation", "description": "Verify matching engine computes correct suitability scores based on extracted skill profiles.", "type": "AI Logic", "status": "Automated"}, {"id": "ai-2", "title": "MongoDB Document Schema Consistency", "description": "Query MongoDB collections to ensure nested objects adhere to strict schema constraints after ingestion.", "type": "Database Validation", "status": "Automated"}, {"id": "ai-3", "title": "Security & Multi-Tenant Data Isolation", "description": "Assert tenant A cannot access candidate profiles or embeddings belonging to tenant B.", "type": "Security", "status": "Automated"}]'::jsonb,
  '[{"title": "AI Quality Specialist", "description": "Established validation standards for testing generative and predictive AI services.", "icon": "sparkles"}, {"title": "MongoDB Testing Lead", "description": "Created automated scripts for validating document transitions in NoSQL stores.", "icon": "database"}]'::jsonb,
  '[{"title": "45% Reduction in Release Defects", "description": "Implemented automated guardrails preventing AI hallucination regressions."}, {"title": "Multi-Tenant Security Certified", "description": "Identified and patched 3 data leakage risks during security review."}]'::jsonb,
  '["Testing AI requires evaluating consistency over statistical distributions rather than single exact values.", "NoSQL schema drift must be actively monitored with automated schema validators."]'::jsonb,
  '/assets/screenshots/ai/ai-platform.png',
  'https://lingaraj-qa-portfolio.netlify.app',
  'https://github.com/Lingarajmb',
  false,
  NULL,
  true,
  5,
  true
)
ON CONFLICT (id) DO NOTHING;

-- 5. Technical Skills
INSERT INTO public.portfolio_skills (id, name, category, proficiency, icon, sort_order, is_published)
VALUES
('s-1', 'Playwright', 'Automation', 92, 'playwright', 1, true),
('s-2', 'Manual Testing', 'Testing', 95, 'manual', 2, true),
('s-3', 'Postman & REST API', 'Automation', 90, 'postman', 3, true),
('s-4', 'SQL & Relational DBs', 'Database', 88, 'sql', 4, true),
('s-5', 'MongoDB (NoSQL)', 'Database', 82, 'mongodb', 5, true),
('s-6', 'TypeScript / JavaScript', 'Automation', 85, 'typescript', 6, true),
('s-7', 'Mabl AI Automation', 'Automation', 84, 'mabl', 7, true),
('s-8', 'JIRA & Confluence', 'Tools', 95, 'jira', 8, true),
('s-9', 'Agile / Scrum Methodologies', 'Process', 92, 'agile', 9, true),
('s-10', 'CI/CD & GitHub Actions', 'Tools', 80, 'github', 10, true),
('s-11', 'Newman CLI Runner', 'Automation', 86, 'newman', 11, true),
('s-12', 'Test Plan & Case Design', 'Testing', 95, 'testplan', 12, true),
('s-13', 'Regression & Smoke Testing', 'Testing', 96, 'regression', 13, true),
('s-14', 'Defect Lifecycle Management', 'Process', 94, 'defect', 14, true)
ON CONFLICT (id) DO NOTHING;

-- 6. Case Study Files
INSERT INTO public.portfolio_case_study_files (id, project_id, title, description, file_type, url, file_name, file_size, sort_order)
VALUES
('f-1', 'proj-playwright-framework', 'Framework Architecture', 'Page Object Model and Test Runner Structure', 'image', '/assets/screenshots/playwright/framework.png', 'framework.png', '340 KB', 1),
('f-2', 'proj-playwright-framework', 'Test Execution Dashboard', 'Parallel execution terminal run', 'image', '/assets/screenshots/playwright/execution.png', 'execution.png', '290 KB', 2),
('f-3', 'proj-playwright-framework', 'Interactive Test Report', 'Playwright HTML visual execution report', 'image', '/assets/screenshots/playwright/report.png', 'report.png', '420 KB', 3),
('f-4', 'proj-api-testing', 'Postman Collection Structure', 'Modular API requests with assertions', 'image', '/assets/screenshots/api/collection.png', 'collection.png', '280 KB', 1),
('f-5', 'proj-api-testing', 'Newman CLI Execution', 'Automated headless command-line test run', 'image', '/assets/screenshots/api/newman.png', 'newman.png', '310 KB', 2),
('f-6', 'proj-api-testing', 'Response Validation', 'Status code, latency and schema check', 'image', '/assets/screenshots/api/response.png', 'response.png', '260 KB', 3),
('f-7', 'proj-mabl-automation', 'Mabl Analytics Dashboard', 'AI test health and pass rate trends', 'image', '/assets/screenshots/mabl/dashboard.png', 'dashboard.png', '350 KB', 1),
('f-8', 'proj-mabl-automation', 'Journey Execution Run', 'Step-by-step visual execution trace', 'image', '/assets/screenshots/mabl/execution.png', 'execution.png', '390 KB', 2),
('f-9', 'proj-mabl-automation', 'Run History & Flakiness', 'Test stability metrics over time', 'image', '/assets/screenshots/mabl/history.png', 'history.png', '310 KB', 3),
('f-10', 'proj-sei-wealth', 'SEI Platform Interface', 'Wealth accounting and rebalancing view', 'image', '/assets/screenshots/sei/dashboard.png', 'dashboard.png', '460 KB', 1),
('f-11', 'proj-ai-platform', 'AI Platform UI', 'Enterprise skills matching interface', 'image', '/assets/screenshots/ai/ai-platform.png', 'ai-platform.png', '410 KB', 1),
('f-12', 'proj-ai-platform', 'MongoDB Document Validation', 'Document schema and aggregation query verification', 'image', '/assets/screenshots/ai/mongodb.png', 'mongodb.png', '340 KB', 2),
('f-13', 'proj-ai-platform', 'Microservices API Flow', 'High-throughput candidate ingestion endpoints', 'image', '/assets/screenshots/ai/api.png', 'api.png', '290 KB', 3)
ON CONFLICT (id) DO NOTHING;

-- 7. Resume Version (Uses actual Supabase Storage object path)
INSERT INTO public.portfolio_resume_versions (
  id, title, file_name, storage_path, version, file_size, is_active, notes
)
VALUES (
  'res-v1',
  'Lingaraj QA Automation Tester Resume',
  'Lingaraj_Belagali_Resume_QA_Immediate_Joiner.pdf',
  'resumes/Lingaraj_Belagali_Resume_QA_Immediate_Joiner.pdf',
  'v2.0 (Immediate Joiner)',
  '420 KB',
  true,
  'Single source of truth resume: 3.8+ years QA automation experience, Spire.ai and TCS background, Electrical & Electronics Engineering (8.4 CGPA), immediate availability.'
)
ON CONFLICT (id) DO NOTHING;

-- 8. Education (Verified from Lingaraj_Belagali_Resume(3).pdf)
INSERT INTO public.portfolio_education (id, degree, institution, university, year, score, sort_order, is_published)
VALUES
(
  'edu-1',
  'Bachelor of Engineering, Electrical and Electronics Engineering',
  'Tontadarya College of Engineering and Technology, Gadag',
  'Visvesvaraya Technological University (VTU), Karnataka',
  '2018 – 2021',
  'CGPA: 8.4',
  1,
  true
)
ON CONFLICT (id) DO NOTHING;

-- 9. Certifications
INSERT INTO public.portfolio_certifications (id, name, issuer, issue_date, certificate_url, sort_order, is_published)
VALUES
('cert-1', 'Playwright Automation Masterclass', 'Quality Assurance Academy', '2024', NULL, 1, true),
('cert-2', 'REST API Automation with Postman & Newman', 'Postman Certified Student Expert', '2023', NULL, 2, true),
('cert-3', 'SQL for Data Analysis & Database Testing', 'Tata Consultancy Services Competency Certification', '2022', NULL, 3, true)
ON CONFLICT (id) DO NOTHING;

-- 10. Journey Milestones (Updated from Lingaraj_Belagali_Resume(3).pdf)
INSERT INTO public.portfolio_journey_milestones (id, year, title, description, is_current, sort_order, is_published)
VALUES
(
  'm-1',
  'Nov 2025 – May 2026',
  'Software Tester II at Spire.ai',
  'Executed QA testing for AI enterprise platforms, Playwright automation suites, REST API microservices, and MongoDB document validations.',
  false,
  1,
  true
),
(
  'm-2',
  'March 2022 – April 2025',
  'Software Tester I at Tata Consultancy Services',
  'Delivered comprehensive QA for SEI Wealth Platform across 25+ releases, trade lifecycle validation, complex SQL verification, and API testing.',
  false,
  2,
  true
),
(
  'm-3',
  '2018 – 2021',
  'Bachelor of Engineering in EEE',
  'Graduated in Electrical and Electronics Engineering from Tontadarya College of Engineering and Technology, Gadag (VTU) with 8.4 CGPA.',
  false,
  3,
  true
),
(
  'm-4',
  'Present',
  'Immediate Joiner for QA Automation Roles',
  'Available for full-time QA Automation / SDET positions with zero notice period. Ready to bring 3.8+ years of test automation excellence.',
  true,
  4,
  true
)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 15. USER REGISTRATION & ADMIN APPROVAL WORKFLOW
-- Security Architecture:
-- - The ONLY administrator is Lingaraj (lingarajmb1997@gmail.com).
-- - Approving a user grants 'viewer' role; NEVER grants 'admin' role.
-- - Status transitions: pending -> approved or rejected.
-- - Users CANNOT update their own approval status or role (strictly admin-only).
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.portfolio_user_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('viewer', 'member')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_user_reg_status ON public.portfolio_user_registrations(status);
CREATE INDEX IF NOT EXISTS idx_user_reg_email ON public.portfolio_user_registrations(email);

-- Idempotent seed for Lingaraj as permanent approved admin
INSERT INTO public.portfolio_user_registrations (
  id, email, full_name, status, role, approved_by, approved_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'lingarajmb1997@gmail.com',
  'Lingaraj Belagali',
  'approved',
  'viewer',
  'system',
  timezone('utc'::text, now())
)
ON CONFLICT (email) DO UPDATE SET
  status = 'approved',
  updated_at = timezone('utc'::text, now());

-- RLS Security Policies for User Registrations
ALTER TABLE public.portfolio_user_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own registration" ON public.portfolio_user_registrations;
DROP POLICY IF EXISTS "Users can insert own pending registration" ON public.portfolio_user_registrations;
DROP POLICY IF EXISTS "Admin full user registrations" ON public.portfolio_user_registrations;

-- Policy 1: Authenticated users can view ONLY their own registration. Admin can view ALL registrations.
CREATE POLICY "Users can view own registration"
ON public.portfolio_user_registrations FOR SELECT
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR (auth.jwt()->>'email' IS NOT NULL AND lower(auth.jwt()->>'email') = lower(email))
  OR public.is_admin()
);

-- Policy 2: Users can insert only their own initial PENDING registration.
CREATE POLICY "Users can insert own pending registration"
ON public.portfolio_user_registrations FOR INSERT
WITH CHECK (
    status = 'pending'
    AND role = 'viewer'
    AND auth.uid() IS NOT NULL
    AND auth.uid() = user_id
    AND auth.jwt()->>'email' IS NOT NULL
    AND lower(auth.jwt()->>'email') = lower(email)
);

-- Policy 3: Administrator has FULL CRUD (including UPDATE of approval status).
-- Non-admin users have ZERO update permissions; they physically cannot approve themselves.
CREATE POLICY "Admin full user registrations"
ON public.portfolio_user_registrations FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- APPROVE USER REGISTRATION RPC
DROP FUNCTION IF EXISTS public.approve_user_registration(TEXT, TEXT);
CREATE OR REPLACE FUNCTION public.approve_user_registration(
  p_user_id_or_email TEXT,
  p_role TEXT DEFAULT 'viewer'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_updated_record public.portfolio_user_registrations%ROWTYPE;
BEGIN
  -- Strict Administrator Authorization Check
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.';
  END IF;

  -- Security Invariant: Approving another user must NEVER grant them Admin privileges
  IF lower(p_role) = 'admin' THEN
    RAISE EXCEPTION 'Security violation: Admin role cannot be granted to another user.';
  END IF;

  UPDATE public.portfolio_user_registrations
  SET status = 'approved',
      role = 'viewer',
      approved_by = auth.jwt()->>'email',
      approved_at = timezone('utc'::text, now()),
      updated_at = timezone('utc'::text, now())
  WHERE id::text = p_user_id_or_email
     OR user_id::text = p_user_id_or_email
     OR lower(email) = lower(p_user_id_or_email)
  RETURNING * INTO v_updated_record;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User registration record not found for: %', p_user_id_or_email;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'email', v_updated_record.email,
    'status', v_updated_record.status,
    'role', v_updated_record.role,
    'approved_at', v_updated_record.approved_at
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.approve_user_registration(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.approve_user_registration(TEXT, TEXT) TO authenticated;

-- REJECT USER REGISTRATION RPC
DROP FUNCTION IF EXISTS public.reject_user_registration(TEXT, TEXT);
CREATE OR REPLACE FUNCTION public.reject_user_registration(
  p_user_id_or_email TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_updated_record public.portfolio_user_registrations%ROWTYPE;
BEGIN
  -- Strict Administrator Authorization Check
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.';
  END IF;

  UPDATE public.portfolio_user_registrations
  SET status = 'rejected',
      notes = COALESCE(p_notes, 'Registration rejected by administrator.'),
      approved_by = auth.jwt()->>'email',
      approved_at = timezone('utc'::text, now()),
      updated_at = timezone('utc'::text, now())
  WHERE id::text = p_user_id_or_email
     OR user_id::text = p_user_id_or_email
     OR lower(email) = lower(p_user_id_or_email)
  RETURNING * INTO v_updated_record;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User registration record not found for: %', p_user_id_or_email;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'email', v_updated_record.email,
    'status', v_updated_record.status,
    'notes', v_updated_record.notes
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.reject_user_registration(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reject_user_registration(TEXT, TEXT) TO authenticated;

-- OPTIONAL AUTH TRIGGER: Automatically registers auth.users into portfolio_user_registrations

-- Create registration record for every new Auth user

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $fn$
BEGIN
  INSERT INTO public.portfolio_user_registrations (
    user_id,
    email,
    full_name,
    status,
    role
  )
  VALUES (
    NEW.id,
    lower(NEW.email),
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    ),
    CASE
      WHEN lower(NEW.email) = 'lingarajmb1997@gmail.com'
      THEN 'approved'
      ELSE 'pending'
    END,
    'viewer'
  )
  ON CONFLICT (email) DO UPDATE
  SET
    user_id = EXCLUDED.user_id,
    updated_at = timezone('utc'::text, now());

  RETURN NEW;
END;
$fn$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_auth_user();

-- Backfill existing Supabase Auth users
INSERT INTO public.portfolio_user_registrations (
  user_id,
  email,
  full_name,
  status,
  role
)
SELECT
  u.id,
  lower(u.email),
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    split_part(u.email, '@', 1)
  ),
  CASE
    WHEN lower(u.email) = 'lingarajmb1997@gmail.com'
    THEN 'approved'
    ELSE 'pending'
  END,
  'viewer'
FROM auth.users AS u
WHERE u.email IS NOT NULL
ON CONFLICT (email) DO UPDATE
SET
  user_id = EXCLUDED.user_id,
  updated_at = timezone('utc'::text, now());