import { motion } from "framer-motion";
import portrait from "@/assets/wheel-portrait.png";

const C = 400;
const R_IN = 195;
const R_OUT = 315;
const R_L1 = 290;
const R_L2 = 242;
const R_SINGLE = 266;
const R_HAIR = 344;
const R_LABEL = 360;
const R_FACE = 217;
const CUT = 2;

const GROUPS = [
  { name: "Functional Skills", center: 0 },
  { name: "AI Fluency", center: 120 },
  { name: "Behavioural Skills", center: 240 },
];

const SEGMENTS = [
  { lines: ["Analytical", "Thinking"], group: 0 },
  { lines: ["Problem", "Solving"], group: 0 },
  { lines: ["Technical", "Proficiency"], group: 1 },
  { lines: ["AI", "Collaboration"], group: 1 },
  { lines: ["Tool", "Fluency"], group: 1 },
  { lines: ["Ethical", "AI Use"], group: 1 },
  { lines: ["Adaptability"], group: 2 },
  { lines: ["Growth", "Mindset"], group: 2 },
  { lines: ["Collaboration"], group: 2 },
  { lines: ["Learning", "Agility"], group: 2 },
  { lines: ["Critical", "Thinking"], group: 0 },
  { lines: ["Data", "Interpretation"], group: 0 },
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

const inset = (r: number) => (CUT / r) * (180 / Math.PI);

const segPath = (a1: number, a2: number) => {
  const o1 = a1 + inset(R_OUT);
  const o2 = a2 - inset(R_OUT);
  const i1 = a1 + inset(R_IN);
  const i2 = a2 - inset(R_IN);
  const [ox1, oy1] = pt(R_OUT, o1);
  const [ox2, oy2] = pt(R_OUT, o2);
  const [ix2, iy2] = pt(R_IN, i2);
  const [ix1, iy1] = pt(R_IN, i1);
  return `M ${ox1} ${oy1} A ${R_OUT} ${R_OUT} 0 0 1 ${ox2} ${oy2} L ${ix2} ${iy2} A ${R_IN} ${R_IN} 0 0 0 ${ix1} ${iy1} Z`;
};

const isFlipped = (mid: number) => mid > 90 && mid < 270;

const lineArc = (rc: number, a1: number, a2: number, flipped: boolean) => {
  const g = inset(rc);
  const base = flipped ? rc + 5 : rc - 5;
  return flipped
    ? arc(base, a2 - g, a1 + g, 0)
    : arc(base, a1 + g, a2 - g, 1);
};

const catArc = (a1: number, a2: number, flipped: boolean) =>
  flipped ? arc(R_LABEL + 6, a2, a1, 0) : arc(R_LABEL - 5, a1, a2, 1);

type Line = {
  text: string;
  pathId: string;
  textLength?: number;
};

const lines: Line[][] = SEGMENTS.map((seg, si) => {
  const a1 = si * 30;
  const a2 = a1 + 30;
  const flipped = isFlipped(a1 + 15);
  const radii =
    seg.lines.length === 1 ? [R_SINGLE] : [R_L1, R_L2];
  return seg.lines.map((text, li) => {
    const rc = radii[li];
    const sweep = 30 - 2 * inset(rc);
    const arcLen = 2 * Math.PI * rc * (sweep / 360) - 10;
    const natural = text.length * 8.7;
    return {
      text,
      pathId: `line-${si}-${li}`,
      textLength: natural > arcLen ? arcLen : undefined,
    };
  });
});

const SkillsWheel = () => (
  <svg
    viewBox="0 0 800 800"
    role="img"
    aria-label="Skills wheel: functional skills, AI fluency and behavioural skills around a candidate"
    className="w-full max-w-[620px] mx-auto block"
  >
    <defs>
      <clipPath id="wheel-face">
        <circle cx={C} cy={C} r={R_FACE} />
      </clipPath>
      {SEGMENTS.map((seg, si) => {
        const a1 = si * 30;
        const flipped = isFlipped(a1 + 15);
        const radii = seg.lines.length === 1 ? [R_SINGLE] : [R_L1, R_L2];
        return radii.map((rc, li) => (
          <path
            key={`line-${si}-${li}`}
            id={`line-${si}-${li}`}
            d={lineArc(rc, a1, a1 + 30, flipped)}
          />
        ));
      })}
      {GROUPS.map((g, gi) => (
        <path
          key={`cat-${gi}`}
          id={`cat-${gi}`}
          d={catArc(g.center - 20, g.center + 20, isFlipped(g.center))}
        />
      ))}
    </defs>

    {SEGMENTS.map((seg, si) => (
      <path
        key={`seg-${si}`}
        d={segPath(si * 30, si * 30 + 30)}
        fill="hsl(var(--primary))"
        fillOpacity={GROUPS[seg.group].name === "Functional Skills" ? 1 : GROUPS[seg.group].name === "AI Fluency" ? 0.9 : 0.78}
        style={{
          animation: "wheel-in .5s ease-out both",
          animationDelay: `${si * 45}ms`,
          transformOrigin: `${C}px ${C}px`,
        }}
      />
    ))}

    {lines.map((group, si) =>
      group.map(({ text, pathId, textLength }) => (
        <text
          key={`${pathId}-${text}`}
          fill="hsl(var(--primary-foreground))"
          fontSize={16}
          fontWeight={600}
          className="font-sans select-none"
        >
          <textPath
            href={`#${pathId}`}
            startOffset="50%"
            textAnchor="middle"
            textLength={textLength}
            lengthAdjust={textLength ? "spacingAndGlyphs" : undefined}
          >
            {text}
          </textPath>
        </text>
      )),
    )}

    {GROUPS.map((g, gi) => {
      const flipped = isFlipped(g.center);
      const half = 16;
      return (
        <g key={g.name}>
          <path
            d={
              flipped
                ? arc(R_HAIR, g.center + half, g.center + 120 - half, 0)
                : arc(R_HAIR, g.center + half, g.center + 120 - half, 1)
            }
            fill="none"
            stroke="hsl(var(--primary))"
            strokeOpacity={0.45}
            strokeWidth={1}
          />
          <text
            fill="hsl(var(--primary))"
            fontSize={13}
            fontWeight={700}
            letterSpacing={3.2}
            className="font-sans uppercase select-none"
          >
            <textPath
              href={`#cat-${gi}`}
              startOffset="50%"
              textAnchor="middle"
            >
              {g.name}
            </textPath>
          </text>
        </g>
      );
    })}

    <image
      href={portrait}
      x={C - 220}
      y={C - 222}
      width={440}
      height={490}
      clipPath="url(#wheel-face)"
      style={{ filter: "grayscale(1) contrast(1.05)" }}
    />
  </svg>
);

const Home3SkillsWheel = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className="w-full"
  >
    <SkillsWheel />
  </motion.div>
);

export default Home3SkillsWheel;
