import { motion } from "framer-motion";
import portrait from "@/assets/carousel-candidate1.jpg";

const C = 320;
const R_PORTRAIT = 132;
const R_IN = 162;
const R_OUT = 252;
const R_MID = (R_IN + R_OUT) / 2;
const R_CAT = 272;
const R_CAT_LABEL = 291;
const GAP = 2;

const GROUPS = [
  {
    name: "Functional Skills",
    opacity: 1,
    items: [
      "Data Interpretation",
      "Analytical Thinking",
      "Problem Solving",
      "Technical Proficiency",
      "Critical Thinking",
    ],
  },
  {
    name: "AI Fluency",
    opacity: 0.86,
    items: ["AI Collaboration", "Tool Fluency", "Ethical AI Use"],
  },
  {
    name: "Behavioural Skills",
    opacity: 0.72,
    items: [
      "Adaptability",
      "Growth Mindset",
      "Collaboration",
      "Learning Agility",
    ],
  },
];

const d2r = (d: number) => ((d - 90) * Math.PI) / 180;
const pt = (r: number, a: number) =>
  [C + r * Math.cos(d2r(a)), C + r * Math.sin(d2r(a))] as const;

const arc = (r: number, a1: number, a2: number, sweep: 0 | 1) => {
  const [x1, y1] = pt(r, a1);
  const [x2, y2] = pt(r, a2);
  const large = Math.abs(a2 - a1) > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} ${sweep} ${x2} ${y2}`;
};

const donut = (a1: number, a2: number) => {
  const [ix2, iy2] = pt(R_IN, a2);
  return `${arc(R_OUT, a1, a2, 1)} L ${ix2} ${iy2} ${arc(R_IN, a2, a1, 0)} Z`;
};

const isFlipped = (mid: number) => {
  const m = ((mid % 360) + 360) % 360;
  return m > 90 && m < 270;
};

type Seg = {
  label: string;
  a1: number;
  a2: number;
  group: number;
  pathId: string;
  flipped: boolean;
  textLength?: number;
};

const build = () => {
  const flat = GROUPS.flatMap((g, gi) =>
    g.items.map((label) => ({ label, group: gi })),
  );
  const totalWeight = flat.reduce((s, i) => s + i.label.length, 0);
  const available = 360 - GAP * flat.length;

  const nF = GROUPS[0].items.length;
  const sumF =
    (GROUPS[0].items.reduce((s, l) => s + l.length, 0) / totalWeight) *
    available;
  let cursor = -(sumF + (nF - 1) * GAP) / 2;

  const segs: Seg[] = [];
  const ranges: { a1: number; a2: number }[] = [];

  GROUPS.forEach((g, gi) => {
    const a1 = cursor;
    g.items.forEach((label) => {
      const sweep = (label.length / totalWeight) * available;
      const mid = cursor + sweep / 2;
      const flipped = isFlipped(mid);
      const arcLen = 2 * Math.PI * R_MID * (sweep / 360) - 14;
      const natural = label.length * 6.1;
      segs.push({
        label,
        a1: cursor,
        a2: cursor + sweep,
        group: gi,
        pathId: `skill-arc-${gi}-${label.replace(/\W/g, "")}`,
        flipped,
        textLength: natural > arcLen ? arcLen : undefined,
      });
      cursor += sweep + GAP;
    });
    ranges.push({ a1, a2: cursor - GAP });
  });

  return { segs, ranges };
};

const { segs, ranges } = build();

const SkillsWheel = () => (
  <svg
    viewBox="0 0 640 640"
    role="img"
    aria-label="Skills wheel: functional skills, AI fluency and behavioural skills around a candidate"
    className="w-full max-w-[560px] mx-auto block"
  >
    <defs>
      <clipPath id="wheel-portrait">
        <circle cx={C} cy={C} r={R_PORTRAIT} />
      </clipPath>
      {segs.map((s) => (
        <path
          key={s.pathId}
          id={s.pathId}
          d={
            s.flipped
              ? arc(R_MID + 4, s.a2, s.a1, 0)
              : arc(R_MID - 4, s.a1, s.a2, 1)
          }
        />
      ))}
      {GROUPS.map((g, gi) => {
        const r = ranges[gi];
        const flipped = isFlipped((r.a1 + r.a2) / 2);
        return (
          <path
            key={`cat-${gi}`}
            id={`cat-arc-${gi}`}
            d={
              flipped
                ? arc(R_CAT_LABEL, r.a2, r.a1, 0)
                : arc(R_CAT_LABEL, r.a1, r.a2, 1)
            }
          />
        );
      })}
    </defs>

    <circle
      cx={C}
      cy={C}
      r={302}
      fill="none"
      stroke="hsl(var(--primary))"
      strokeOpacity={0.12}
      strokeDasharray="2 9"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        from={`0 ${C} ${C}`}
        to={`360 ${C} ${C}`}
        dur="80s"
        repeatCount="indefinite"
      />
    </circle>
    <circle
      cx={C}
      cy={C}
      r={R_IN - 10}
      fill="none"
      stroke="hsl(var(--primary))"
      strokeOpacity={0.1}
    />

    {segs.map((s, i) => (
      <g
        key={s.label}
        className="transition-opacity duration-200"
        opacity={GROUPS[s.group].opacity}
        onMouseEnter={(e) => e.currentTarget.setAttribute("opacity", "1")}
        onMouseLeave={(e) =>
          e.currentTarget.setAttribute("opacity", String(GROUPS[s.group].opacity))
        }
      >
        <path
          d={donut(s.a1, s.a2)}
          fill="hsl(var(--primary))"
          className="[animation:wheel-in_.6s_ease-out_both]"
          style={{ animationDelay: `${i * 55}ms` }}
        />
        <text
          fill="hsl(var(--primary-foreground))"
          fontSize={11.5}
          fontWeight={600}
          className="font-sans select-none"
        >
          <textPath
            href={`#${s.pathId}`}
            startOffset="50%"
            textAnchor="middle"
            textLength={s.textLength}
            lengthAdjust={s.textLength ? "spacingAndGlyphs" : undefined}
          >
            {s.label}
          </textPath>
        </text>
      </g>
    ))}

    {GROUPS.map((g, gi) => {
      const r = ranges[gi];
      return (
        <g key={g.name}>
          <path
            d={
              isFlipped((r.a1 + r.a2) / 2)
                ? arc(R_CAT, r.a2, r.a1, 0)
                : arc(R_CAT, r.a1, r.a2, 1)
            }
            fill="none"
            stroke="hsl(var(--primary))"
            strokeOpacity={0.3}
          />
          <text
            fill="hsl(var(--primary))"
            fillOpacity={0.8}
            fontSize={11.5}
            fontWeight={700}
            letterSpacing={2.4}
            className="font-sans uppercase select-none"
          >
            <textPath
              href={`#cat-arc-${gi}`}
              startOffset="50%"
              textAnchor="middle"
            >
              {g.name}
            </textPath>
          </text>
        </g>
      );
    })}

    <circle cx={C} cy={C} r={R_PORTRAIT + 12} fill="hsl(var(--card))" />
    <image
      href={portrait}
      x={C - R_PORTRAIT}
      y={C - R_PORTRAIT}
      width={R_PORTRAIT * 2}
      height={R_PORTRAIT * 2}
      preserveAspectRatio="xMidYMid slice"
      clipPath="url(#wheel-portrait)"
      style={{ filter: "grayscale(1) contrast(1.06)" }}
    />
    <circle
      cx={C}
      cy={C}
      r={R_PORTRAIT}
      fill="none"
      stroke="hsl(var(--primary))"
      strokeOpacity={0.25}
    />
    <circle
      cx={C}
      cy={C}
      r={R_PORTRAIT + 12}
      fill="none"
      stroke="hsl(var(--primary))"
      strokeOpacity={0.14}
    />
  </svg>
);

const Home3SkillsWheel = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.94 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className="w-full"
  >
    <SkillsWheel />
  </motion.div>
);

export default Home3SkillsWheel;
