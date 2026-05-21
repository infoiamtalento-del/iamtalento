
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('employer', 'employee');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own role"
ON public.user_roles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create employers table (company profile)
CREATE TABLE public.employers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  -- Authorized person details (Step 2)
  contact_name TEXT,
  official_email TEXT,
  phone TEXT,
  company_name TEXT,
  -- Company details (Step 4)
  company_type TEXT,
  registration_type TEXT,
  website TEXT,
  num_employees TEXT,
  address TEXT,
  multiple_locations TEXT[],
  logo_url TEXT,
  description TEXT,
  established_year INTEGER,
  industry TEXT,
  employer_id TEXT NOT NULL DEFAULT generate_talento_id(),
  -- Verification (Step 3)
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  -- Account
  profile_completion INTEGER DEFAULT 0,
  verification_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.employers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can view own profile"
ON public.employers FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Employers can insert own profile"
ON public.employers FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Employers can update own profile"
ON public.employers FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_employers_updated_at
BEFORE UPDATE ON public.employers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Create employer_job_openings table (Steps 5-6)
CREATE TABLE public.employer_job_openings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES public.employers(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  designation TEXT NOT NULL,
  num_openings INTEGER DEFAULT 1,
  salary_min NUMERIC,
  salary_max NUMERIC,
  job_description TEXT,
  job_location TEXT,
  experience_years TEXT,
  is_custom BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.employer_job_openings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can manage own job openings"
ON public.employer_job_openings FOR ALL
USING (auth.uid() = user_id);

CREATE TRIGGER update_job_openings_updated_at
BEFORE UPDATE ON public.employer_job_openings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();
