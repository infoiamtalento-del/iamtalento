import { useId } from "react";

import { wheelSectors } from "./data";

const C = 260;
const OUTER = 224;
const INNER = 174;
const LABEL_R = 199;
const SPAN = 28;

/** Angles run clockwise from 12 o'clock. */
const polar = (r: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [C + r * Math.sin(a), C - r * Math.cos(a)];
};
const pt = ([x, y]: [number, number]) => `${x.toFixed(2)} ${y.toFixed(2)}`;

const sectorPath = (index: number) => {
  const a0 = -29 + 30 * index;
  const a1 = a0 + SPAN;
  return [
    `M ${pt(polar(OUTER, a0))}`,
    `A ${OUTER} ${OUTER} 0 0 1 ${pt(polar(OUTER, a1))}`,
    `L ${pt(polar(INNER, a1))}`,
    `A ${INNER} ${INNER} 0 0 0 ${pt(polar(INNER, a0))}`,
    "Z",
  ].join(" ");
};

const arc = (r: number, from: number, to: number) =>
  `M ${pt(polar(r, from))} A ${r} ${r} 0 0 ${to > from ? 1 : 0} ${pt(polar(r, to))}`;

/** Keep sector labels upright, never upside-down. */
const upright = (rot: number) => (rot > 90 ? rot - 180 : rot < -90 ? rot + 180 : rot);

const SkillWheel = ({ portrait, portraitAlt }: { portrait: string; portraitAlt: string }) => {
  const uid = useId().replace(/:/g, "");
  const topId = `${uid}-top`;
  const rightId = `${uid}-right`;
  const leftId = `${uid}-left`;

  return (
    <div className="h2-wheel">
      <svg viewBox="0 0 520 520" role="img" aria-label="Twelve skills measured by the IAmTalento assessment">
        <defs>
          <path id={topId} d={arc(236, -28, 28)} />
          <path id={rightId} d={arc(246, 172, 112)} />
          <path id={leftId} d={arc(246, 248, 188)} />
        </defs>

        <g className="h2-wheel-arcs">
          <path d={arc(252, 58, 112)} />
          <path d={arc(252, 170, 190)} />
          <path d={arc(252, 248, 302)} />
        </g>

        <g className="h2-wheel-sectors">
          {wheelSectors.map((sector) => {
            const mid = -29 + 30 * sector.index + SPAN / 2;
            const [x, y] = polar(LABEL_R, mid);
            const rot = upright(mid);
            const offset = (sector.lines.length - 1) * 6.5;
            return (
              <g key={sector.index}>
                <path d={sectorPath(sector.index)} />
                <text transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rot.toFixed(2)})`} textAnchor="middle">
                  {sector.lines.map((line, i) => (
                    <tspan key={line} x={0} y={i * 13 - offset + 4}>
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
        </g>

        <g className="h2-wheel-cats">
          <text>
            <textPath href={`#${topId}`} startOffset="50%" textAnchor="middle">
              TECHNICAL SKILLS
            </textPath>
          </text>
          <text>
            <textPath href={`#${rightId}`} startOffset="50%" textAnchor="middle">
              PROCTORED &amp; VERIFIED
            </textPath>
          </text>
          <text>
            <textPath href={`#${leftId}`} startOffset="50%" textAnchor="middle">
              PROFESSIONAL SKILLS
            </textPath>
          </text>
        </g>
      </svg>

      <div className="h2-wheel-portrait">
        <img src={portrait} alt={portraitAlt} />
      </div>

      <div className="h2-wheel-score">
        <b>82</b>
        <div>
          <small>Readiness score</small>
          <span>Industry Ready</span>
        </div>
      </div>
    </div>
  );
};

export default SkillWheel;
