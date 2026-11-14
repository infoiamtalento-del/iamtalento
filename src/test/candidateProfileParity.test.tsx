import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { LiveProfile } from "@/services/candidate/profile";
import { PROFILE_CHAR_LIMITS } from "@/components/profile/profileFormatters";

const profileSvc = vi.hoisted(() => ({
  loadFullLiveProfile: vi.fn(),
  patchLiveProfileQuick: vi.fn(),
  persistBannerImmediate: vi.fn(),
  persistProfilePhotoImmediate: vi.fn(),
  uploadBannerPhotoFile: vi.fn(),
  uploadProfilePhotoFile: vi.fn(),
  uploadProjectImageFile: vi.fn(),
  uploadResumeFile: vi.fn(),
  getResumeSignedUrl: vi.fn(),
}));

vi.mock("@/services/candidate/profile", async (orig) => ({
  ...(await orig<typeof import("@/services/candidate/profile")>()),
  ...profileSvc,
}));

import { normalizeLiveProfile } from "@/services/candidate/profile";
import { LiveCandidateProfileView } from "@/components/pro/live/LiveCandidateProfileView";
import { ProProfileView } from "@/components/pro/ProProfileView";
import { DEFAULT_USERS } from "@/data/proData";

const sampleLiveProfile: LiveProfile = {
  profile: {
    id: "user-123",
    iam_talento_id: "IAT-991204",
    email: "priya.nair@example.com",
    full_name: "Priya Nair",
    phone: "+91 98765 00112",
    headline: "Lead Data & ML Engineer",
    sub_headline: "Real-Time Feature Stores & GenAI",
    about: "Designing low-latency ML platforms serving 40M+ daily predictions.",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    job_role: "Lead ML Engineer",
    company: "DataPulse Labs",
    industry: "Data Science & AI",
    years_of_experience: 6,
    experience_level: "senior",
    open_to_work: true,
    open_for_freelance: true,
    preferred_locations: ["Hyderabad", "Remote"],
    areas_of_expertise: ["MLOps", "PyTorch", "Streaming Data"],
    interests: ["Agentic Workflows", "Graph Neural Networks"],
    tools: ["Kubernetes", "MLflow", "Spark", "Airflow"],
    hobbies: ["Classical Violin", "Bouldering"],
    preferred_salary_range: "₹32–42 LPA",
    notice_period: "30 Days",
    availability_status: "Full-time",
    linkedin_url: "https://linkedin.com/in/priya-nair-ml",
    github_url: "https://github.com/priya-nair-ml",
    portfolio_url: "https://priyanair.ai",
    kaggle_url: "https://kaggle.com/priyanair",
    behance_url: null,
    video_intro_url: "https://youtube.com/watch?v=abc123xyz",
    video_pitch: "Hi, I am Priya — I scale production ML pipelines.",
    profile_photo_url: "https://cdn.example.com/priya/avatar.jpg",
    banner_photo_url: "https://cdn.example.com/priya/banner.jpg",
    resume_url: null,
    resume_path: null,
    portfolio_slug: "priya-nair",
    profile_visibility: "public",
    notification_prefs: { email: true },
    profile_completion: 96,
    readiness: 91,
    referral_code: "REFPRIYA",
    referral_claimed: false,
  },
  skills: [
    { name: "PyTorch", level: "expert", category: "technical", years: 5, verified: true },
    { name: "Python", level: "expert", category: "technical", years: 6, verified: true },
    { name: "Apache Spark", level: "advanced", category: "technical", years: 4, verified: false },
  ],
  experiences: [
    {
      title: "Lead ML Engineer",
      company: "DataPulse Labs",
      location: "Hyderabad, India",
      start: "2022-01-01",
      end: "Present",
      description: "Cut inference p99 latency from 180ms to 28ms.",
      tools: ["PyTorch", "Triton", "Kubernetes"],
    },
  ],
  educations: [
    {
      institution: "IIIT Hyderabad",
      degree: "M.Tech",
      field_of_study: "Machine Learning",
      start_year: "2018",
      year: "2020",
      grade: "9.5 CGPA",
    },
  ],
  certifications: [
    {
      name: "Google Professional Machine Learning Engineer",
      verified: true,
      issuer: "Google Cloud",
      date: "2024-03-10",
      credential_url: "https://cloud.google.com/certification/verify",
    },
  ],
  projects: [
    {
      title: "VectorStream Feature Store",
      role: "Architect",
      description: "Sub-10ms online/offline feature store built on Redis & DuckDB.",
      url: "https://vectorstream.ai",
      github_url: "https://github.com/priya-nair-ml/vectorstream",
      image_url: "https://cdn.example.com/priya/vectorstream.png",
      tools: "Python, Rust, DuckDB",
      tools_list: ["Python", "Rust", "DuckDB"],
      impact: "Adopted by 14 product squads",
    },
  ],
  awards: [
    {
      title: "Kaggle Competitions Master",
      organization: "Kaggle",
      date: "2023-08-01",
      description: "2 Gold and 4 Silver medals in tabular & NLP tracks.",
    },
  ],
  languages: [
    { name: "English", level: "Fluent" },
    { name: "Malayalam", level: "Native" },
  ],
  shell_state: {
    arjun_profile_v1: {
      expertise_cards: [
        { title: "Real-Time MLOps", sub: "Triton & Feature Stores" },
        { title: "LLM Evaluation", sub: "Guardrails & RAG pipelines" },
        { title: "Distributed Compute", sub: "Spark & Ray clusters" },
        { title: "Team Leadership", sub: "Mentoring 12 ML engineers" },
      ],
    },
  },
  verification: {
    profile_status: "verified",
    identity_status: "verified",
    face_match: "matched",
    rejection_reason: null,
    submitted_at: "2026-01-10T00:00:00Z",
  },
  latest_cir: {
    id: "cir-1",
    score: 91,
    tier: "Job Ready+",
    percentile: 96,
  },
};

describe("Candidate Arjun-Mehta Profile Parity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    profileSvc.loadFullLiveProfile.mockResolvedValue(sampleLiveProfile);
    profileSvc.getResumeSignedUrl.mockResolvedValue(null);
    profileSvc.uploadBannerPhotoFile.mockResolvedValue("https://cdn.example.com/priya/new-banner.jpg?v=200");
    profileSvc.persistBannerImmediate.mockImplementation(async (url: string) => ({
      ...sampleLiveProfile,
      profile: {
        ...sampleLiveProfile.profile,
        banner_photo_url: url,
      },
      shell_state: {
        ...sampleLiveProfile.shell_state,
        arjun_profile_v1: {
          ...(sampleLiveProfile.shell_state?.arjun_profile_v1 ?? {}),
          banner_photo_url: url,
          banner_reset: !url,
        },
      },
    }));
    profileSvc.patchLiveProfileQuick.mockImplementation(async (live, patch) => ({
      ...live,
      profile: {
        ...live.profile,
        ...(patch.bannerPhotoUrl !== undefined ? { banner_photo_url: patch.bannerPhotoUrl } : {}),
      },
    }));
  });

  it("renders the Arjun-Mehta demo-dashboard layout for a live candidate with immediate cover banner persistence, all 11 tabs, and zero demo leakage", async () => {
    const onToast = vi.fn();
    const { container } = render(
      <MemoryRouter>
        <LiveCandidateProfileView embedded onNavigate={vi.fn()} onToast={onToast} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Priya Nair" })).toBeInTheDocument();
    });

    // Uses the exact .demo-dashboard CSS layout + live alignment modifier
    expect(container.querySelector(".demo-dashboard.dp-live-profile")).toBeTruthy();

    // Never leaks Arjun Mehta demo strings into a real signed-in user's profile
    expect(container.textContent).not.toContain("Arjun Mehta");
    expect(container.textContent).not.toContain("TechNova Solutions");

    // Cover banner <img /> + Change Banner button + visually hidden file upload input
    const bannerImg = screen.getByAltText("Priya Nair cover banner") as HTMLImageElement;
    expect(bannerImg.src).toBe("https://cdn.example.com/priya/banner.jpg");
    expect(screen.getByRole("button", { name: /Change Banner/i })).toBeInTheDocument();

    // Designation, sub-headline, availability statuses
    expect(screen.getByText("Lead Data & ML Engineer")).toBeInTheDocument();
    expect(screen.getByText("Real-Time Feature Stores & GenAI")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Open to Work/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Open for Freelancing/i })).toBeInTheDocument();

    // All 11 section tabs present in sticky navigation
    const nav = screen.getByRole("navigation", { name: /Profile sections/i });
    for (const label of [
      "About Me",
      "Work Experience",
      "Skills",
      "Tools",
      "Projects",
      "Education",
      "Certifications",
      "Awards",
      "Languages",
      "Hobbies",
      "Interests",
    ]) {
      expect(nav.textContent).toContain(label);
    }

    // Rich child sections rendered accurately
    expect(screen.getByText("Real-Time MLOps")).toBeInTheDocument();
    expect(screen.getByText("VectorStream Feature Store")).toBeInTheDocument();
    expect(screen.getByText("IIIT Hyderabad")).toBeInTheDocument();
    expect(screen.getByText(/9\.5 CGPA/)).toBeInTheDocument();
    expect(screen.getByText("Google Professional Machine Learning Engineer")).toBeInTheDocument();
    expect(screen.getByText("Kaggle Competitions Master")).toBeInTheDocument();
    expect(screen.getByText("Classical Violin")).toBeInTheDocument();
    expect(screen.getByText("Agentic Workflows")).toBeInTheDocument();

    // Uploading a new banner image persists immediately via uploadBannerPhotoFile + persistBannerImmediate
    const bannerInput = screen.getByLabelText("Upload cover banner image") as HTMLInputElement;
    const fakeBanner = new File(["banner-bytes"], "office-banner.png", { type: "image/png" });
    fireEvent.change(bannerInput, { target: { files: [fakeBanner] } });

    await waitFor(() => {
      expect(profileSvc.uploadBannerPhotoFile).toHaveBeenCalledWith(fakeBanner, "user-123");
      expect(profileSvc.persistBannerImmediate).toHaveBeenCalledWith(
        "https://cdn.example.com/priya/new-banner.jpg?v=200",
        "user-123"
      );
      expect(onToast).toHaveBeenCalledWith("Cover banner image updated!");
      expect((screen.getByAltText("Priya Nair cover banner") as HTMLImageElement).src).toBe(
        "https://cdn.example.com/priya/new-banner.jpg?v=200"
      );
    });
  });

  it("preserves changed banners across refresh and honors explicit banner resets in normalizeLiveProfile", () => {
    // 1. User changes banner: overlay holds new URL while profile column still holds v1 or empty string
    const changedBannerProfile: LiveProfile = {
      ...sampleLiveProfile,
      profile: {
        ...sampleLiveProfile.profile,
        banner_photo_url: "https://cdn.example.com/priya/old-banner-v1.jpg",
      },
      shell_state: {
        arjun_profile_v1: {
          banner_photo_url: "https://cdn.example.com/priya/changed-banner-v2.jpg?v=999",
          banner_reset: false,
        },
      },
    };
    expect(normalizeLiveProfile(changedBannerProfile).bannerPhotoUrl).toBe(
      "https://cdn.example.com/priya/changed-banner-v2.jpg?v=999"
    );

    // 2. User explicitly resets banner: banner_reset=true overrides stale profile.banner_photo_url
    const resetBannerProfile: LiveProfile = {
      ...sampleLiveProfile,
      profile: {
        ...sampleLiveProfile.profile,
        banner_photo_url: "https://cdn.example.com/priya/old-banner-v1.jpg",
      },
      shell_state: {
        arjun_profile_v1: {
          banner_photo_url: "",
          banner_reset: true,
        },
      },
    };
    expect(normalizeLiveProfile(resetBannerProfile).bannerPhotoUrl).toBe("");
  });

  it("formats non-technical marketing profiles cleanly with menu-aligned container width, smart title casing, bullet lists, and zero developer filler", async () => {
    const mahiProfile: LiveProfile = {
      ...sampleLiveProfile,
      profile: {
        ...sampleLiveProfile.profile,
        id: "user-mahi",
        full_name: "Mahi Rakhecha",
        headline: "Digital Marketing Executive",
        sub_headline: null,
        industry: "Marketing & Growth",
        job_role: "Digital Marketing Executive",
        company: "Thesuper30",
        city: "CHENNAI",
        state: "",
        country: "",
        about:
          "I am a Digital Marketing Executive with experience in planning, managing, and executing digital marketing campaigns to improve brand awareness, reach target audiences, and drive business growth.",
        areas_of_expertise: ["performance marketer", "social media manager"],
        tools: ["Google Ads", "Meta Ads Manager"],
      },
      skills: [
        { name: "performance marketing", level: "advanced", category: "technical", verified: false },
        { name: "seo", level: "intermediate", category: "technical", verified: false },
      ],
      experiences: [
        {
          title: "Digital Marketing Intern",
          company: "Thesuper30",
          location: "CHENNAI",
          start: "",
          end: "Present",
          description:
            "- Assisted in planning and executing digital marketing campaigns to improve brand awareness and online engagement.\n- Supported social media management, content creation, and digital marketing strategies.",
          tools: [],
        },
      ],
      shell_state: {
        arjun_profile_v1: {
          focus_badges: ["performance marketer", "social media manager"],
          // Uncustomized legacy developer defaults from an older wizard session
          expertise_cards: [
            { title: "End-to-End Development", sub: "Frontend to Cloud" },
            { title: "Cloud & DevOps", sub: "AWS · Docker · CI/CD" },
            { title: "AI/ML Integration", sub: "Python · LLMs" },
            { title: "Product Thinking", sub: "User-first mindset" },
          ],
        },
      },
    };

    profileSvc.loadFullLiveProfile.mockResolvedValueOnce(mahiProfile);

    const { container } = render(
      <MemoryRouter>
        <LiveCandidateProfileView embedded={false} onNavigate={vi.fn()} onToast={vi.fn()} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Mahi Rakhecha" })).toBeInTheDocument();
    });

    // Standalone profile uses .container on <main> so its width aligns with <Navbar />
    expect(container.querySelector(".demo-dashboard.dp-standalone.dp-live-profile main.container")).toBeTruthy();

    // ALL-CAPS city normalized to clean Title Case
    expect(screen.getAllByText("Chennai").length).toBeGreaterThan(0);
    expect(container.textContent).not.toContain("CHENNAI");

    // Focus badges & skills formatted in Title Case / Uppercase Acronyms
    expect(screen.getByText("Performance Marketer")).toBeInTheDocument();
    expect(screen.getByText("Social Media Manager")).toBeInTheDocument();
    expect(screen.getAllByText("SEO").length).toBeGreaterThan(0);

    // Zero developer-default or awkward filler strings on a marketing profile
    expect(container.textContent).not.toContain("End-to-End Development");
    expect(container.textContent).not.toContain("Cloud & DevOps");
    expect(container.textContent).not.toContain("Modern Tooling");
    expect(container.textContent).not.toContain("Paired with");

    // Missing start date with "Present" renders "Current Role" instead of an orphan "Present"
    expect(screen.getByText("Current Role")).toBeInTheDocument();

    // Hyphenated lines render as proper <ul><li> bullets without raw "- " prefix
    const bulletItems = container.querySelectorAll("ul.dp-bullet-list li");
    expect(bulletItems.length).toBe(2);
    expect(bulletItems[0].textContent).toBe(
      "Assisted in planning and executing digital marketing campaigns to improve brand awareness and online engagement."
    );
  });

  it("enforces character limits (maxLength + live counter) inside Quick-Edit modals", async () => {
    render(
      <MemoryRouter>
        <LiveCandidateProfileView embedded onNavigate={vi.fn()} onToast={vi.fn()} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Priya Nair" })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Edit Header/i }));

    const nameInput = await screen.findByLabelText(/Full Name/i);
    expect(nameInput).toHaveAttribute("maxLength", String(PROFILE_CHAR_LIMITS.fullName));

    const headlineInput = screen.getByLabelText(/Designation \/ Headline/i);
    expect(headlineInput).toHaveAttribute("maxLength", String(PROFILE_CHAR_LIMITS.headline));

    // Live character count rendered in label row ("10/80" for "Priya Nair")
    expect(screen.getByText(`10/${PROFILE_CHAR_LIMITS.fullName}`)).toBeInTheDocument();
  });

  it("keeps the demo candidate profile untouched when isLive is false", () => {
    const { container } = render(
      <MemoryRouter>
        <ProProfileView
          user={DEFAULT_USERS[0]}
          isLive={false}
          onSaveProfile={vi.fn()}
          onToast={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(container.querySelector(".demo-dashboard")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Arjun Mehta" })).toBeInTheDocument();
  });
});
