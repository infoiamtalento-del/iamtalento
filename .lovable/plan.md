

# B2B Copy Adaptation, Spacing & Mobile Responsiveness Fixes

## Overview
Adapt 3 imported home-page sections to speak B2B hiring language, fix spacing issues between specific sections, and improve mobile responsiveness across all sections.

## 1. B2B Copy Adaptation for Imported Sections

These 3 sections are imported from `@/components/landing/` and currently use candidate/career-focused language. Since they're shared components, we need to create inline B2B versions in `ForEmployersV2.tsx` instead of modifying the shared files.

### A. "Recognized by Industry Leaders" (SocialProofBar)
**Current (candidate-focused):**
- H3: "Recognized by Industry Leaders"
- Sub: "Trusted by professionals at the world's top companies"
- Metric: "500K+ Profiles Assessed"
- Metric: "12,000+ Employers Trust Us"
- Metric: "98.5% Score Accuracy"

**New (B2B hiring-focused):**
- H3: "Trusted by Hiring Leaders Worldwide"
- Sub: "Leading employers rely on IAmTalento for skills-first, proctored hiring at scale."
- Metric: "500+ Companies Hiring" (with Building2 icon)
- Metric: "10,000+ Candidates Screened" (with Users icon)
- Metric: "99% Proctoring Accuracy" (with ShieldCheck icon)
- Keep logo marquee as-is (same logos work for B2B)
- Remove avatar photos and star rating (candidate-focused)
- Replace with a cleaner 3-metric band

**Approach:** Create an inline `EmployerSocialProofBar` component in `ForEmployersV2.tsx`, remove the `SocialProofBar` import.

### B. "Enterprise-Grade Proctoring" (AssessmentIntegritySection)
**Current (generic):**
- Tag: "20-Point Anti-Cheating Proctoring"
- H2: "Enterprise-Grade Proctoring"
- Sub: "20 anti-cheating features ensuring integrity at every stage of the assessment lifecycle."
- Phase subtitles: "Before Test", "During Test", "After Test"
- Footer: "Credible Scores. Trusted Outcomes."

**New (B2B employer-focused):**
- Tag: "30-Layer Hiring Integrity Stack"
- H2: "30 Layers of Integrity. Zero Tolerance for Cheating."
- Sub: "Beyond basic webcam checks -- a full integrity stack that protects every assessment your candidates take."
- Phase subtitles: "Before Assessment", "During Assessment", "Post Assessment"
- Footer: "So every score your hiring team sees is actually earned, not engineered."

**Approach:** Create an inline `EmployerIntegritySection` component that reuses the same timeline design but with B2B copy. Remove the `AssessmentIntegritySection` import.

### C. "Your Data. Our Responsibility." (ComplianceSection)
**Current (generic):**
- Tag: "Enterprise Compliance"
- H2: "Your Data. Our Responsibility."
- Sub: "Enterprise-grade protection, ethical AI, and full regulatory compliance -- because trust isn't optional."
- Cards are generic compliance points

**New (B2B employer-focused):**
- Tag: "Employer Data Protection"
- H2: "Your Candidate Data. Our Responsibility."
- Sub: "Enterprise-grade protection for every assessment, candidate record, and hiring decision -- because your compliance is non-negotiable."
- Rewrite card descriptions to reference candidate data, assessment records, hiring decisions:
  - "GDPR-Ready Framework" -> "Full compliance with data protection standards for candidate PII and assessment records."
  - "Data Privacy Compliance" -> "End-to-end encryption for all candidate data, scores, and hiring reports."
  - "Secure Assessment Storage" -> "All assessment sessions, proctoring footage, and results encrypted at rest and in transit."
  - "Ethical AI Usage" -> "Transparent, bias-audited AI scoring models that meet EEOC and equal opportunity standards."
  - "Transparent Recording Policy" -> "Clear candidate disclosure of all monitoring, recording, and data retention practices."

**Approach:** Create an inline `EmployerComplianceSection` component. Remove the `ComplianceSection` import.

## 2. Spacing Fixes

### A. "Recognized by Industry Leaders" (after Hero)
- Current Hero: `pb-20 md:pb-28`
- Current SocialProofBar: `py-16 md:py-28` -- too much gap between Hero and this bar
- Fix: Reduce SocialProofBar top padding to `pt-8 md:pt-12 pb-16 md:pb-20` for a tighter connection to the Hero
- Remove `border-y border-border/50` top border to flow seamlessly from Hero

### B. "Questions Leaders Ask Before They Switch" (FAQ)
- Current FAQ: `py-20` -- consistent but feels disconnected
- Current SocialProofSection above it: `py-20 md:py-28`
- Fix: Reduce FAQ top padding to `pt-12 md:pt-16 pb-20` for tighter connection
- Add a subtle top border `border-t border-border/30` to visually separate without excessive whitespace

## 3. Mobile Responsiveness Fixes (all sections)

### Hero
- H1: `text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem]` (add `text-3xl` for small mobile)
- Subheading: `text-base md:text-lg` (reduce from `text-lg` on mobile)
- CTA buttons: `w-full sm:w-auto` to stack full-width on mobile
- Micro-proof bar: `flex-col sm:flex-row` and `gap-3 sm:gap-6` for stacking on mobile

### Who It's For
- H2: `text-2xl sm:text-3xl md:text-4xl` (add smaller mobile size)
- Cards grid: `grid-cols-1 sm:grid-cols-2` (already correct)

### Problem Section
- H2: `text-2xl sm:text-3xl md:text-4xl`
- Card title text: keep `text-sm` (already good for mobile)

### Solution Overview
- H2: `text-2xl sm:text-3xl md:text-4xl`
- Bullets: `text-sm` (already good)

### How It Works
- H2: `text-2xl sm:text-3xl md:text-4xl`
- Step icons: `h-20 w-20 sm:h-24 sm:w-24` (slightly smaller on mobile)
- Icon inside: `h-9 w-9 sm:h-11 sm:w-11`

### Score Trust Section
- Grid: already `lg:grid-cols-2` (stacks on mobile) -- good
- Score orb: `w-44 h-44 sm:w-52 sm:h-52 md:w-64 md:h-64` (smaller on mobile)
- Score text: `text-5xl sm:text-6xl md:text-[80px]`

### Platform Capabilities
- H2: `text-2xl sm:text-3xl md:text-4xl`
- Tab buttons: `text-xs sm:text-sm` for mobile

### Assessment Coverage
- H2: `text-2xl sm:text-3xl md:text-4xl`
- Grid: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3` (single column on very small screens)

### Employer Dashboard
- H2: `text-2xl sm:text-3xl md:text-4xl`

### Pricing
- H2: `text-2xl sm:text-3xl md:text-4xl`
- "Request Pricing" buttons: `w-full` on mobile

### Social Proof
- H2: `text-2xl sm:text-3xl md:text-4xl`
- Case snapshot cards: `grid-cols-1 sm:grid-cols-3` (stack on mobile)

### FAQ
- H2: `text-2xl sm:text-3xl md:text-4xl`
- Question text: `text-sm` (already fine)

### Final CTA
- H2: `text-xl sm:text-2xl md:text-3xl lg:text-5xl` (smaller on mobile)
- CTA buttons: `w-full sm:w-auto`
- Trust badges: `gap-3 sm:gap-6` and `text-[10px] sm:text-xs`

## Technical Approach
- All changes in `src/pages/ForEmployersV2.tsx`
- Remove 3 imports: `SocialProofBar`, `AssessmentIntegritySection`, `ComplianceSection`
- Add 3 inline sections: `EmployerSocialProofBar`, `EmployerIntegritySection`, `EmployerComplianceSection`
- Keep `SkillCategoriesSection` import (already industry-neutral, works for B2B)
- Responsive class updates across all 13+ inline sections
- Estimated net change: ~+150 lines (inline sections replace imports), ~80 lines of responsive class tweaks

