
-- Helper function: check if current user owns the record
CREATE OR REPLACE FUNCTION public.is_owner(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() = target_user_id
$$;

-- Generate unique IAmTalento ID
CREATE OR REPLACE FUNCTION public.generate_talento_id()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  new_id TEXT;
BEGIN
  new_id := 'IAT-' || UPPER(SUBSTR(MD5(gen_random_uuid()::text), 1, 8));
  RETURN new_id;
END;
$$;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  iam_talento_id TEXT UNIQUE NOT NULL DEFAULT public.generate_talento_id(),
  full_name TEXT,
  email TEXT,
  phone TEXT,
  experience_level TEXT CHECK (experience_level IN ('fresher', 'experienced')),
  professional_headline TEXT,
  job_role TEXT,
  company TEXT,
  industry TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  years_of_experience INTEGER DEFAULT 0,
  employment_type TEXT CHECK (employment_type IN ('full-time', 'contract', 'freelance', 'internship')),
  open_to_work BOOLEAN DEFAULT false,
  preferred_locations TEXT[],
  preferred_salary_range TEXT,
  notice_period TEXT,
  availability_status TEXT DEFAULT 'available',
  about_summary TEXT,
  career_objective TEXT,
  key_achievements TEXT,
  areas_of_expertise TEXT[],
  career_interests TEXT[],
  profile_photo_url TEXT,
  resume_url TEXT,
  video_intro_url TEXT,
  portfolio_url TEXT,
  github_url TEXT,
  behance_url TEXT,
  kaggle_url TEXT,
  linkedin_url TEXT,
  other_portfolio_links TEXT[],
  verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified')),
  profile_completion INTEGER DEFAULT 0,
  industry_readiness_score NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (public.is_owner(id));
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (public.is_owner(id));

-- Identity verification
CREATE TABLE public.identity_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT,
  government_id_type TEXT CHECK (government_id_type IN ('aadhar', 'passport', 'driving_license')),
  government_id_url TEXT,
  pan_number TEXT,
  face_match_status TEXT DEFAULT 'pending' CHECK (face_match_status IN ('pending', 'matched', 'failed')),
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.identity_verifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own verification" ON public.identity_verifications FOR ALL USING (public.is_owner(user_id));

-- Experience
CREATE TABLE public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  employment_type TEXT,
  location TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  key_responsibilities TEXT,
  tools_technologies TEXT[],
  achievements TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own experiences" ON public.experiences FOR ALL USING (public.is_owner(user_id));

-- Education
CREATE TABLE public.educations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  institution_name TEXT NOT NULL,
  start_year INTEGER,
  end_year INTEGER,
  grade TEXT,
  activities TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.educations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own educations" ON public.educations FOR ALL USING (public.is_owner(user_id));

-- Certifications
CREATE TABLE public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  issuing_organization TEXT,
  issue_date DATE,
  expiry_date DATE,
  credential_id TEXT,
  credential_url TEXT,
  verification_status TEXT DEFAULT 'unverified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own certifications" ON public.certifications FOR ALL USING (public.is_owner(user_id));

-- Skills
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  skill_name TEXT NOT NULL,
  category TEXT CHECK (category IN ('technical', 'behavioral', 'management')),
  proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  years_of_experience INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own skills" ON public.skills FOR ALL USING (public.is_owner(user_id));

-- Projects
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  role_in_project TEXT,
  organization TEXT,
  start_date DATE,
  end_date DATE,
  description TEXT,
  tools_technologies TEXT[],
  impact TEXT,
  project_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own projects" ON public.projects FOR ALL USING (public.is_owner(user_id));

-- Achievements
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  organization TEXT,
  achievement_date DATE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own achievements" ON public.achievements FOR ALL USING (public.is_owner(user_id));

-- Volunteer Experience
CREATE TABLE public.volunteer_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  organization TEXT NOT NULL,
  role TEXT,
  cause TEXT,
  start_date DATE,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.volunteer_experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own volunteer experiences" ON public.volunteer_experiences FOR ALL USING (public.is_owner(user_id));

-- Courses
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  platform TEXT,
  completion_date DATE,
  skills_learned TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own courses" ON public.courses FOR ALL USING (public.is_owner(user_id));

-- Accomplishments
CREATE TABLE public.accomplishments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('publication', 'patent', 'research', 'conference', 'test_score', 'language', 'membership', 'honor')),
  title TEXT NOT NULL,
  description TEXT,
  date DATE,
  url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.accomplishments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own accomplishments" ON public.accomplishments FOR ALL USING (public.is_owner(user_id));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_identity_verifications_updated_at BEFORE UPDATE ON public.identity_verifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
