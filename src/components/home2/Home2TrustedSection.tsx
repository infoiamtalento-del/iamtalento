import { Building2 } from "lucide-react";
import SectionBadge from "@/components/ui/section-badge";

const BRAND_NAVY = "#002C66";
const HAIRLINE = "hsl(var(--border))";

const Home2TrustedSection = () => {
  return (
    <section className="py-16 md:py-20 bg-[#FBF4EB] text-foreground font-sans">
      <div className="container">
        {/* ── Top Heading ── */}
        <div className="text-center max-w-3xl mx-auto">
          <SectionBadge label="Trusted by Industry Leaders" icon={Building2} />

          <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight leading-[1.15] text-foreground mb-4">
            Trusted by organizations
            <br />
            building{" "}
            <span className="text-primary">high-performing teams.</span>
          </h2>

          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            From startups to global enterprises, organizations worldwide rely on TalentCIR
            <br className="hidden sm:inline" /> to make confident talent decisions every day.
          </p>
        </div>

        {/* ── 6x2 Full-Color Logo Grid with Vertical Column Dividers ── */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {/* Column 1: randstad + Alfar */}
          <div className="flex flex-col">
            <div className="h-[88px] flex items-center justify-center px-4">
              {/* randstad */}
              <svg viewBox="0 0 150 36" className="h-7 w-auto">
                <path
                  d="M12 22c0-5 3.5-8 8-8 2.2 0 4 1 5 2.6M20 22c0-5 3.5-8 8-8"
                  fill="none"
                  stroke="#2175D9"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                <text
                  x="35"
                  y="23"
                  fill="#2175D9"
                  fontSize="19"
                  fontWeight="700"
                  fontFamily="Inter, sans-serif"
                  letterSpacing="-0.02em"
                >
                  randstad
                </text>
              </svg>
            </div>
            <div className="h-[88px] flex items-center justify-center px-4">
              {/* Alfar */}
              <svg viewBox="0 0 120 40" className="h-8 w-auto">
                <path
                  d="M27 14c-6-4-14 0-14 7 0 6 5 10 11 9 4-.5 7-3 8-6"
                  fill="none"
                  stroke="#E1251B"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <text
                  x="22"
                  y="28"
                  fill="#E1251B"
                  fontSize="24"
                  fontWeight="800"
                  fontFamily="Georgia, serif"
                  letterSpacing="-0.03em"
                >
                  Alfar
                </text>
              </svg>
            </div>
          </div>

          {/* Column 2: LANDMARK GROUP + TASC */}
          <div
            className="flex flex-col border-l"
            style={{ borderColor: HAIRLINE }}
          >
            <div className="h-[88px] flex items-center justify-center px-4">
              {/* LANDMARK GROUP */}
              <svg viewBox="0 0 165 40" className="h-8 w-auto">
                <circle cx="18" cy="18" r="8" fill="none" stroke="#DFA635" strokeWidth="2.2" />
                <path d="M12 19c3-3 9-3 12 0" fill="none" stroke="#3B6E9C" strokeWidth="2" />
                <text
                  x="31"
                  y="20"
                  fill="#3B6E9C"
                  fontSize="13.5"
                  fontWeight="700"
                  fontFamily="Georgia, serif"
                  letterSpacing="0.03em"
                >
                  LANDMARK
                </text>
                <text
                  x="76"
                  y="30"
                  fill="#5882A8"
                  fontSize="9.5"
                  fontWeight="600"
                  fontFamily="Inter, sans-serif"
                  letterSpacing="0.08em"
                >
                  GROUP
                </text>
              </svg>
            </div>
            <div className="h-[88px] flex items-center justify-center px-4">
              {/* TASC */}
              <svg viewBox="0 0 130 40" className="h-8 w-auto">
                <text
                  x="18"
                  y="27"
                  fill="#0A4D68"
                  fontSize="24"
                  fontWeight="800"
                  fontFamily="Inter, sans-serif"
                  letterSpacing="0.03em"
                >
                  TASC
                </text>
                <path
                  d="M44 30c9 4 21 4 30 0"
                  fill="none"
                  stroke="#5CB85C"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Column 3: Benchmark + CARESTACK */}
          <div
            className="flex flex-col border-l max-sm:border-l-0 sm:max-lg:border-l"
            style={{ borderColor: HAIRLINE }}
          >
            <div className="h-[88px] flex items-center justify-center px-4">
              {/* Benchmark */}
              <svg viewBox="0 0 150 48" className="h-10 w-auto">
                <circle cx="52" cy="21" r="2.2" fill="#2A9D8F" />
                <circle cx="61" cy="18" r="2.6" fill="#52B788" />
                <circle cx="71" cy="15" r="3" fill="#8AB17D" />
                <circle cx="82" cy="13" r="3.4" fill="#E9C46A" />
                <circle cx="94" cy="12" r="3.8" fill="#F4A261" />
                <circle cx="107" cy="14" r="4.4" fill="#1D70B8" />
                <text
                  x="22"
                  y="36"
                  fill="#22272B"
                  fontSize="16.5"
                  fontWeight="700"
                  fontFamily="Inter, sans-serif"
                  letterSpacing="-0.01em"
                >
                  Benchmark
                </text>
              </svg>
            </div>
            <div className="h-[88px] flex items-center justify-center px-4">
              {/* CARESTACK */}
              <svg viewBox="0 0 160 36" className="h-7 w-auto">
                <text
                  x="10"
                  y="24"
                  fontSize="16"
                  fontWeight="800"
                  fontFamily="Inter, sans-serif"
                  letterSpacing="0.02em"
                >
                  <tspan fill="#2E9B4F">CARE</tspan>
                  <tspan fill="#14365D">STACK</tspan>
                </text>
              </svg>
            </div>
          </div>

          {/* Column 4: DELL Technologies + FINBOA */}
          <div
            className="flex flex-col border-l"
            style={{ borderColor: HAIRLINE }}
          >
            <div className="h-[88px] flex items-center justify-center px-4">
              {/* DELL Technologies */}
              <svg viewBox="0 0 130 46" className="h-10 w-auto">
                <text
                  x="25"
                  y="23"
                  fill="#0076CE"
                  fontSize="21"
                  fontWeight="900"
                  fontFamily="Inter, sans-serif"
                  letterSpacing="0.03em"
                >
                  DELL
                </text>
                <text
                  x="22"
                  y="36"
                  fill="#0076CE"
                  fontSize="10.5"
                  fontWeight="500"
                  fontFamily="Inter, sans-serif"
                >
                  Technologies
                </text>
              </svg>
            </div>
            <div className="h-[88px] flex items-center justify-center px-4">
              {/* FINBOA */}
              <svg viewBox="0 0 140 36" className="h-7 w-auto">
                <circle cx="16" cy="18" r="2" fill="#1CA69A" />
                <circle cx="21" cy="14" r="2" fill="#1CA69A" />
                <circle cx="21" cy="22" r="2" fill="#1CA69A" />
                <circle cx="26" cy="10" r="2.2" fill="#1D70B8" />
                <circle cx="26" cy="18" r="2.2" fill="#1CA69A" />
                <circle cx="26" cy="26" r="2.2" fill="#1D70B8" />
                <text
                  x="34"
                  y="24"
                  fill="#1E2A4A"
                  fontSize="17.5"
                  fontWeight="800"
                  fontFamily="Inter, sans-serif"
                  letterSpacing="0.03em"
                >
                  FINBOA
                </text>
              </svg>
            </div>
          </div>

          {/* Column 5: Reliance RETAIL + SG SCIENTIFIC GAMES */}
          <div
            className="flex flex-col border-l max-lg:border-l-0 sm:max-lg:border-l"
            style={{ borderColor: HAIRLINE }}
          >
            <div className="h-[88px] flex items-center justify-center px-4">
              {/* Reliance RETAIL */}
              <svg viewBox="0 0 130 50" className="h-10 w-auto">
                <circle cx="65" cy="12" r="6.5" fill="#1D428A" />
                <path d="M63 8c3 2 4 5 1 8-2-2-3-5-1-8z" fill="#ffffff" />
                <text
                  x="26"
                  y="32"
                  fill="#E31E24"
                  fontSize="17.5"
                  fontWeight="800"
                  fontFamily="Inter, sans-serif"
                  letterSpacing="-0.02em"
                >
                  Reliance
                </text>
                <text
                  x="51"
                  y="41"
                  fill="#1D428A"
                  fontSize="7"
                  fontWeight="700"
                  fontFamily="Inter, sans-serif"
                  letterSpacing="0.14em"
                >
                  RETAIL
                </text>
              </svg>
            </div>
            <div className="h-[88px] flex items-center justify-center px-4">
              {/* SG SCIENTIFIC GAMES */}
              <svg viewBox="0 0 130 48" className="h-10 w-auto">
                <text
                  x="22"
                  y="28"
                  fill="#003DA5"
                  fontSize="24"
                  fontWeight="900"
                  fontFamily="Inter, sans-serif"
                  letterSpacing="-0.03em"
                >
                  SG
                </text>
                {/* Colored mosaic grid */}
                <rect x="60" y="10" width="5" height="5" fill="#003DA5" />
                <rect x="66" y="10" width="5" height="5" fill="#E31E24" />
                <rect x="72" y="10" width="5" height="5" fill="#9CA3AF" />
                <rect x="60" y="16" width="5" height="5" fill="#F59E0B" />
                <rect x="66" y="16" width="5" height="5" fill="#10B981" />
                <rect x="72" y="16" width="5" height="5" fill="#9CA3AF" />
                <rect x="60" y="22" width="5" height="5" fill="#003DA5" />
                <rect x="66" y="22" width="5" height="5" fill="#6366F1" />
                <rect x="72" y="22" width="5" height="5" fill="#D1D5DB" />
                <text
                  x="22"
                  y="38"
                  fill="#1F2937"
                  fontSize="6.5"
                  fontWeight="800"
                  fontFamily="Inter, sans-serif"
                  letterSpacing="0.06em"
                >
                  SCIENTIFIC GAMES
                </text>
              </svg>
            </div>
          </div>

          {/* Column 6: TOYOTA + SPIRALYZE */}
          <div
            className="flex flex-col border-l"
            style={{ borderColor: HAIRLINE }}
          >
            <div className="h-[88px] flex items-center justify-center px-4">
              {/* TOYOTA */}
              <svg viewBox="0 0 150 36" className="h-7 w-auto">
                <ellipse cx="22" cy="18" rx="12" ry="7.5" fill="none" stroke="#EB0A1E" strokeWidth="2" />
                <ellipse cx="22" cy="18" rx="3.8" ry="7.2" fill="none" stroke="#EB0A1E" strokeWidth="1.8" />
                <ellipse cx="22" cy="14.5" rx="8.5" ry="3.2" fill="none" stroke="#EB0A1E" strokeWidth="1.8" />
                <text
                  x="39"
                  y="24"
                  fill="#EB0A1E"
                  fontSize="17.5"
                  fontWeight="800"
                  fontFamily="Inter, sans-serif"
                  letterSpacing="0.05em"
                >
                  TOYOTA
                </text>
              </svg>
            </div>
            <div className="h-[88px] flex items-center justify-center px-4">
              {/* SPIRALYZE */}
              <svg viewBox="0 0 155 36" className="h-7 w-auto">
                <path
                  d="M16 14l7-4 7 4M16 19l7-4 7 4M16 24l7-4 7 4"
                  fill="none"
                  stroke="#1E88E5"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="14"
                  y="8"
                  width="18"
                  height="20"
                  rx="3"
                  fill="none"
                  stroke="#1E88E5"
                  strokeWidth="1.6"
                />
                <text
                  x="38"
                  y="22.5"
                  fill="#2997EE"
                  fontSize="13.5"
                  fontWeight="800"
                  fontFamily="Inter, sans-serif"
                  letterSpacing="0.06em"
                >
                  SPIRALYZE
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* ── 3-Column Stats Band ── */}
        <div
          className="mt-8 grid grid-cols-1 md:grid-cols-3 border-t border-b"
          style={{ borderColor: HAIRLINE }}
        >
          {/* Stat 1 */}
          <div className="flex items-center gap-5 py-8 px-4 md:px-7">
            <div
              className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="9" cy="8" r="3" />
                <path d="M4 18v-1a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1" strokeLinecap="round" />
                <path d="M15.5 5.5a2.5 2.5 0 0 1 0 5" strokeLinecap="round" />
                <path d="M18.5 18v-1a3.5 3.5 0 0 0-2.5-3.35" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="text-3xl md:text-4xl leading-none font-bold font-display text-foreground tracking-tight">
                5.3M+
              </div>
              <div
                style={{ color: BRAND_NAVY, letterSpacing: "0.09em" }}
                className="mt-2 text-xs font-bold uppercase"
              >
                ASSESSMENTS CONDUCTED
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Empowering millions of careers every year
              </p>
            </div>
          </div>

          {/* Stat 2 */}
          <div
            className="flex items-center gap-5 py-8 px-4 md:px-9 border-t md:border-t-0 md:border-l"
            style={{ borderColor: HAIRLINE }}
          >
            <div
              className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <path d="M10 12h4" />
                <path d="M9 7v13M15 7v13" strokeOpacity="0.45" />
              </svg>
            </div>
            <div>
              <div className="text-3xl md:text-4xl leading-none font-bold font-display text-foreground tracking-tight">
                5,000+
              </div>
              <div
                style={{ color: BRAND_NAVY, letterSpacing: "0.09em" }}
                className="mt-2 text-xs font-bold uppercase"
              >
                CUSTOMERS WORLDWIDE
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                From startups to global enterprises
              </p>
            </div>
          </div>

          {/* Stat 3 */}
          <div
            className="flex items-center gap-5 py-8 px-4 md:px-9 border-t md:border-t-0 md:border-l"
            style={{ borderColor: HAIRLINE }}
          >
            <div
              className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
                <ellipse cx="12" cy="12" rx="4" ry="9" />
                <path d="M3.5 9h17M3.5 15h17" />
              </svg>
            </div>
            <div>
              <div className="text-3xl md:text-4xl leading-none font-bold font-display text-foreground tracking-tight">
                55+
              </div>
              <div
                style={{ color: BRAND_NAVY, letterSpacing: "0.09em" }}
                className="mt-2 text-xs font-bold uppercase"
              >
                COUNTRIES
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                A truly global footprint
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home2TrustedSection;
