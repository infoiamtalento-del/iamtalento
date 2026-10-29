-- =====================================================================
-- Seed data: platform jobs, assessment journey content, courses,
-- mentors, hackathons, coupons. Idempotent (safe to re-run).
-- =====================================================================

-- ---------------------------------------------------------------------
-- Platform jobs (mirrors the in-app seed list; salaries are LPA)
-- ---------------------------------------------------------------------
insert into public.employer_job_openings
  (designation, company_name, job_location, work_mode, job_type, experience_min, experience_years, salary_min, salary_max,
   skills, source, status, is_public, job_description, created_at)
select v.t, v.c, v.l, v.m, v.ty, v.e, v.e::text || '+ years', v.a, v.b, v.sk, 'platform', 'active', true,
       v.t || ' at ' || v.c || '. Work on production systems with a verified, skills-first hiring team.',
       now() - make_interval(days => v.d)
from (values
  ('Frontend Developer','Zoho','Chennai','Hybrid','Full-time',1,8,14,array['React','TypeScript','CSS'],2),
  ('Data Analyst','Flipkart','Bengaluru','Onsite','Full-time',1,9,15,array['SQL','Python','Tableau'],1),
  ('Backend Engineer','Razorpay','Bengaluru','Hybrid','Full-time',3,22,36,array['Node.js','PostgreSQL','AWS'],3),
  ('Product Designer','Swiggy','Bengaluru','Hybrid','Full-time',3,18,28,array['Figma','UX Research'],5),
  ('Software Trainee','Infosys','Pune','Onsite','Full-time',0,4,5,array['Java','DSA'],8),
  ('DevOps Engineer','Atlassian','Remote','Remote','Full-time',3,20,32,array['Kubernetes','Terraform','AWS'],4),
  ('ML Engineer','Google','Bengaluru','Hybrid','Full-time',3,25,45,array['Python','PyTorch','MLOps'],6),
  ('Full Stack Intern','Postman','Remote','Remote','Internship',0,4,5,array['React','Node.js'],0),
  ('Engineering Manager','PhonePe','Bengaluru','Onsite','Full-time',7,50,70,array['Leadership','System Design'],12),
  ('Content Writer','Unacademy','Remote','Remote','Contract',0,3,5,array['Writing','SEO'],9),
  ('Software Engineer II','Amazon','Hyderabad','Hybrid','Full-time',3,28,45,array['Java','AWS','System Design'],1),
  ('Cloud Solutions Architect','Microsoft','Bengaluru','Hybrid','Full-time',6,40,65,array['Azure','System Design','Leadership'],2),
  ('Creative Cloud Engineer','Adobe','Noida','Hybrid','Full-time',2,20,34,array['React','TypeScript','Node.js'],3),
  ('Data Scientist','Uber','Bengaluru','Onsite','Full-time',3,26,42,array['Python','SQL','PyTorch'],2),
  ('Product Analyst','Paytm','Noida','Onsite','Full-time',1,10,16,array['SQL','Tableau','Python'],4),
  ('Android Developer','Zomato','Gurugram','Hybrid','Full-time',2,16,28,array['Kotlin','Java'],1),
  ('Backend Engineer','Spotify','Remote','Remote','Full-time',4,35,55,array['Java','Kubernetes','PostgreSQL'],6),
  ('Systems Engineer','Wipro','Chennai','Onsite','Full-time',0,3.5,5,array['Java','SQL'],5),
  ('Business Technology Analyst','Accenture','Pune','Hybrid','Full-time',1,6,10,array['SQL','Excel'],3),
  ('Digital Associate','TCS','Mumbai','Onsite','Full-time',0,3.6,5.5,array['Java','DSA'],7)
) as v(t, c, l, m, ty, e, a, b, sk, d)
where not exists (select 1 from public.employer_job_openings j
                  where j.source = 'platform' and j.designation = v.t and j.company_name = v.c);

-- ---------------------------------------------------------------------
-- Assessment catalog: 4 mandatory core tests + domain tests
-- ---------------------------------------------------------------------
insert into public.assessment_blueprints (slug, name, is_default)
values ('standard-journey', '4 Core Tests + 1 Domain Test + AI Interview', true)
on conflict (slug) do nothing;

insert into public.assessments_catalog
  (slug, title, description, kind, core_position, industry, domain, test_type, difficulty, experience_levels, skills,
   duration_minutes, question_count, price_inr, proctored, creator_name, creator_company)
values
 ('core-communication','Communication Skills','Written and verbal clarity, workplace tone.','core',1,'General','Core','Knowledge','Intermediate',
   array['Fresher','1-3 years','3-5 years','5+ years'],array['Communication','Email Etiquette','Active Listening'],20,5,0,true,'IAmTalento Assessment Board','IAmTalento'),
 ('core-psychometrics','Psychometrics','Personality, aptitude and work-style profile.','core',2,'General','Core','Knowledge','Intermediate',
   array['Fresher','1-3 years','3-5 years','5+ years'],array['Aptitude','Work Style','Logical Reasoning'],20,5,0,true,'IAmTalento Assessment Board','IAmTalento'),
 ('core-vocational','Vocational','Career interests and role-fit indicators.','core',3,'General','Core','Knowledge','Intermediate',
   array['Fresher','1-3 years','3-5 years','5+ years'],array['Role Fit','Career Interests'],15,5,0,true,'IAmTalento Assessment Board','IAmTalento'),
 ('core-hr-round','Generic HR Round Test','Behavioural situational judgment, workplace ethics and culture alignment.','core',4,'General','Core','Knowledge','Intermediate',
   array['Fresher','1-3 years','3-5 years','5+ years'],array['Situational Judgment','Ethics','Culture Fit'],20,5,0,true,'IAmTalento Assessment Board','IAmTalento'),
 ('digital-marketing-fundamentals','Digital Marketing Fundamentals','SEO, paid media, analytics and funnel thinking.','domain',null,'Marketing','Digital Marketing','Knowledge','Beginner',
   array['Fresher','1-3 years'],array['SEO','Google Ads','Analytics','Funnels'],30,6,499,true,'Kavitha Rajan','Growth Studio'),
 ('data-analytics-sql-python','Data Analytics with SQL & Python','Querying, cleaning and interpreting data.','domain',null,'Data & Analytics','Data Analytics','Functional','Intermediate',
   array['1-3 years','3-5 years'],array['SQL','Python','Statistics','Dashboards'],40,6,799,true,'Arjun Patel','DataForge')
on conflict (slug) do nothing;

-- Question seeding helper (dropped at the end).
create or replace function public._seed_q(p_slug text, p_section text, p_prompt text, p_options jsonb, p_correct int, p_marks numeric default 1)
returns void language plpgsql as $$
declare _a uuid; _q uuid;
begin
  select id into _a from public.assessments_catalog where slug = p_slug;
  if _a is null or exists (select 1 from public.question_bank where assessment_id = _a and prompt = p_prompt) then return; end if;
  insert into public.question_bank (assessment_id, section, qtype, prompt, options, marks)
    values (_a, p_section, 'mcq', p_prompt, p_options, p_marks) returning id into _q;
  insert into public.question_answer_keys (question_id, correct) values (_q, jsonb_build_object('selected', p_correct));
end $$;

-- Communication
select public._seed_q('core-communication','Written','A client emails an angry complaint about a delayed delivery. What is the best first response?',
  '["Defend the team and explain it was not your fault","Acknowledge the frustration, apologise, and share a concrete next step with a timeline","Ignore it until you have a full solution","Forward it to your manager without a reply"]', 1);
select public._seed_q('core-communication','Written','Which subject line is most effective for a project status email?',
  '["Update","Hi","Q3 Website Redesign: on track, 2 decisions needed by Friday","Please read this email carefully"]', 2);
select public._seed_q('core-communication','Verbal','During a meeting a colleague keeps interrupting you. What is the most professional approach?',
  '["Raise your voice","Stay silent for the rest of the meeting","Calmly say you would like to finish your point, then invite their input","Leave the meeting"]', 2);
select public._seed_q('core-communication','Listening','Active listening mainly involves:',
  '["Preparing your reply while the other person talks","Paraphrasing and asking clarifying questions","Taking notes only on numbers","Agreeing with everything said"]', 1);
select public._seed_q('core-communication','Written','Which sentence is the clearest?',
  '["The report is going to be completed by me by Friday probably","I will send the completed report by Friday 5 PM","Report: Friday maybe","Friday is when I think the report might be sent"]', 1);

-- Psychometrics (aptitude + work style)
select public._seed_q('core-psychometrics','Logic','What comes next in the series: 2, 6, 12, 20, 30, ?',
  '["38","40","42","44"]', 2);
select public._seed_q('core-psychometrics','Logic','If all designers are creative and some creative people are analytical, which statement MUST be true?',
  '["All designers are analytical","Some designers are analytical","No designer is analytical","Cannot be determined that any designer is analytical"]', 3);
select public._seed_q('core-psychometrics','Numerical','A product costs 800 after a 20% discount. What was the original price?',
  '["960","1000","1040","1100"]', 1);
select public._seed_q('core-psychometrics','Work style','You get an unclear task with a tight deadline. You most naturally:',
  '["Wait for exact instructions","Clarify the goal quickly, then plan and start","Start without asking anyone","Delegate it immediately"]', 1);
select public._seed_q('core-psychometrics','Work style','Under pressure, which approach best predicts consistent performance?',
  '["Skipping planning to save time","Breaking work into prioritised steps and communicating status","Working longer hours without updates","Avoiding hard tasks until the end"]', 1);

-- Vocational
select public._seed_q('core-vocational','Interests','Which activity would you enjoy most for a full day?',
  '["Analysing data to find patterns","Designing a user interface","Persuading a customer to buy","Planning a team schedule"]', 0);
select public._seed_q('core-vocational','Interests','You prefer work that is mainly:',
  '["Structured with clear processes","Creative with open-ended problems","People-facing and fast paced","Independent and research heavy"]', 3);
select public._seed_q('core-vocational','Role fit','Which environment helps you do your best work?',
  '["Collaborative open team","Quiet focused solo time","Client-facing and varied","Mentoring and teaching others"]', 0);
select public._seed_q('core-vocational','Role fit','Which statement describes you best?',
  '["I like to build things end to end","I like to improve what exists","I like to connect people and ideas","I like to understand why things work"]', 0);
select public._seed_q('core-vocational','Interests','Which skill do you most want to grow in the next year?',
  '["Technical depth","Leadership","Domain expertise","Communication and influence"]', 0);

-- HR round (situational judgment)
select public._seed_q('core-hr-round','Ethics','You notice a teammate inflating numbers in a report. You should:',
  '["Ignore it to avoid conflict","Raise it privately with them first, and escalate if it continues","Post about it publicly","Fix the numbers silently"]', 1);
select public._seed_q('core-hr-round','Culture','Your manager gives feedback you disagree with. The best response is:',
  '["Argue until they change their mind","Listen fully, ask for examples, then share your view respectfully","Pretend to agree and ignore it","Complain to colleagues"]', 1);
select public._seed_q('core-hr-round','Teamwork','A teammate misses a deadline that blocks you. You:',
  '["Report them immediately","Check in to understand blockers and offer help or re-plan","Do their work silently every time","Stop working until they finish"]', 1);
select public._seed_q('core-hr-round','Ethics','You are offered a gift from a vendor during contract negotiations. You should:',
  '["Accept it quietly","Decline politely and disclose it as per company policy","Accept and share it with the team","Ask for a bigger gift"]', 1);
select public._seed_q('core-hr-round','Adaptability','Priorities change mid-sprint. The best approach is:',
  '["Resist because the plan was approved","Re-plan with stakeholders, communicate trade-offs, and adapt","Do both old and new work without telling anyone","Wait for someone else to decide"]', 1);

-- Domain: Digital Marketing
select public._seed_q('digital-marketing-fundamentals','SEO','Which factor is MOST directly within your control for on-page SEO?',
  '["Competitors'' backlinks","Title tag and heading structure","Search engine algorithm updates","User device type"]', 1);
select public._seed_q('digital-marketing-fundamentals','Paid','In Google Ads, a high CTR with a low conversion rate most likely signals:',
  '["Poor ad copy","A landing page or offer mismatch","Too high a bid","A tracking bug only"]', 1);
select public._seed_q('digital-marketing-fundamentals','Analytics','Which metric best measures profitability of paid campaigns?',
  '["Impressions","CTR","ROAS","Bounce rate"]', 2);
select public._seed_q('digital-marketing-fundamentals','Funnels','Which stage of the funnel does retargeting mainly address?',
  '["Awareness","Consideration and conversion","Post-purchase support only","Brand naming"]', 1);
select public._seed_q('digital-marketing-fundamentals','SEO','What does a canonical tag tell search engines?',
  '["Which page to rank lower","The preferred version of duplicate content","To skip crawling the site","The page language"]', 1);
select public._seed_q('digital-marketing-fundamentals','Analytics','In GA4, an "event" is:',
  '["A paid campaign","A user interaction such as a click, scroll, or purchase","A traffic source","A page template"]', 1);

-- Domain: Data analytics
select public._seed_q('data-analytics-sql-python','SQL','Which SQL clause filters groups after aggregation?',
  '["WHERE","HAVING","GROUP BY","ORDER BY"]', 1);
select public._seed_q('data-analytics-sql-python','SQL','What does a LEFT JOIN return?',
  '["Only matching rows","All rows from the left table and matching rows from the right","All rows from both tables","Only unmatched rows"]', 1);
select public._seed_q('data-analytics-sql-python','Python','Which pandas call returns summary statistics of numeric columns?',
  '["df.info()","df.describe()","df.head()","df.columns"]', 1);
select public._seed_q('data-analytics-sql-python','Statistics','A p-value of 0.03 at a 5% significance level means:',
  '["Fail to reject the null hypothesis","Reject the null hypothesis","The effect is large","The sample is biased"]', 1);
select public._seed_q('data-analytics-sql-python','Python','How do you drop rows with missing values in pandas?',
  '["df.fillna()","df.dropna()","df.isnull()","df.drop_duplicates()"]', 1);
select public._seed_q('data-analytics-sql-python','Dashboards','Which chart best shows a trend over time?',
  '["Pie chart","Line chart","Scatter of categories","Treemap"]', 1);

drop function public._seed_q(text, text, text, jsonb, int, numeric);

-- ---------------------------------------------------------------------
-- Courses, modules, mentors, hackathons, coupons
-- ---------------------------------------------------------------------
insert into public.lms_courses (slug, title, subtitle, category, level, languages, price_inr, original_price_inr, instructor_name, duration_hours, rating, learners_count, skills)
values
 ('ai-engineer-agentic-track','AI Engineer Agentic Track: The Complete Agent & MCP Course','Build, evaluate and ship tool-using AI agents','AI & ML','Intermediate','{EN,HI}',0,799,'Dr. Neha Sharma',8,4.7,32408,array['LLM Agents','MCP','Prompt Engineering','Evaluation']),
 ('data-analytics-masterclass','Data Analytics Masterclass','SQL, Python and dashboards for analysts','Data Science','Intermediate','{EN,TA}',799,4999,'Arjun Patel',12,4.7,9800,array['SQL','Python','Tableau']),
 ('digital-marketing-with-ai','Digital Marketing with AI Tools','Growth marketing with modern AI tooling','Marketing','Beginner','{EN,HI,TE}',499,2999,'Kavitha Rajan',6,4.9,15200,array['SEO','Ads','Analytics'])
on conflict (slug) do nothing;

insert into public.lms_modules (course_id, position, title, kind, duration_sec, is_preview)
select c.id, m.pos, m.title, m.kind, m.dur, m.pos = 1
from public.lms_courses c
join (values
  ('ai-engineer-agentic-track',1,'What is an AI agent?','video',600),
  ('ai-engineer-agentic-track',2,'Tool use and function calling','video',900),
  ('ai-engineer-agentic-track',3,'Model Context Protocol (MCP) essentials','video',1200),
  ('ai-engineer-agentic-track',4,'Evaluating agents','reading',600),
  ('ai-engineer-agentic-track',5,'Capstone: ship an agent','project',1800),
  ('data-analytics-masterclass',1,'SQL foundations','video',900),
  ('data-analytics-masterclass',2,'Python for analysis','video',1200),
  ('data-analytics-masterclass',3,'Dashboards that persuade','project',1500),
  ('digital-marketing-with-ai',1,'Funnels and measurement','video',700),
  ('digital-marketing-with-ai',2,'AI-assisted content and SEO','video',900),
  ('digital-marketing-with-ai',3,'Paid media playbook','video',1000)
) as m(slug, pos, title, kind, dur) on c.slug = m.slug
on conflict (course_id, position) do nothing;

insert into public.mentor_profiles (display_name, headline, expertise, hourly_rate_inr, rating)
select * from (values
  ('Dr. Neha Sharma','AI Engineering Lead',array['AI','LLM Agents','Career Strategy'],499::numeric,4.9::numeric),
  ('Arjun Patel','Senior Data Analyst',array['SQL','Python','Analytics'],399::numeric,4.8::numeric),
  ('Kavitha Rajan','Growth Marketing Director',array['SEO','Paid Media','Brand'],449::numeric,4.9::numeric)
) as v(n, h, e, r, rt)
where not exists (select 1 from public.mentor_profiles m where m.display_name = v.n);

insert into public.mentor_slots (mentor_id, starts_at, ends_at, price_inr)
select m.id, d.day + t.slot, d.day + t.slot + interval '45 minutes', m.hourly_rate_inr
from public.mentor_profiles m
cross join (select (date_trunc('day', now()) + make_interval(days => g))::timestamptz as day from generate_series(2, 9) g) d
cross join (values (interval '10 hours'), (interval '15 hours')) as t(slot)
on conflict (mentor_id, starts_at) do nothing;

insert into public.hackathons (slug, title, description, industry, city, mode, format, starts_at, ends_at, registration_deadline, prize_pool_inr, entry_fee_inr, max_team_size)
values
 ('national-ai-innovation-hackathon','National AI Innovation Hackathon','Solve real industry problems with AI.','AI & Data Science','Bengaluru','hybrid','both','2026-11-14 09:00+05:30','2026-11-15 18:00+05:30','2026-11-10 23:59+05:30',500000,0,4),
 ('fintech-builders-challenge','FinTech Builders Challenge','Build the next generation of money products.','Finance & FinTech','Mumbai','offline','team','2026-12-12 09:00+05:30','2026-12-13 18:00+05:30','2026-12-08 23:59+05:30',500000,299,4),
 ('growth-marketing-sprint','Growth Marketing Sprint','Win customers with data-led growth experiments.','Digital Marketing & Growth','Delhi','online','individual','2027-01-23 09:00+05:30','2027-01-24 18:00+05:30','2027-01-19 23:59+05:30',500000,0,1)
on conflict (slug) do nothing;

insert into public.coupons (code, description, discount_type, value, max_discount, min_order, applies_to, max_redemptions, per_user_limit)
values
 ('WELCOME100','Flat 100 off your first purchase','flat',100,null,199,'{assessment_journey,course,mentor_session}',null,1),
 ('SKILL20','20% off assessments','percent',20,300,300,'{assessment_journey}',5000,1),
 ('LEARN25','25% off courses','percent',25,500,400,'{course}',5000,1)
on conflict (code) do nothing;
