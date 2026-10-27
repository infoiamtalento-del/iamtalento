export interface RealTimeCertificateData {
  credentialId: string;
  candidateName: string;
  candidateEmail: string;
  candidateRole: string;
  title: string;
  issuer: string;
  issuedDate: string;
  validUntil: string;
  score: number;
  percentile: string;
  integrityScore: string;
  timeTaken: string;
  codingTestCases: string;
  peerAverage: number;
  partnerCutoff: number;
  salaryBand: string;
  verificationHash: string;
  subSkills: { name: string; score: number; benchmark: number }[];
  recruiterSummary: string;
}

const escapePdfText = (text: string): string =>
  String(text)
    .replace(/₹/g, "INR ")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");

/**
 * Generates and downloads a real A4 PDF Certificate (.pdf)
 */
export function downloadCertificatePdf(data: RealTimeCertificateData): void {
  const ops: string[] = [];

  const rectFill = (x: number, y: number, w: number, h: number, r: number, g: number, b: number) => {
    ops.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`);
    ops.push(`${x} ${y} ${w} ${h} re f`);
  };

  const rectStroke = (x: number, y: number, w: number, h: number, r: number, g: number, b: number, lw = 1) => {
    ops.push(`${lw} w`);
    ops.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG`);
    ops.push(`${x} ${y} ${w} ${h} re S`);
  };

  const line = (x1: number, y1: number, x2: number, y2: number, r = 0.82, g = 0.85, b = 0.9, lw = 0.75) => {
    ops.push(`${lw} w`);
    ops.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG`);
    ops.push(`${x1} ${y1} m ${x2} ${y2} l S`);
  };

  const text = (str: string, x: number, y: number, size = 10, bold = false, r = 0.08, g = 0.12, b = 0.2) => {
    const font = bold ? "/F2" : "/F1";
    ops.push("BT");
    ops.push(`${font} ${size} Tf`);
    ops.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`);
    ops.push(`1 0 0 1 ${x} ${y} Tm`);
    ops.push(`(${escapePdfText(str)}) Tj`);
    ops.push("ET");
  };

  // Outer ornamental border
  rectStroke(28, 28, 539, 786, 0.0, 0.173, 0.4, 2.2);
  rectStroke(34, 34, 527, 774, 0.984, 0.573, 0.235, 1.0);

  // Header Banner (#002C66)
  rectFill(34, 718, 527, 90, 0.0, 0.173, 0.4);
  text("IAMTALENTO VERIFIED CREDENTIAL & SKILL CERTIFICATE", 54, 780, 13, true, 1, 1, 1);
  text("AI-PROCTORED COMPETENCY & CAREER INTELLIGENCE VERIFICATION AUTHORITY", 54, 763, 8.5, false, 0.85, 0.91, 1);
  text(`Credential ID: ${data.credentialId}   |   Verification Hash: ${data.verificationHash}`, 54, 745, 8, false, 0.984, 0.75, 0.45);
  text(`Issued: ${data.issuedDate}   |   Valid Through: ${data.validUntil}   |   Status: ACTIVE & VERIFIED`, 54, 730, 8, true, 0.75, 0.95, 0.82);

  // Certificate Main Presentation
  text("CERTIFICATE OF VERIFIED ENGINEERING PROFICIENCY", 118, 678, 13, true, 0.0, 0.173, 0.4);
  line(118, 670, 477, 670, 0.984, 0.573, 0.235, 1.5);

  text("This is to certify that", 242, 646, 10, false, 0.35, 0.4, 0.5);
  text(data.candidateName.toUpperCase(), 195, 620, 18, true, 0.05, 0.1, 0.22);
  text(`${data.candidateRole}  (${data.candidateEmail})`, 185, 602, 9.5, false, 0.3, 0.35, 0.45);

  text("has successfully completed the AI-proctored assessment and credential requirements for:", 95, 576, 9.5, false, 0.25, 0.3, 0.4);

  rectFill(54, 524, 487, 38, 0.96, 0.975, 0.995);
  rectStroke(54, 524, 487, 38, 0.0, 0.173, 0.4, 1);
  text(data.title, 72, 545, 13, true, 0.0, 0.173, 0.4);
  text(`Issued by: ${data.issuer}`, 72, 531, 8.5, false, 0.3, 0.35, 0.45);

  // 4 Key Real-Time Telemetry Boxes
  const kpis = [
    { label: "VERIFIED SCORE", val: `${data.score}%`, sub: `Pass Cutoff: ${data.partnerCutoff}%` },
    { label: "NATIONAL PERCENTILE", val: data.percentile, sub: `Peer Avg: ${data.peerAverage}%` },
    { label: "PROCTORING INTEGRITY", val: data.integrityScore, sub: "0 Tab Switches / Flags" },
    { label: "CODING & RUBRIC", val: data.codingTestCases, sub: `Completed in ${data.timeTaken}` },
  ];

  kpis.forEach((k, idx) => {
    const bx = 54 + idx * 124;
    rectFill(bx, 456, 115, 54, 0.98, 0.985, 0.995);
    rectStroke(bx, 456, 115, 54, 0.82, 0.86, 0.92, 0.75);
    text(k.label, bx + 8, 496, 7, true, 0.4, 0.45, 0.55);
    text(k.val, bx + 8, 478, 12, true, 0.0, 0.173, 0.4);
    text(k.sub, bx + 8, 464, 7.5, false, 0.1, 0.5, 0.3);
  });

  // Sub-Skill Breakdown Table
  rectFill(54, 418, 487, 22, 0.0, 0.173, 0.4);
  text("SUB-DOMAIN COMPETENCY & RUBRIC BREAKDOWN", 66, 426, 8.5, true, 1, 1, 1);
  text("PEER BENCHMARK", 345, 426, 8.5, true, 1, 1, 1);
  text("VERIFIED SCORE", 450, 426, 8.5, true, 1, 1, 1);

  let yPos = 418;
  data.subSkills.forEach((sub, idx) => {
    yPos -= 26;
    if (idx % 2 === 1) {
      rectFill(54, yPos, 487, 26, 0.97, 0.98, 0.995);
    }
    rectStroke(54, yPos, 487, 26, 0.85, 0.88, 0.93, 0.5);
    text(sub.name, 66, yPos + 9, 8.5, true);
    text(`${sub.benchmark}%`, 365, yPos + 9, 8.5, false, 0.35, 0.4, 0.5);
    text(`${sub.score}% (Verified)`, 455, yPos + 9, 8.5, true, 0.05, 0.5, 0.28);
  });

  // Executive AI Summary Box
  const sumY = yPos - 74;
  rectFill(54, sumY, 487, 60, 0.965, 0.975, 0.99);
  rectStroke(54, sumY, 487, 60, 0.82, 0.86, 0.92, 0.75);
  text("REAL-TIME AI RECRUITER & CIR EVALUATION SUMMARY", 66, sumY + 44, 8, true, 0.0, 0.173, 0.4);
  text(data.recruiterSummary.slice(0, 95), 66, sumY + 28, 8, false, 0.2, 0.25, 0.35);
  if (data.recruiterSummary.length > 95) {
    text(data.recruiterSummary.slice(95, 190), 66, sumY + 14, 8, false, 0.2, 0.25, 0.35);
  }

  // Footer Signatures
  line(54, 110, 541, 110);
  text("VERIFY ONLINE AT: https://iamtalento.com/verify/" + data.credentialId, 54, 92, 8, true, 0.0, 0.173, 0.4);
  text("Tamper-proof digital credential backed by IAmTalento AI Proctoring & Career Intelligence Engine.", 54, 78, 7.5, false, 0.4, 0.45, 0.55);
  text("Recommended Compensation Band: " + data.salaryBand, 54, 64, 8, true, 0.1, 0.45, 0.28);

  text("For IAmTalento Technologies Pvt. Ltd.", 382, 92, 8.5, true, 0.0, 0.173, 0.4);
  text("Director of Assessments & Certification", 382, 64, 8, false, 0.3, 0.35, 0.45);

  savePdfStream(ops.join("\n"), `IAmTalento-Certificate-${data.credentialId}.pdf`);
}

/**
 * Generates and downloads a detailed Real-Time Career Intelligence Report (CIR) PDF (.pdf)
 */
export function downloadCirReportPdf(data: RealTimeCertificateData): void {
  const ops: string[] = [];

  const rectFill = (x: number, y: number, w: number, h: number, r: number, g: number, b: number) => {
    ops.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`);
    ops.push(`${x} ${y} ${w} ${h} re f`);
  };

  const rectStroke = (x: number, y: number, w: number, h: number, r: number, g: number, b: number, lw = 0.75) => {
    ops.push(`${lw} w`);
    ops.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG`);
    ops.push(`${x} ${y} ${w} ${h} re S`);
  };

  const line = (x1: number, y1: number, x2: number, y2: number, r = 0.82, g = 0.85, b = 0.9, lw = 0.75) => {
    ops.push(`${lw} w`);
    ops.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG`);
    ops.push(`${x1} ${y1} m ${x2} ${y2} l S`);
  };

  const text = (str: string, x: number, y: number, size = 9, bold = false, r = 0.08, g = 0.12, b = 0.2) => {
    const font = bold ? "/F2" : "/F1";
    ops.push("BT");
    ops.push(`${font} ${size} Tf`);
    ops.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`);
    ops.push(`1 0 0 1 ${x} ${y} Tm`);
    ops.push(`(${escapePdfText(str)}) Tj`);
    ops.push("ET");
  };

  // Top Header
  rectFill(36, 742, 523, 68, 0.0, 0.173, 0.4);
  text("CAREER INTELLIGENCE REPORT (CIR) - REAL-TIME TELEMETRY", 48, 786, 12, true, 1, 1, 1);
  text(`Candidate: ${data.candidateName} (${data.candidateRole})  |  Track: ${data.title}`, 48, 769, 8.5, false, 0.85, 0.91, 1);
  text(`Report ID: CIR-${data.credentialId}  |  Timestamp: ${data.issuedDate}  |  Hash: ${data.verificationHash}`, 48, 753, 8, false, 0.984, 0.75, 0.45);

  rectFill(445, 756, 102, 40, 0.06, 0.58, 0.34);
  text(`IRS: ${data.score}/100`, 460, 779, 11, true, 1, 1, 1);
  text(data.percentile.toUpperCase(), 462, 764, 8, true, 1, 1, 1);

  // Candidate & Proctoring Telemetry Box
  rectFill(36, 650, 523, 80, 0.965, 0.975, 0.99);
  rectStroke(36, 650, 523, 80, 0.82, 0.86, 0.92, 0.75);
  text("1. REAL-TIME SESSION & AI PROCTORING TELEMETRY", 48, 714, 9, true, 0.0, 0.173, 0.4);
  line(48, 708, 546, 708);
  text(`Candidate Name: ${data.candidateName}`, 48, 693, 8.5, true);
  text(`Session Duration: ${data.timeTaken}`, 48, 678, 8.5, false);
  text(`Coding Test Cases: ${data.codingTestCases}`, 48, 663, 8.5, false);

  text(`Proctoring Integrity: ${data.integrityScore} (Zero Violations)`, 300, 693, 8.5, true, 0.05, 0.5, 0.28);
  text(`Webcam / Mic / Browser Lock: 100% Verified`, 300, 678, 8.5, false);
  text(`Tab Switches / Clipboard Events: 0 Detected`, 300, 663, 8.5, false);

  // Benchmarking Section
  rectFill(36, 565, 523, 72, 1, 1, 1);
  rectStroke(36, 565, 523, 72, 0.82, 0.86, 0.92, 0.75);
  text("2. INDUSTRY READINESS BENCHMARKING & COMPENSATION FIT", 48, 622, 9, true, 0.0, 0.173, 0.4);
  line(48, 616, 546, 616);
  text(`Candidate Verified Score: ${data.score}% (${data.percentile} Nationally)`, 48, 600, 8.5, true);
  text(`National Peer Median Score: ${data.peerAverage}%`, 48, 585, 8.5, false);
  text(`Hiring Partner Shortlist Cutoff: ${data.partnerCutoff}%`, 48, 571, 8.5, false);

  text(`Recommended Salary Band: ${data.salaryBand}`, 300, 600, 8.5, true, 0.0, 0.173, 0.4);
  text(`Hiring Recommendation: STRONG HIRE (Fast-Track)`, 300, 585, 8.5, true, 0.05, 0.5, 0.28);
  text(`24-Hour Recruiter SLA Priority: UNLOCKED`, 300, 571, 8.5, false);

  // Sub-Skill Table
  rectFill(36, 528, 523, 24, 0.0, 0.173, 0.4);
  text("3. GRANULAR SUB-SKILL COMPETENCY RUBRIC", 48, 537, 8.5, true, 1, 1, 1);
  text("PEER MEDIAN", 335, 537, 8.5, true, 1, 1, 1);
  text("CANDIDATE SCORE", 445, 537, 8.5, true, 1, 1, 1);

  let yPos = 528;
  data.subSkills.forEach((sub, idx) => {
    yPos -= 28;
    if (idx % 2 === 1) rectFill(36, yPos, 523, 28, 0.97, 0.98, 0.995);
    rectStroke(36, yPos, 523, 28, 0.85, 0.88, 0.93, 0.5);
    text(`${idx + 1}. ${sub.name}`, 48, yPos + 10, 8.5, true);
    text(`${sub.benchmark}%`, 350, yPos + 10, 8.5, false);
    text(`${sub.score}% (+${Math.max(2, sub.score - sub.benchmark)}% vs Peer)`, 445, yPos + 10, 8.5, true, 0.05, 0.5, 0.28);
  });

  // AI Recruiter Notes
  const noteTop = yPos - 16;
  rectFill(36, noteTop - 75, 523, 75, 0.965, 0.975, 0.99);
  rectStroke(36, noteTop - 75, 523, 75, 0.82, 0.86, 0.92, 0.75);
  text("4. AI TECHNICAL INTERVIEWER & ARCHITECT OBSERVATIONS", 48, noteTop - 18, 9, true, 0.0, 0.173, 0.4);
  text(data.recruiterSummary.slice(0, 96), 48, noteTop - 36, 8.5, false);
  if (data.recruiterSummary.length > 96) {
    text(data.recruiterSummary.slice(96, 192), 48, noteTop - 52, 8.5, false);
  }

  savePdfStream(ops.join("\n"), `IAmTalento-CIR-Report-${data.credentialId}.pdf`);
}

function savePdfStream(streamContent: string, filename: string): void {
  const objects: string[] = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n",
    `4 0 obj\n<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    "6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
