import type { ReactNode } from "react";
import {
  Award,
  BadgeCheck,
  BarChart3,
  Briefcase,
  Camera,
  Check,
  Clock,
  Compass,
  Cpu,
  Eye,
  FileCheck2,
  Fingerprint,
  Globe,
  Lightbulb,
  Lock,
  MessageSquareText,
  Mic,
  Monitor,
  Quote,
  ScanFace,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Wifi,
  BrainCircuit,
} from "lucide-react";
import { siteLogo } from "@/assets/logo";
import avatar from "@/assets/demo-avatar.jpg";
import proctorThumb from "@/assets/assessment-video-thumb.jpg";
import reviewer from "@/assets/experts/male-1.jpg";
import {
  CIR_ANSWER_MAP,
  CIR_CANDIDATE,
  CIR_DIFFICULTY,
  CIR_HEADLINE,
  CIR_PACE,
  CIR_PLAN,
  CIR_PROCTORING,
  CIR_ROLES,
  CIR_ROUNDS,
  CIR_SKILLS,
  CIR_TESTS,
  INK,
  LINE,
  RED,
} from "./sampleCirData";

export const PAGE_W = 794;
export const PAGE_H = 1123;
export const CIR_TOTAL_PAGES = 7;

/* ------------------------------------------------------------------ */
/* Shared building blocks                                              */
/* ------------------------------------------------------------------ */

const PageShell = ({ n, section, children }: { n: number; section: string; children: ReactNode }) => (
  <section
    data-cir-page
    style={{ width: PAGE_W, height: PAGE_H }}
    className="relative flex shrink-0 flex-col overflow-hidden bg-white text-slate-900"
  >
    <header className="flex items-center justify-between px-10 pb-3 pt-7">
      <img src={siteLogo.url} alt="I Am Talento" className="h-8 w-auto object-contain" />
      <div className="flex items-center gap-3 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        <span>{section}</span>
        <span className="h-3 w-px bg-slate-300" />
        <span className="text-primary">Sample report</span>
      </div>
    </header>
    <div className="flex min-h-0 flex-1 flex-col px-10 [&>*]:shrink-0">{children}</div>
    <footer className="mx-10 mt-3 flex items-center justify-between border-t border-slate-200 py-3.5 text-[10px] text-slate-400">
      <span>{CIR_CANDIDATE.reportId} · Confidential · Illustrative data for demonstration</span>
      <span className="font-semibold text-slate-500">
        Page {n} of {CIR_TOTAL_PAGES}
      </span>
    </footer>
  </section>
);

const SectionTitle = ({ no, eyebrow, title, sub }: { no: string; eyebrow: string; title: string; sub?: string }) => (
  <div className="mb-4">
    <div className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.14em] text-primary">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-primary text-[10px] text-white">{no}</span>
      {eyebrow}
    </div>
    <h2 className="mt-2 font-display text-[25px] font-bold leading-[1.15] text-slate-900">{title}</h2>
    {sub && <p className="mt-1.5 max-w-[580px] text-[12px] leading-relaxed text-slate-500">{sub}</p>}
  </div>
);

type Tone = "white" | "soft" | "dark" | "red";
const toneClass: Record<Tone, string> = {
  white: "border border-slate-200 bg-white text-slate-900",
  soft: "border border-slate-200 bg-slate-50 text-slate-900",
  dark: "bg-slate-900 text-white",
  red: "bg-primary text-white",
};

const Tile = ({ tone = "white", className = "", children }: { tone?: Tone; className?: string; children: ReactNode }) => (
  <div className={`relative overflow-hidden rounded-2xl p-4 ${toneClass[tone]} ${className}`}>{children}</div>
);

const Label = ({ children, light }: { children: ReactNode; light?: boolean }) => (
  <p className={`text-[10px] font-bold uppercase tracking-[0.12em] ${light ? "text-white/70" : "text-slate-400"}`}>{children}</p>
);

const IconTile = ({ icon: Icon, light }: { icon: typeof Check; light?: boolean }) => (
  <span
    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
      light ? "bg-white/15 text-white" : "bg-primary/10 text-primary"
    }`}
  >
    <Icon className="h-4 w-4" />
  </span>
);

const Ring = ({
  value,
  size = 120,
  stroke = 12,
  color = RED,
  track = "#F1F5F9",
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  children?: ReactNode;
}) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const mid = size / 2;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${mid} ${mid})`}>
          <circle cx={mid} cy={mid} r={r} fill="none" stroke={track} strokeWidth={stroke} />
          <circle
            cx={mid}
            cy={mid}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${(c * value) / 100} ${c}`}
          />
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
};

const Bar = ({
  value,
  market,
  color = RED,
  height = 8,
  track = "#F1F5F9",
}: {
  value: number;
  market?: number;
  color?: string;
  height?: number;
  track?: string;
}) => (
  <div className="relative w-full rounded-full" style={{ height, background: track }}>
    <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
    {market !== undefined && (
      <span
        className="absolute rounded-full bg-slate-900"
        style={{ left: `${market}%`, top: -3, width: 2, height: height + 6 }}
      />
    )}
  </div>
);

const Pill = ({ children, tone = "slate" }: { children: ReactNode; tone?: "slate" | "red" | "green" | "amber" | "white" }) => {
  const map = {
    slate: "bg-slate-100 text-slate-600",
    red: "bg-primary text-white",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    white: "bg-white/15 text-white",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${map[tone]}`}>
      {children}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Charts and illustrations                                            */
/* ------------------------------------------------------------------ */

const Radar = ({ size = 330 }: { size?: number }) => {
  const n = CIR_SKILLS.length;
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 52;
  const point = (i: number, v: number, radius = R) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [cx + Math.cos(a) * radius * (v / 100), cy + Math.sin(a) * radius * (v / 100)] as const;
  };
  const poly = (key: "score" | "market" | "top") =>
    CIR_SKILLS.map((s, i) => point(i, s[key]).join(",")).join(" ");
  const ring = (v: number) => CIR_SKILLS.map((_, i) => point(i, v).join(",")).join(" ");
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {[25, 50, 75, 100].map((v) => (
          <polygon key={v} points={ring(v)} fill={v === 100 ? "#F8FAFC" : "none"} stroke={LINE} strokeWidth={1} />
        ))}
        {CIR_SKILLS.map((_, i) => {
          const [x, y] = point(i, 100);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={LINE} strokeWidth={1} />;
        })}
        <polygon points={poly("top")} fill="none" stroke="#94A3B8" strokeWidth={1.5} strokeDasharray="4 4" />
        <polygon points={poly("market")} fill="#CBD5E1" fillOpacity={0.45} stroke="#94A3B8" strokeWidth={1.5} />
        <polygon points={poly("score")} fill={RED} fillOpacity={0.22} stroke={RED} strokeWidth={2.5} strokeLinejoin="round" />
        {CIR_SKILLS.map((s, i) => {
          const [x, y] = point(i, s.score);
          return <circle key={s.name} cx={x} cy={y} r={4.5} fill="#fff" stroke={RED} strokeWidth={2.5} />;
        })}
      </svg>
      {CIR_SKILLS.map((s, i) => {
        const [x, y] = point(i, 100, R + 30);
        return (
          <div
            key={s.name}
            className="absolute text-center"
            style={{ left: x, top: y, transform: "translate(-50%, -50%)", width: 84 }}
          >
            <p className="text-[10.5px] font-semibold leading-tight text-slate-700">{s.short}</p>
            <p className="font-display text-[13px] font-bold leading-tight text-primary">{s.score}</p>
          </div>
        );
      })}
    </div>
  );
};

const BellCurve = ({ marker = 82, width = 300, height = 120 }: { marker?: number; width?: number; height?: number }) => {
  const mean = 62;
  const sd = 14;
  const pdf = (x: number) => Math.exp(-((x - mean) ** 2) / (2 * sd * sd));
  const px = (x: number) => (x / 100) * width;
  const py = (x: number) => height - 12 - pdf(x) * (height - 30);
  const pts: [number, number][] = [];
  for (let x = 0; x <= 100; x += 1) pts.push([px(x), py(x)]);
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const base = height - 12;
  const full = `${line} L${width},${base} L0,${base} Z`;
  const leftPts = pts.filter((_, i) => i <= marker);
  const left =
    leftPts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ") +
    ` L${px(marker)},${base} L0,${base} Z`;
  return (
    <div className="relative" style={{ width, height: height + 8 }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <path d={full} fill="#E2E8F0" />
        <path d={left} fill={RED} fillOpacity={0.9} />
        <line x1={px(marker)} y1={py(marker) - 10} x2={px(marker)} y2={base} stroke={INK} strokeWidth={1.5} strokeDasharray="3 3" />
        <circle cx={px(marker)} cy={py(marker)} r={5} fill="#fff" stroke={INK} strokeWidth={2.5} />
        <line x1={0} y1={base} x2={width} y2={base} stroke="#94A3B8" strokeWidth={1} />
      </svg>
      <div
        className="absolute whitespace-nowrap rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white"
        style={{ left: px(marker), top: 0, transform: "translateX(-50%)" }}
      >
        You: {marker}
      </div>
      <div className="absolute bottom-0 left-0 text-[9px] text-slate-400">0</div>
      <div className="absolute bottom-0 right-0 text-[9px] text-slate-400">100</div>
      <div
        className="absolute bottom-0 text-[9px] text-slate-400"
        style={{ left: px(mean), transform: "translateX(-50%)" }}
      >
        avg {mean}
      </div>
    </div>
  );
};

const QrCode = ({ size = 112 }: { size?: number }) => {
  const N = 25;
  let seed = 48213;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const cells: { x: number; y: number }[] = [];
  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) if (!inFinder(x, y) && rand() > 0.52) cells.push({ x, y });
  const u = size / N;
  const finder = (ox: number, oy: number) => (
    <g key={`${ox}-${oy}`}>
      <rect x={ox * u} y={oy * u} width={7 * u} height={7 * u} fill={INK} />
      <rect x={(ox + 1) * u} y={(oy + 1) * u} width={5 * u} height={5 * u} fill="#fff" />
      <rect x={(ox + 2) * u} y={(oy + 2) * u} width={3 * u} height={3 * u} fill={RED} />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="#fff" />
      {cells.map((c) => (
        <rect key={`${c.x}-${c.y}`} x={c.x * u} y={c.y * u} width={u} height={u} fill={INK} />
      ))}
      {finder(0, 0)}
      {finder(N - 7, 0)}
      {finder(0, N - 7)}
    </svg>
  );
};

const CoverArt = () => (
  <svg className="absolute inset-0" width={PAGE_W} height={500} viewBox={`0 0 ${PAGE_W} 500`} fill="none">
    {[70, 130, 190, 250, 310].map((r, i) => (
      <circle key={r} cx={690} cy={110} r={r} stroke="#fff" strokeOpacity={0.22 - i * 0.03} strokeWidth={1.5} />
    ))}
    <circle cx={690} cy={110} r={16} fill="#fff" fillOpacity={0.9} />
    <g transform="translate(0 -120)">
    {Array.from({ length: 8 }).map((_, row) =>
      Array.from({ length: 10 }).map((__, col) => (
        <circle key={`${row}-${col}`} cx={500 + col * 22} cy={290 + row * 22} r={2} fill="#fff" fillOpacity={0.28} />
      ))
    )}
    {[40, 68, 54, 96, 78, 124, 110].map((h, i) => (
      <rect key={i} x={560 + i * 30} y={440 - h} width={18} height={h} rx={4} fill="#fff" fillOpacity={0.16 + i * 0.03} />
    ))}
    <polyline
      points="560,420 590,392 620,400 650,350 680,362 710,310 740,296"
      stroke="#fff"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.9}
    />
    {[
      [560, 420],
      [590, 392],
      [620, 400],
      [650, 350],
      [680, 362],
      [710, 310],
      [740, 296],
    ].map(([x, y]) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r={4.5} fill="#fff" />
    ))}
    </g>
  </svg>
);

/* ------------------------------------------------------------------ */
/* Page 1: Cover                                                       */
/* ------------------------------------------------------------------ */

const contents = [
  ["02", "Executive summary"],
  ["03", "Test results overview"],
  ["04", "Digital Marketing deep dive"],
  ["05", "Accuracy and time analytics"],
  ["06", "Proctoring and integrity"],
  ["07", "Next steps and verification"],
];

const CoverPage = () => (
  <section
    data-cir-page
    style={{ width: PAGE_W, height: PAGE_H }}
    className="relative flex shrink-0 flex-col overflow-hidden bg-white text-slate-900"
  >
    <div className="relative bg-primary" style={{ height: 470 }}>
      <CoverArt />
      <div className="relative flex items-center justify-between px-10 pt-9">
        <span className="rounded-xl bg-white px-4 py-2.5">
          <img src={siteLogo.url} alt="I Am Talento" className="h-8 w-auto object-contain" />
        </span>
        <span className="rounded-full border border-white/60 px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-white">
          Sample report
        </span>
      </div>
      <div className="relative px-10 pt-14">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/80">Career Intelligence Report</p>
        <h1 className="mt-4 font-display text-[56px] font-bold leading-[1.02] text-white">
          Industry
          <br />
          Readiness Report
        </h1>
        <p className="mt-5 max-w-[420px] text-[14px] leading-relaxed text-white/85">
          {CIR_CANDIDATE.assessment}. Four proctored tests, scored and verified.
        </p>
      </div>
    </div>

    <div className="relative z-10 -mt-20 px-10">
      <div className="flex items-center gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.35)]">
        <img src={avatar} alt={CIR_CANDIDATE.name} className="h-[104px] w-[104px] shrink-0 rounded-2xl object-cover" />
        <div className="min-w-0 flex-1">
          <Label>Candidate</Label>
          <p className="font-display text-[28px] font-bold leading-tight text-slate-900">{CIR_CANDIDATE.name}</p>
          <p className="mt-0.5 text-[13px] text-slate-500">
            {CIR_CANDIDATE.role} · {CIR_CANDIDATE.experience} · {CIR_CANDIDATE.location}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Pill>{CIR_CANDIDATE.reportId}</Pill>
            <Pill>Issued {CIR_CANDIDATE.issued}</Pill>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-center gap-1.5 border-l border-slate-200 pl-5 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Verified</p>
          <p className="text-[10px] text-slate-400">Proctored</p>
        </div>
      </div>
    </div>

    <div className="grid flex-1 grid-cols-12 gap-3.5 px-10 pb-5 pt-5" style={{ gridTemplateRows: "auto auto 1fr" }}>
      <Tile tone="dark" className="col-span-5 flex items-center gap-4">
        <Ring value={CIR_HEADLINE.score} size={118} stroke={11} color={RED} track="rgba(255,255,255,0.14)">
          <span className="font-display text-[34px] font-bold leading-none text-white">{CIR_HEADLINE.score}</span>
          <span className="text-[10px] text-white/60">of 100</span>
        </Ring>
        <div>
          <Label light>Readiness score</Label>
          <p className="mt-1 font-display text-[19px] font-bold leading-tight text-white">{CIR_HEADLINE.tier}</p>
          <p className="mt-1 text-[11px] leading-snug text-white/60">Ready for entry to mid-level roles</p>
        </div>
      </Tile>
      <Tile tone="red" className="col-span-3 flex flex-col justify-between">
        <Label light>Percentile</Label>
        <div>
          <p className="whitespace-nowrap font-display text-[36px] font-bold leading-none text-white">Top 9%</p>
          <p className="mt-3 text-[11px] text-white/80">{CIR_HEADLINE.percentile}th percentile of 12,480</p>
        </div>
      </Tile>
      <div className="col-span-4 grid grid-rows-2 gap-3.5">
        <Tile tone="soft" className="flex items-center justify-between !py-3">
          <div>
            <Label>Accuracy</Label>
            <p className="font-display text-[28px] font-bold leading-none text-slate-900">{CIR_HEADLINE.accuracy}%</p>
          </div>
          <Target className="h-7 w-7 text-primary" />
        </Tile>
        <Tile tone="soft" className="flex items-center justify-between !py-3">
          <div>
            <Label>Integrity</Label>
            <p className="font-display text-[28px] font-bold leading-none text-slate-900">{CIR_HEADLINE.integrity}</p>
          </div>
          <ShieldCheck className="h-7 w-7 text-primary" />
        </Tile>
      </div>

      <Tile tone="white" className="col-span-8">
        <Label>Inside this report</Label>
        <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3">
          {contents.map(([no, name]) => (
            <li key={no} className="flex items-center gap-3 text-[12.5px] font-semibold text-slate-700">
              <span className="font-display text-[13px] font-bold text-primary">{no}</span>
              <span className="font-medium text-slate-700">{name}</span>
            </li>
          ))}
        </ul>
      </Tile>
      <Tile tone="soft" className="col-span-4">
        <Label>At a glance</Label>
        <ul className="mt-3 space-y-2 text-[12px] text-slate-600">
          {[
            [Briefcase, "4 tests, 94 questions"],
            [Clock, "148 min, one sitting"],
            [Camera, "AI and human proctored"],
            [BadgeCheck, "Employer verifiable"],
          ].map(([Icon, text]) => {
            const I = Icon as typeof Check;
            return (
              <li key={text as string} className="flex items-center gap-2">
                <I className="h-3.5 w-3.5 text-primary" />
                {text as string}
              </li>
            );
          })}
        </ul>
      </Tile>

      <Tile tone="dark" className="col-span-12 flex items-stretch gap-8">
        <div className="flex w-[170px] shrink-0 flex-col justify-between">
          <Label light>Skill snapshot</Label>
          <div>
            <p className="font-display text-[22px] font-bold leading-tight text-white">Six skills, one clear profile</p>
            <p className="mt-1.5 text-[11px] leading-snug text-white/60">Scored across all four proctored tests.</p>
          </div>
        </div>
        <div className="flex flex-1 items-end justify-between gap-4">
          {CIR_SKILLS.map((s) => (
            <div key={s.name} className="flex flex-1 flex-col items-center gap-2">
              <span className="font-display text-[15px] font-bold text-white">{s.score}</span>
              <div className="flex h-[96px] w-full items-end rounded-lg bg-white/10">
                <div className="w-full rounded-lg" style={{ height: `${s.score}%`, background: RED }} />
              </div>
              <span className="text-center text-[10px] leading-tight text-white/70">{s.short}</span>
            </div>
          ))}
        </div>
      </Tile>
    </div>

    <footer className="mx-10 flex items-center justify-between border-t border-slate-200 py-3.5 text-[10px] text-slate-400">
      <span>{CIR_CANDIDATE.reportId} · Confidential · Illustrative data for demonstration</span>
      <span className="font-semibold text-slate-500">
        Page 1 of {CIR_TOTAL_PAGES}
      </span>
    </footer>
  </section>
);

/* ------------------------------------------------------------------ */
/* Page 2: Executive summary                                           */
/* ------------------------------------------------------------------ */

const zones = [
  { label: "Emerging", from: 0, to: 50, color: "#E2E8F0" },
  { label: "Developing", from: 50, to: 70, color: "#CBD5E1" },
  { label: "Industry ready", from: 70, to: 85, color: "#fff" },
  { label: "Expert", from: 85, to: 100, color: "rgba(255,255,255,0.45)" },
];

const SummaryPage = () => (
  <PageShell n={2} section="Executive summary">
    <SectionTitle
      no="02"
      eyebrow="Executive summary"
      title="Rohan is ready for entry to mid-level digital marketing roles."
      sub="A strong analytical base and clear communication, with room to grow in email and paid social. Scores come from four proctored tests taken in one sitting."
    />

    <div className="grid grid-cols-12 gap-3.5">
      <Tile tone="red" className="col-span-7 !p-5">
        <div className="flex items-center gap-5">
          <Ring value={CIR_HEADLINE.score} size={132} stroke={13} color="#fff" track="rgba(255,255,255,0.25)">
            <span className="font-display text-[42px] font-bold leading-none text-white">{CIR_HEADLINE.score}</span>
            <span className="text-[10px] text-white/75">of 100</span>
          </Ring>
          <div>
            <Label light>Industry readiness score</Label>
            <p className="mt-1 font-display text-[24px] font-bold leading-tight text-white">{CIR_HEADLINE.tier}</p>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-white/85">
              Above the 70-point hiring threshold used by 8 in 10 partner employers.
            </p>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex h-2.5 overflow-hidden rounded-full">
            {zones.map((z) => (
              <div key={z.label} style={{ width: `${z.to - z.from}%`, background: z.color }} />
            ))}
          </div>
          <div className="relative mt-1.5 flex text-[9px] font-semibold text-white/80">
            {zones.map((z) => (
              <span key={z.label} style={{ width: `${z.to - z.from}%` }}>
                {z.label}
              </span>
            ))}
            <span
              className="absolute -top-[26px] h-6 w-0.5 bg-white"
              style={{ left: `${CIR_HEADLINE.score}%` }}
            />
          </div>
        </div>
      </Tile>

      <Tile tone="white" className="col-span-5">
        <Label>Where you rank</Label>
        <p className="mt-1 font-display text-[20px] font-bold leading-tight text-slate-900">Ahead of 91% of candidates</p>
        <p className="text-[11px] text-slate-500">Compared with 12,480 marketing candidates</p>
        <div className="mt-3 flex justify-center">
          <BellCurve width={268} height={118} />
        </div>
      </Tile>
    </div>

    <div className="mt-3.5 grid grid-cols-4 gap-3.5">
      {[
        [Briefcase, "Questions", "94", "92 attempted"],
        [Target, "Accuracy", "79%", "74 correct"],
        [Clock, "Time used", "148m", "of 165 min"],
        [ShieldCheck, "Integrity", "97", "No critical flags"],
      ].map(([Icon, label, value, sub]) => {
        const I = Icon as typeof Check;
        return (
          <Tile key={label as string} tone="soft" className="!p-3.5">
            <div className="flex items-center justify-between">
              <Label>{label as string}</Label>
              <I className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 font-display text-[27px] font-bold leading-none text-slate-900">{value as string}</p>
            <p className="mt-1 text-[10.5px] text-slate-500">{sub as string}</p>
          </Tile>
        );
      })}
    </div>

    <div className="mt-3.5 grid grid-cols-2 gap-3.5">
      <Tile tone="white">
        <div className="flex items-center gap-2.5">
          <IconTile icon={TrendingUp} />
          <p className="font-display text-[15px] font-bold">Where Rohan stands out</p>
        </div>
        <ul className="mt-3.5 space-y-3">
          {[
            ["Web Analytics", 88, "28 pts above market"],
            ["Communication", 86, "Top 12% of candidates"],
            ["Role fit", 84, "Growth-marketing profile"],
          ].map(([name, v, note]) => (
            <li key={name as string}>
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-[12px] font-semibold text-slate-800">{name as string}</span>
                <span className="font-display text-[14px] font-bold text-primary">{v as number}</span>
              </div>
              <Bar value={v as number} />
              <p className="mt-1 text-[10.5px] text-slate-500">{note as string}</p>
            </li>
          ))}
        </ul>
      </Tile>
      <Tile tone="white">
        <div className="flex items-center gap-2.5">
          <IconTile icon={Lightbulb} />
          <p className="font-display text-[15px] font-bold">Where to grow next</p>
        </div>
        <ul className="mt-3.5 space-y-3">
          {[
            ["Email and CRM", 68, "Lifecycle flows and deliverability"],
            ["Paid social", 72, "Audience and creative testing"],
            ["Hard questions", 62, "Accuracy dips on complex cases"],
          ].map(([name, v, note]) => (
            <li key={name as string}>
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-[12px] font-semibold text-slate-800">{name as string}</span>
                <span className="font-display text-[14px] font-bold text-slate-700">{v as number}</span>
              </div>
              <Bar value={v as number} color="#94A3B8" />
              <p className="mt-1 text-[10.5px] text-slate-500">{note as string}</p>
            </li>
          ))}
        </ul>
      </Tile>
    </div>

    <Tile tone="dark" className="mt-3.5 flex items-center gap-5 !p-5">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary">
        <Award className="h-6 w-6 text-white" />
      </span>
      <div className="min-w-0 flex-1">
        <Label light>Hiring recommendation</Label>
        <p className="mt-1 font-display text-[19px] font-bold leading-tight text-white">Shortlist for interview</p>
        <p className="mt-1 text-[11.5px] leading-snug text-white/65">
          Verified skills, high integrity and strong analytics make Rohan a low-risk hire for performance and growth roles.
        </p>
      </div>
      <div className="flex shrink-0 flex-col gap-1.5">
        <Pill tone="red">Role fit: high</Pill>
        <Pill tone="white">Integrity: high</Pill>
      </div>
    </Tile>
  </PageShell>
);

/* ------------------------------------------------------------------ */
/* Page 3: Test results overview                                       */
/* ------------------------------------------------------------------ */

const testIcons = [MessageSquareText, BrainCircuit, Compass, BarChart3];

const TestsPage = () => (
  <PageShell n={3} section="Test results">
    <SectionTitle
      no="03"
      eyebrow="Test results overview"
      title="Four tests, one verified picture."
      sub="Three core career tests come first, then one domain test in Digital Marketing. Every score is compared with the market average for the same role."
    />

    <div className="space-y-3.5">
      {CIR_TESTS.map((t, i) => {
        const Icon = testIcons[i];
        const domain = t.group === "Domain";
        return (
          <Tile key={t.name} tone={domain ? "dark" : "white"} className="!p-0">
            <div className="flex items-stretch">
              <div className={`flex w-[236px] shrink-0 items-center gap-3 p-6 ${domain ? "" : "bg-slate-50"}`}>
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                    domain ? "bg-primary text-white" : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <Pill tone={domain ? "red" : "slate"}>{domain ? "Domain test" : `Core 0${i + 1}`}</Pill>
                  <p className={`mt-1.5 font-display text-[14px] font-bold leading-tight ${domain ? "text-white" : "text-slate-900"}`}>
                    {t.name}
                  </p>
                </div>
              </div>

              <div className="flex flex-1 items-center gap-5 p-6">
                <Ring
                  value={t.score}
                  size={74}
                  stroke={8}
                  color={RED}
                  track={domain ? "rgba(255,255,255,0.15)" : "#F1F5F9"}
                >
                  <span className={`font-display text-[22px] font-bold leading-none ${domain ? "text-white" : "text-slate-900"}`}>
                    {t.score}
                  </span>
                </Ring>
                <div className="grid flex-1 grid-cols-3 gap-3">
                  {[
                    ["Accuracy", `${t.accuracy}%`],
                    ["Time", `${t.used}/${t.allotted}m`],
                    ["Percentile", `${t.percentile}th`],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <p className={`text-[9.5px] font-bold uppercase tracking-wider ${domain ? "text-white/55" : "text-slate-400"}`}>{k}</p>
                      <p className={`mt-0.5 font-display text-[16px] font-bold ${domain ? "text-white" : "text-slate-900"}`}>{v}</p>
                    </div>
                  ))}
                  <div className="col-span-3">
                    <div className="mb-1 flex items-center justify-between text-[10px]">
                      <span className={domain ? "text-white/60" : "text-slate-500"}>{t.note}</span>
                      <span className={domain ? "text-white/60" : "text-slate-500"}>Market avg {t.market}</span>
                    </div>
                    <Bar value={t.score} market={t.market} track={domain ? "rgba(255,255,255,0.15)" : "#F1F5F9"} height={7} />
                  </div>
                </div>
              </div>
            </div>
          </Tile>
        );
      })}
    </div>

    <div className="mt-3.5 grid grid-cols-12 gap-3.5">
      <Tile tone="white" className="col-span-7">
        <div className="flex items-center justify-between">
          <p className="font-display text-[15px] font-bold">You versus the market</p>
          <div className="flex items-center gap-3 text-[10px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-primary" />
              Rohan
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-slate-300" />
              Market
            </span>
          </div>
        </div>
        <div className="mt-4 flex h-[216px] items-end justify-around gap-3 border-b border-slate-200 pb-0">
          {CIR_TESTS.map((t) => (
            <div key={t.name} className="flex flex-1 flex-col items-center">
              <div className="flex items-end gap-1.5" style={{ height: 196 }}>
                <div className="flex flex-col items-center justify-end">
                  <span className="mb-1 font-display text-[11px] font-bold text-primary">{t.score}</span>
                  <div className="w-9 rounded-t-md bg-primary" style={{ height: `${t.score * 1.7}px` }} />
                </div>
                <div className="flex flex-col items-center justify-end">
                  <span className="mb-1 font-display text-[11px] font-semibold text-slate-400">{t.market}</span>
                  <div className="w-9 rounded-t-md bg-slate-300" style={{ height: `${t.market * 1.7}px` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-around gap-3">
          {["Communication", "Aptitude", "Role fit", "Domain"].map((l) => (
            <span key={l} className="flex-1 text-center text-[10px] font-semibold text-slate-500">
              {l}
            </span>
          ))}
        </div>
      </Tile>
      <Tile tone="soft" className="col-span-5">
        <p className="font-display text-[15px] font-bold">How scores work</p>
        <ul className="mt-3 space-y-2.5">
          {[
            "Each question is weighted by difficulty.",
            "Technical tasks earn partial credit from a rubric.",
            "Role Fit measures consistency, not right or wrong.",
            "Percentiles use 12,480 recent candidates.",
          ].map((x) => (
            <li key={x} className="flex gap-2 text-[11px] leading-snug text-slate-600">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <Check className="h-2.5 w-2.5" />
              </span>
              {x}
            </li>
          ))}
        </ul>
      </Tile>
    </div>
  </PageShell>
);

/* ------------------------------------------------------------------ */
/* Page 4: Domain deep dive                                            */
/* ------------------------------------------------------------------ */

const DomainPage = () => (
  <PageShell n={4} section="Digital Marketing">
    <SectionTitle
      no="04"
      eyebrow="Digital Marketing deep dive"
      title="Skill by skill, against the market."
      sub="The domain test runs in three rounds: knowledge, hands-on technical work and real workplace judgement."
    />

    <div className="grid grid-cols-12 gap-3.5">
      <Tile tone="white" className="col-span-7 !px-2 !py-3">
        <div className="flex items-center justify-between px-3">
          <p className="font-display text-[15px] font-bold">Skill radar</p>
          <div className="flex items-center gap-2.5 text-[9.5px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="h-0.5 w-3 bg-primary" /> Rohan
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-3 rounded-sm bg-slate-300" /> Market
            </span>
            <span className="flex items-center gap-1">
              <span className="h-0 w-3 border-t border-dashed border-slate-400" /> Top 10%
            </span>
          </div>
        </div>
        <Radar size={372} />
      </Tile>
      <Tile tone="soft" className="col-span-5">
        <p className="font-display text-[15px] font-bold">Skill ranking</p>
        <ul className="mt-3 space-y-3">
          {CIR_SKILLS.map((s) => (
            <li key={s.name}>
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-[11.5px] font-semibold text-slate-800">{s.name}</span>
                <span className="flex items-baseline gap-1.5">
                  <span className="text-[10px] font-semibold text-emerald-600">+{s.score - s.market}</span>
                  <span className="font-display text-[14px] font-bold text-primary">{s.score}</span>
                </span>
              </div>
              <Bar value={s.score} market={s.market} height={7} />
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[9.5px] text-slate-400">Black tick marks the market average.</p>
      </Tile>
    </div>

    <div className="mt-3.5 grid grid-cols-3 gap-3.5">
      {CIR_ROUNDS.map((r, i) => (
        <Tile key={r.title} tone={i === 1 ? "dark" : "white"} className="!p-5">
          <div className="flex items-start justify-between">
            <div>
              <Label light={i === 1}>{r.title}</Label>
              <p className={`mt-1 font-display text-[34px] font-bold leading-none ${i === 1 ? "text-white" : "text-slate-900"}`}>
                {r.score}
              </p>
              <p className={`mt-1 text-[10px] ${i === 1 ? "text-white/60" : "text-slate-500"}`}>Market avg {r.market}</p>
            </div>
            <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${i === 1 ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
              {i === 0 ? <Lightbulb className="h-4 w-4" /> : i === 1 ? <Cpu className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />}
            </span>
          </div>
          <ul className="mt-4 space-y-3">
            {r.tests.map((t) => (
              <li key={t.name}>
                <div className="mb-1 flex items-baseline justify-between">
                  <span className={`text-[11px] font-semibold ${i === 1 ? "text-white" : "text-slate-800"}`}>{t.name}</span>
                  <span className={`text-[10px] ${i === 1 ? "text-white/60" : "text-slate-500"}`}>{t.result}</span>
                </div>
                <Bar value={t.pct} height={6} track={i === 1 ? "rgba(255,255,255,0.15)" : "#F1F5F9"} />
              </li>
            ))}
          </ul>
        </Tile>
      ))}
    </div>

    <Tile tone="soft" className="mt-3.5 flex items-center gap-5 !p-5">
      <img src={reviewer} alt="Reviewer" className="h-[88px] w-[88px] shrink-0 rounded-2xl object-cover" />
      <div className="min-w-0 flex-1">
        <Quote className="h-5 w-5 text-primary" />
        <p className="mt-1.5 text-[12.5px] italic leading-relaxed text-slate-700">
          Rohan reads a GA4 funnel the way a senior analyst does. His case answer linked spend, attribution and a clear next test.
          Email flows need more structure.
        </p>
        <p className="mt-2 text-[10.5px] font-semibold text-slate-500">
          Reviewer note · Aarav Mehta, Head of Growth, Swiggy
        </p>
      </div>
    </Tile>

    <Tile tone="dark" className="mt-3.5 flex items-center gap-5 !p-5">
      <div className="w-[150px] shrink-0">
        <Label light>Tools assessed</Label>
        <p className="mt-1 font-display text-[16px] font-bold leading-tight text-white">Platforms used in the hands-on round</p>
      </div>
      <div className="flex flex-1 flex-wrap gap-2">
        {["Google Ads", "Meta Ads Manager", "GA4", "Search Console", "Semrush", "Mailchimp", "Looker Studio", "WordPress"].map((t) => (
          <span key={t} className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white">
            {t}
          </span>
        ))}
      </div>
    </Tile>
  </PageShell>
);

/* ------------------------------------------------------------------ */
/* Page 5: Accuracy and time analytics                                 */
/* ------------------------------------------------------------------ */

const cell = { c: "#16A34A", i: RED, s: "#F59E0B" } as const;

const AnswerGrid = ({ items, perRow }: { items: ("c" | "i" | "s")[]; perRow: number }) => (
  <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${perRow}, 22px)` }}>
    {items.map((v, i) => (
      <span key={i} className="h-[18px] w-[22px] rounded-md" style={{ background: cell[v], opacity: v === "c" ? 0.9 : 1 }} />
    ))}
  </div>
);

const AnalyticsPage = () => (
  <PageShell n={5} section="Accuracy and time">
    <SectionTitle
      no="05"
      eyebrow="Accuracy and time analytics"
      title="Fast where it counts, careful where it is hard."
      sub="A question-level view of how Rohan answered across all 94 questions, and how time was spent."
    />

    <div className="grid grid-cols-12 gap-3.5">
      <Tile tone="dark" className="col-span-5 flex flex-col items-center !p-5">
        <Label light>Overall accuracy</Label>
        <div className="mt-3">
          <Ring value={CIR_HEADLINE.accuracy} size={150} stroke={15} color={RED} track="rgba(255,255,255,0.14)">
            <span className="font-display text-[40px] font-bold leading-none text-white">{CIR_HEADLINE.accuracy}%</span>
            <span className="mt-0.5 text-[10px] text-white/60">{CIR_HEADLINE.correct} of {CIR_HEADLINE.questions}</span>
          </Ring>
        </div>
        <div className="mt-4 grid w-full grid-cols-3 gap-2">
          {[
            ["Correct", CIR_HEADLINE.correct, "#16A34A"],
            ["Incorrect", CIR_HEADLINE.incorrect, RED],
            ["Skipped", CIR_HEADLINE.skipped, "#F59E0B"],
          ].map(([k, v, c]) => (
            <div key={k as string} className="rounded-xl bg-white/10 px-2 py-2 text-center">
              <span className="mx-auto mb-1 block h-1.5 w-6 rounded-full" style={{ background: c as string }} />
              <p className="font-display text-[17px] font-bold text-white">{v as number}</p>
              <p className="text-[9.5px] text-white/60">{k as string}</p>
            </div>
          ))}
        </div>
      </Tile>

      <Tile tone="white" className="col-span-7">
        <p className="font-display text-[15px] font-bold">Accuracy by difficulty</p>
        <p className="text-[10.5px] text-slate-500">Questions are tagged easy, medium or hard by expert reviewers.</p>
        <ul className="mt-4 space-y-4">
          {CIR_DIFFICULTY.map((d) => {
            const pct = Math.round((d.correct / d.total) * 100);
            return (
              <li key={d.level}>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="flex items-center gap-2 text-[12px] font-semibold text-slate-800">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
                    {d.level}
                  </span>
                  <span className="text-[10.5px] text-slate-500">
                    {d.correct} of {d.total} correct ·{" "}
                    <span className="font-display text-[15px] font-bold text-slate-900">{pct}%</span>
                  </span>
                </div>
                <Bar value={pct} color={d.color} height={10} />
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex gap-2 rounded-xl bg-slate-50 p-3 text-[11px] leading-snug text-slate-600">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          Almost every easy question was right. Hard questions are the best place to gain points.
        </div>
      </Tile>
    </div>

    <Tile tone="white" className="mt-3.5">
      <div className="flex items-center justify-between">
        <p className="font-display text-[15px] font-bold">Answer map</p>
        <div className="flex items-center gap-3 text-[10px] text-slate-500">
          {[
            ["Correct", "#16A34A"],
            ["Incorrect", RED],
            ["Skipped", "#F59E0B"],
          ].map(([k, c]) => (
            <span key={k} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: c }} />
              {k}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-[1fr_auto] items-start gap-x-6">
        <div>
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Core tests · Q1 to Q50</p>
          <AnswerGrid items={CIR_ANSWER_MAP.slice(0, 50)} perRow={25} />
        </div>
      </div>
      <div className="mt-3">
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Digital Marketing test · Q51 to Q94</p>
        <AnswerGrid items={CIR_ANSWER_MAP.slice(50)} perRow={25} />
      </div>
    </Tile>

    <div className="mt-3.5 grid grid-cols-12 gap-3.5">
      <Tile tone="soft" className="col-span-7">
        <p className="font-display text-[15px] font-bold">Time used versus allowed</p>
        <ul className="mt-3 space-y-2.5">
          {CIR_PACE.map((p) => (
            <li key={p.label} className="flex items-center gap-3">
              <span className="w-[88px] shrink-0 text-[11px] font-semibold text-slate-700">{p.label}</span>
              <div className="flex-1">
                <Bar value={(p.used / p.allotted) * 100} height={8} track="#E2E8F0" />
              </div>
              <span className="w-[56px] shrink-0 text-right text-[10.5px] text-slate-500">
                {p.used} / {p.allotted}m
              </span>
            </li>
          ))}
        </ul>
      </Tile>
      <Tile tone="white" className="col-span-5">
        <p className="font-display text-[15px] font-bold">Pace profile</p>
        <div className="relative mt-3 h-[92px] rounded-xl bg-slate-50">
          <svg width="100%" height="92" viewBox="0 0 257 92" preserveAspectRatio="none">
            <line x1="128" y1="6" x2="128" y2="86" stroke={LINE} strokeWidth="1" />
            <line x1="6" y1="46" x2="251" y2="46" stroke={LINE} strokeWidth="1" />
            <circle cx="182" cy="28" r="9" fill={RED} />
            <circle cx="182" cy="28" r="15" fill="none" stroke={RED} strokeOpacity="0.3" strokeWidth="2" />
          </svg>
          <span className="absolute left-2 top-1 text-[8.5px] text-slate-400">Accurate</span>
          <span className="absolute bottom-1 right-2 text-[8.5px] text-slate-400">Fast</span>
        </div>
        <p className="mt-2.5 text-[11px] leading-snug text-slate-600">
          <span className="font-bold text-slate-900">Balanced performer.</span> 1.6 min per question on average, with no rushed answers.
        </p>
      </Tile>
    </div>

    <div className="mt-3.5 grid grid-cols-3 gap-3.5">
      {[
        [Target, "Longest streak", `${(() => {
          let best = 0;
          let run = 0;
          CIR_ANSWER_MAP.forEach((v) => {
            run = v === "c" ? run + 1 : 0;
            best = Math.max(best, run);
          });
          return best;
        })()}`, "correct answers in a row", "dark"],
        [Clock, "Average pace", "1.6 min", "per question, 94 questions", "red"],
        [ShieldCheck, "Skipped", `${CIR_HEADLINE.skipped}`, "of 94 questions left blank", "soft"],
      ].map(([Icon, label, value, note, tone]) => {
        const I = Icon as typeof Check;
        const light = tone !== "soft";
        return (
          <Tile key={label as string} tone={tone as "dark" | "red" | "soft"} className="!p-4">
            <div className="flex items-center justify-between">
              <Label light={light}>{label as string}</Label>
              <I className={`h-4 w-4 ${light ? "text-white" : "text-primary"}`} />
            </div>
            <p className={`mt-3 font-display text-[34px] font-bold leading-none ${light ? "text-white" : "text-slate-900"}`}>
              {value as string}
            </p>
            <p className={`mt-1.5 text-[10.5px] ${light ? "text-white/70" : "text-slate-500"}`}>{note as string}</p>
          </Tile>
        );
      })}
    </div>
  </PageShell>
);

/* ------------------------------------------------------------------ */
/* Page 6: Proctoring and integrity                                    */
/* ------------------------------------------------------------------ */

const checkIcons = [Fingerprint, ScanFace, BadgeCheck, Camera, Mic, Monitor];
const sessionSegments = [
  { label: "Core", from: 0, to: 36, color: "#CBD5E1" },
  { label: "Round 1", from: 36, to: 63, color: "#94A3B8" },
  { label: "Round 2", from: 63, to: 113, color: RED },
  { label: "Round 3", from: 113, to: 148, color: INK },
];

const ProctoringPage = () => (
  <PageShell n={6} section="Proctoring and integrity">
    <SectionTitle
      no="06"
      eyebrow="Proctoring and integrity"
      title="Every minute was monitored, and the record is clean."
      sub="Identity, camera, microphone and screen signals were checked throughout the 148-minute session."
    />

    <div className="grid grid-cols-12 gap-3.5">
      <Tile tone="dark" className="col-span-7 !p-0">
        <div className="relative h-full" style={{ minHeight: 300 }}>
          <img src={proctorThumb} alt="Proctored session" className="absolute inset-0 h-full w-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/20 to-slate-900/10" />
          <div className="absolute right-4 top-4 w-[112px] overflow-hidden rounded-2xl border-2 border-white shadow-lg">
            <img src={avatar} alt="Candidate camera" className="h-[112px] w-full object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-slate-900/70 py-0.5 text-center text-[8.5px] font-bold uppercase tracking-wider text-white">
              Candidate camera
            </span>
          </div>
          <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-slate-900/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            <span className="h-2 w-2 rounded-full bg-primary" /> Live proctoring
          </span>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <p className="font-display text-[16px] font-bold text-white">Face match 99.2%</p>
              <p className="text-[10.5px] text-white/70">Checked every 30 seconds</p>
            </div>
            <div className="flex gap-1.5">
              <Pill tone="white">ID verified</Pill>
              <Pill tone="white">Liveness passed</Pill>
            </div>
          </div>
        </div>
      </Tile>

      <div className="col-span-5 grid grid-rows-[auto_1fr] gap-3.5">
        <Tile tone="red" className="flex items-center gap-4">
          <Ring value={CIR_PROCTORING.integrity} size={92} stroke={10} color="#fff" track="rgba(255,255,255,0.25)">
            <span className="font-display text-[28px] font-bold leading-none text-white">{CIR_PROCTORING.integrity}</span>
          </Ring>
          <div>
            <Label light>Integrity score</Label>
            <p className="mt-1 font-display text-[18px] font-bold leading-tight text-white">High integrity</p>
            <p className="mt-0.5 text-[10.5px] text-white/80">No action needed</p>
          </div>
        </Tile>
        <div className="grid grid-cols-2 gap-3.5">
          {CIR_PROCTORING.stats.map((s) => (
            <Tile key={s.label} tone="soft" className="flex flex-col justify-between !p-3.5">
              <Label>{s.label}</Label>
              <p className="font-display text-[30px] font-bold leading-none text-slate-900">{s.value}</p>
            </Tile>
          ))}
        </div>
      </div>
    </div>

    <div className="mt-3.5 grid grid-cols-4 gap-3.5">
      {[
        [Eye, "Gaze on screen", "96%", "soft"],
        [Mic, "Ambient noise", "Low", "white"],
        [Wifi, "Connection", "99.8%", "white"],
        [Lock, "Browser lockdown", "On", "dark"],
      ].map(([Icon, label, value, tone]) => {
        const I = Icon as typeof Check;
        const dark = tone === "dark";
        return (
          <Tile key={label as string} tone={tone as "soft" | "white" | "dark"} className="flex items-center gap-3 !p-4">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${dark ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
              <I className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className={`font-display text-[19px] font-bold leading-none ${dark ? "text-white" : "text-slate-900"}`}>{value as string}</p>
              <p className={`mt-1 text-[10px] ${dark ? "text-white/60" : "text-slate-500"}`}>{label as string}</p>
            </div>
          </Tile>
        );
      })}
    </div>

    <Tile tone="white" className="mt-3.5">
      <div className="flex items-center justify-between">
        <p className="font-display text-[15px] font-bold">Session timeline</p>
        <p className="text-[10.5px] text-slate-500">148 minutes · 3 low-severity events</p>
      </div>
      <div className="relative mt-5">
        <div className="flex h-5 overflow-hidden rounded-full">
          {sessionSegments.map((s) => (
            <div key={s.label} style={{ width: `${((s.to - s.from) / 148) * 100}%`, background: s.color }} />
          ))}
        </div>
        {CIR_PROCTORING.events.map((e) => (
          <div
            key={e.at}
            className="absolute -top-3 flex flex-col items-center"
            style={{ left: `${(e.at / 148) * 100}%`, transform: "translateX(-50%)" }}
          >
            <span className="h-2.5 w-2.5 rotate-45 bg-amber-500" />
            <span className="h-3 w-px bg-amber-500" />
          </div>
        ))}
        <div className="mt-2 flex text-[9.5px] font-semibold text-slate-500">
          {sessionSegments.map((s) => (
            <span key={s.label} style={{ width: `${((s.to - s.from) / 148) * 100}%` }}>
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </Tile>

    <div className="mt-3.5 grid grid-cols-12 gap-3.5">
      <Tile tone="white" className="col-span-7">
        <p className="font-display text-[15px] font-bold">Verification checks</p>
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3.5">
          {CIR_PROCTORING.checks.map((c, i) => {
            const Icon = checkIcons[i];
            return (
              <div key={c.label} className="flex items-start gap-2.5">
                <IconTile icon={Icon} />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold leading-tight text-slate-800">{c.label}</p>
                  <p className="font-display text-[14px] font-bold leading-tight text-primary">{c.value}</p>
                  <p className="text-[9.5px] leading-tight text-slate-500">{c.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Tile>
      <div className="col-span-5 grid grid-rows-[auto_1fr] gap-3.5">
        <Tile tone="soft" className="!p-3.5">
          <p className="font-display text-[13.5px] font-bold">Event log</p>
          <ul className="mt-2 space-y-1.5">
            {CIR_PROCTORING.events.map((e) => (
              <li key={e.at} className="flex items-center justify-between text-[10.5px]">
                <span className="text-slate-700">
                  <span className="font-semibold">{e.at}m</span> · {e.kind}
                </span>
                <span className="flex items-center gap-2 text-slate-500">
                  {e.length}
                  <Pill tone="amber">{e.severity}</Pill>
                </span>
              </li>
            ))}
          </ul>
        </Tile>
        <Tile tone="white" className="!p-3.5">
          <p className="font-display text-[13.5px] font-bold">Device and environment</p>
          <ul className="mt-2 space-y-1">
            {CIR_PROCTORING.device.map(([k, v]) => (
              <li key={k} className="flex justify-between text-[10.5px]">
                <span className="text-slate-500">{k}</span>
                <span className="font-semibold text-slate-800">{v}</span>
              </li>
            ))}
          </ul>
        </Tile>
      </div>
    </div>
  </PageShell>
);

/* ------------------------------------------------------------------ */
/* Page 7: Next steps and verification                                 */
/* ------------------------------------------------------------------ */

const NextStepsPage = () => (
  <PageShell n={7} section="Next steps and verification">
    <SectionTitle
      no="07"
      eyebrow="Next steps and verification"
      title="What Rohan can do next, and how employers can trust it."
    />

    <div className="grid grid-cols-12 gap-3.5">
      <Tile tone="white" className="col-span-7">
        <div className="flex items-center gap-2.5">
          <IconTile icon={Target} />
          <p className="font-display text-[15px] font-bold">Best-fit roles</p>
        </div>
        <ul className="mt-3.5 space-y-3.5">
          {CIR_ROLES.map((r) => (
            <li key={r.role}>
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-[12px] font-semibold text-slate-800">{r.role}</span>
                <span className="font-display text-[15px] font-bold text-primary">{r.match}%</span>
              </div>
              <Bar value={r.match} height={8} />
            </li>
          ))}
        </ul>
      </Tile>

      <Tile tone="dark" className="col-span-5">
        <div className="flex items-center gap-2.5">
          <IconTile icon={TrendingUp} light />
          <p className="font-display text-[15px] font-bold text-white">Salary potential</p>
        </div>
        <div className="mt-5">
          {[
            ["Today", 5.2, 7.5, RED],
            ["After 90 days", 6.5, 9.0, "#fff"],
          ].map(([label, lo, hi, color]) => (
            <div key={label as string} className="mb-5">
              <div className="mb-1.5 flex justify-between text-[10.5px]">
                <span className="text-white/70">{label as string}</span>
                <span className="font-display text-[13px] font-bold text-white">
                  {lo as number}L to {hi as number}L
                </span>
              </div>
              <div className="relative h-2.5 rounded-full bg-white/10">
                <div
                  className="absolute h-full rounded-full"
                  style={{
                    left: `${(((lo as number) - 4) / 6) * 100}%`,
                    width: `${(((hi as number) - (lo as number)) / 6) * 100}%`,
                    background: color as string,
                  }}
                />
              </div>
            </div>
          ))}
          <div className="flex justify-between text-[9px] text-white/50">
            <span>4L</span>
            <span>7L</span>
            <span>10L per year</span>
          </div>
        </div>
        <p className="mt-3 text-[9.5px] leading-snug text-white/50">Illustrative band for Mumbai, 3 years of experience.</p>
      </Tile>
    </div>

    <div className="mt-3.5">
      <p className="mb-2.5 font-display text-[15px] font-bold">30, 60 and 90 day plan</p>
      <div className="relative grid grid-cols-3 gap-3.5">
        {CIR_PLAN.map((p, i) => (
          <Tile key={p.phase} tone="white" className="!px-4 !pb-5 !pt-14" >
            <span className="absolute left-4 top-4 inline-flex h-6 items-center rounded-full bg-primary px-3 text-[10px] font-bold uppercase tracking-wider text-white">
              {p.phase}
            </span>
            <span className="absolute right-4 top-3 font-display text-[30px] font-bold leading-none text-slate-100">0{i + 1}</span>
            <p className="font-display text-[13.5px] font-bold leading-tight text-slate-900">{p.title}</p>
            <p className="mt-1.5 text-[10.5px] leading-snug text-slate-500">{p.text}</p>
          </Tile>
        ))}
      </div>
    </div>

    <div className="mt-3.5 grid grid-cols-3 gap-3.5">
      {[
        [Globe, "Share the link", "Send the secure report link or QR code to any employer."],
        [FileCheck2, "Employer verifies", "The report ID and scores are checked on the verification page."],
        [Briefcase, "Get shortlisted", "Verified scores replace guesswork in the first screening."],
      ].map(([Icon, title, text], i) => {
        const I = Icon as typeof Check;
        return (
          <Tile key={title as string} tone={i === 1 ? "dark" : "white"} className="!p-4">
            <div className="flex items-center justify-between">
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${i === 1 ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
                <I className="h-4 w-4" />
              </span>
            </div>
            <p className={`mt-3 font-display text-[13.5px] font-bold leading-tight ${i === 1 ? "text-white" : "text-slate-900"}`}>{title as string}</p>
            <p className={`mt-1 text-[10.5px] leading-snug ${i === 1 ? "text-white/65" : "text-slate-500"}`}>{text as string}</p>
          </Tile>
        );
      })}
    </div>

    <Tile tone="red" className="mt-3.5 flex items-center gap-5 !p-5">
      <div className="shrink-0 rounded-2xl bg-white p-2">
        <QrCode size={132} />
      </div>
      <div className="min-w-0 flex-1">
        <Label light>Employer verification</Label>
        <p className="mt-1 font-display text-[20px] font-bold leading-tight text-white">Scan to verify this report</p>
        <ul className="mt-2.5 space-y-1.5 text-[11px] text-white/90">
          <li className="flex items-center gap-2">
            <FileCheck2 className="h-3.5 w-3.5" /> {CIR_CANDIDATE.reportId}
          </li>
          <li className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5" /> {CIR_CANDIDATE.verifyUrl}
          </li>
          <li className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" /> Valid until {CIR_CANDIDATE.validUntil}
          </li>
        </ul>
      </div>
      <div className="flex shrink-0 flex-col items-center text-center">
        <span className="flex h-[84px] w-[84px] items-center justify-center rounded-full border-2 border-dashed border-white/70">
          <span className="flex h-[66px] w-[66px] items-center justify-center rounded-full bg-white">
            <BadgeCheck className="h-9 w-9 text-primary" />
          </span>
        </span>
        <p className="mt-2 text-[9.5px] font-bold uppercase tracking-wider text-white">Verified by</p>
        <p className="text-[9.5px] text-white/80">I Am Talento</p>
      </div>
    </Tile>

    <div className="mt-3.5 grid grid-cols-12 gap-3.5">
      <Tile tone="soft" className="col-span-8 !p-3.5">
        <p className="text-[10px] leading-relaxed text-slate-500">
          This is a sample report with illustrative data. It shows the structure, depth and proctoring detail of a real I Am Talento
          Career Intelligence Report. Candidate details, scores and events are fictional. Real reports are generated the same day
          and can be shared with employers using a secure link.
        </p>
      </Tile>
      <Tile tone="soft" className="col-span-4 flex flex-col justify-end !p-3.5">
        <div className="h-px bg-slate-300" />
        <p className="mt-1.5 text-[10px] font-bold text-slate-700">Assessment Board</p>
        <p className="text-[9.5px] text-slate-500">I Am Talento</p>
      </Tile>
    </div>
  </PageShell>
);

/* ------------------------------------------------------------------ */

export const CirPages = () => (
  <>
    <CoverPage />
    <SummaryPage />
    <TestsPage />
    <DomainPage />
    <AnalyticsPage />
    <ProctoringPage />
    <NextStepsPage />
  </>
);
