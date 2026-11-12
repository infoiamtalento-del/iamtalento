import type { CirReport } from "@/services/employer/talent";

const SECTION_LABELS: Record<string, string> = {
  readiness: "Industry readiness",
  domain: "Domain assessment",
  communication: "Communication",
  psychometric: "Psychometric",
  vocational: "Vocational aptitude",
  hr_judgment: "HR judgement",
  ai_interview: "AI interview",
  integrity: "Integrity & proctoring",
};

/** Flattens a section object into printable "Label: value" rows. */
export function sectionRows(sections: unknown): Array<{ title: string; lines: string[] }> {
  if (!sections || typeof sections !== "object" || Array.isArray(sections)) return [];
  const rows: Array<{ title: string; lines: string[] }> = [];
  for (const [key, value] of Object.entries(sections as Record<string, unknown>)) {
    if (value == null || typeof value !== "object") continue;
    const lines = Object.entries(value as Record<string, unknown>)
      .filter(([k, v]) => v != null && typeof v !== "object" && k !== "attempt_id")
      .map(([k, v]) => `${k.replace(/_/g, " ")}: ${typeof v === "number" ? Math.round(v * 100) / 100 : String(v)}`);
    const skills = (value as { skills?: unknown }).skills;
    if (Array.isArray(skills) && skills.length) lines.push(`skills: ${skills.join(", ")}`);
    rows.push({ title: SECTION_LABELS[key] ?? key.replace(/_/g, " "), lines });
  }
  return rows;
}

export const cirFileName = (report: Pick<CirReport, "talent_cir_id" | "candidate_name">) =>
  `CIR-${(report.talent_cir_id ?? report.candidate_name ?? "report").replace(/[^a-z0-9]+/gi, "-")}.pdf`;

/** Builds and downloads the CIR report PDF from the entitlement-checked report payload. */
export async function downloadCirPdf(report: CirReport): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  let y = 22;
  const line = (text: string, size = 11, gap = 6, bold = false) => {
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.setFontSize(size);
    for (const part of pdf.splitTextToSize(text, 170) as string[]) {
      if (y > 280) { pdf.addPage(); y = 20; }
      pdf.text(part, 20, y);
      y += gap;
    }
  };

  line("Career Intelligence Report (CIR)", 20, 10, true);
  line(report.candidate_name ?? "Candidate", 14, 8, true);
  line(`Talent CIR ID: ${report.talent_cir_id ?? "—"}`, 11, 6);
  line(`Generated: ${new Date(report.generated_at).toLocaleDateString("en-GB")}  ·  Version ${report.version}`, 10, 10);
  line(`Composite score: ${Math.round(report.composite_score)} / 100`, 13, 7, true);
  line(`Tier: ${report.tier ?? "—"}   Percentile: ${report.percentile != null ? Math.round(report.percentile) : "—"}   Integrity: ${report.integrity_score != null ? Math.round(report.integrity_score) : "—"}`, 11, 10);
  for (const section of sectionRows(report.sections)) {
    line(section.title, 12, 6, true);
    for (const l of section.lines) line(`• ${l}`, 10, 5);
    y += 3;
  }
  pdf.save(cirFileName(report));
}
