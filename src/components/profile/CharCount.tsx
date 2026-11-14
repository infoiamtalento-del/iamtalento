import { parseDescriptionBlocks } from "./profileFormatters";

interface CharCountProps {
  value: string | null | undefined;
  max: number;
  className?: string;
}

/**
 * Live character limit indicator intended to sit in the label row above an input/textarea
 * so autocomplete popovers and mobile keyboards never cover the constraint hint.
 * Uses non-color text cue ("· Max") when reaching the limit.
 */
export function CharCount({ value, max, className = "" }: CharCountProps) {
  const len = (value || "").length;
  const near = len >= Math.floor(max * 0.9);
  const reached = len >= max;

  return (
    <span
      className={`text-[11px] tabular-nums select-none shrink-0 ${
        reached
          ? "text-amber-700 font-semibold"
          : near
            ? "text-foreground/75 font-medium"
            : "text-muted-foreground"
      } ${className}`}
      aria-live="off"
    >
      {len}/{max}
      {reached ? " · Max" : ""}
    </span>
  );
}

interface FormattedDescriptionProps {
  text: string | null | undefined;
  className?: string;
  paragraphClassName?: string;
}

/**
 * Renders multi-line summaries, experience descriptions, and project descriptions cleanly:
 * - Lines starting with `- `, `• `, `* `, `· `, or `1. ` render as proper `<ul><li>` lists.
 * - Prose lines render as `<p>` blocks with `overflow-wrap: break-word`.
 */
export function FormattedDescription({
  text,
  className = "",
  paragraphClassName = "",
}: FormattedDescriptionProps) {
  const blocks = parseDescriptionBlocks(text);
  if (blocks.length === 0) return null;

  return (
    <div className={`space-y-2 break-words ${className}`}>
      {blocks.map((block, idx) =>
        block.type === "ul" ? (
          <ul key={idx} className="dp-bullet-list">
            {block.items.map((item, i) => (
              <li key={i} className="break-words">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p key={idx} className={`break-words ${paragraphClassName}`}>
            {block.items[0]}
          </p>
        )
      )}
    </div>
  );
}
