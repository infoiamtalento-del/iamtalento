export interface DetailedInvoiceItem {
  id: string;
  invoiceNo: string;
  date: string;
  dueDate: string;
  title: string;
  subtitle: string;
  sacCode: string;
  billingCycle: string;
  qty: number;
  baseAmount: number;
  cgstRate: number;
  sgstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  totalAmount: number;
  paymentMethod: string;
  transactionRef: string;
  status: "Paid" | "Verified";
  role: "employer" | "employee";
  billedTo: {
    name: string;
    organization?: string;
    email: string;
    address: string;
    gstinOrPan: string;
    customerCode: string;
  };
  lineItems: {
    description: string;
    sac: string;
    qty: string;
    unitPrice: number;
    amount: number;
  }[];
}

const escapePdfText = (text: string): string =>
  String(text)
    .replace(/₹/g, "INR ")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");

const fmtInrPdf = (num: number): string =>
  `INR ${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/**
 * Generates a valid, standalone, detailed A4 PDF document (%PDF-1.4)
 * with vector tables, company header, tax breakdown, and payment metadata.
 */
export function downloadDetailedInvoicePdf(inv: DetailedInvoiceItem): void {
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

  const text = (
    str: string,
    x: number,
    y: number,
    size = 9,
    bold = false,
    r = 0.08,
    g = 0.12,
    b = 0.2
  ) => {
    const font = bold ? "/F2" : "/F1";
    ops.push("BT");
    ops.push(`${font} ${size} Tf`);
    ops.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`);
    ops.push(`1 0 0 1 ${x} ${y} Tm`);
    ops.push(`(${escapePdfText(str)}) Tj`);
    ops.push("ET");
  };

  // Top Header Navy Banner (#002C66 -> r:0, g:0.173, b:0.4)
  rectFill(36, 742, 523, 68, 0.0, 0.173, 0.4);
  text("IAMTALENTO TECHNOLOGIES PRIVATE LIMITED", 52, 786, 13, true, 1, 1, 1);
  text(
    inv.role === "employer"
      ? "ENTERPRISE RECRUITER STUDIO & TALENT INTELLIGENCE PLATFORM"
      : "TALENTO PRO VERIFIED CANDIDATE & CAREER ACCELERATION HUB",
    52,
    771,
    8,
    false,
    0.85,
    0.91,
    1
  );
  text("GSTIN: 29AABCI9482K1Z5  |  CIN: U72900KA2024PTC182940  |  PAN: AABCI9482K", 52, 755, 8, false, 0.8, 0.88, 1);

  // Right badge inside header
  rectFill(432, 756, 112, 40, 0.984, 0.573, 0.235); // #FB923C orange badge
  text("TAX INVOICE", 452, 779, 11, true, 1, 1, 1);
  text("ORIGINAL FOR RECIPIENT", 442, 765, 7, true, 1, 1, 1);

  // Invoice Meta Strip
  rectFill(36, 694, 523, 40, 0.96, 0.97, 0.99);
  rectStroke(36, 694, 523, 40, 0.82, 0.86, 0.92, 0.75);

  text("INVOICE NUMBER", 48, 720, 7.5, true, 0.4, 0.45, 0.55);
  text(inv.invoiceNo, 48, 705, 9.5, true, 0.0, 0.173, 0.4);

  text("INVOICE DATE", 180, 720, 7.5, true, 0.4, 0.45, 0.55);
  text(inv.date, 180, 705, 9, false, 0.1, 0.15, 0.25);

  text("DUE DATE", 295, 720, 7.5, true, 0.4, 0.45, 0.55);
  text(inv.dueDate, 295, 705, 9, false, 0.1, 0.15, 0.25);

  text("PAYMENT STATUS", 415, 720, 7.5, true, 0.4, 0.45, 0.55);
  text(`${inv.status.toUpperCase()} (VERIFIED)`, 415, 705, 9.5, true, 0.05, 0.55, 0.3);

  // Supplier & Buyer 2-Column Box
  rectStroke(36, 578, 255, 106, 0.82, 0.86, 0.92, 0.75);
  rectStroke(304, 578, 255, 106, 0.82, 0.86, 0.92, 0.75);

  text("SUPPLIER / ISSUED BY", 48, 668, 8, true, 0.0, 0.173, 0.4);
  line(48, 662, 278, 662);
  text("IAmTalento Technologies Pvt. Ltd.", 48, 648, 9.5, true);
  text("Level 8, Prestige Trade Tower, Palace Road", 48, 634, 8.5, false, 0.3, 0.35, 0.45);
  text("Bengaluru, Karnataka - 560001, India", 48, 621, 8.5, false, 0.3, 0.35, 0.45);
  text("GSTIN: 29AABCI9482K1Z5 | State Code: 29 (KA)", 48, 606, 8, true, 0.2, 0.25, 0.35);
  text("Support: billing@iamtalento.com", 48, 591, 8, false, 0.3, 0.35, 0.45);

  text(
    inv.role === "employer" ? "BILLED TO (EMPLOYER ACCOUNT)" : "BILLED TO (EMPLOYEE / CANDIDATE)",
    316,
    668,
    8,
    true,
    0.0,
    0.173,
    0.4
  );
  line(316, 662, 546, 662);
  text(inv.billedTo.organization || inv.billedTo.name, 316, 648, 9.5, true);
  text(`Attn: ${inv.billedTo.name} (${inv.billedTo.customerCode})`, 316, 634, 8.5, false, 0.3, 0.35, 0.45);
  text(inv.billedTo.address, 316, 621, 8.5, false, 0.3, 0.35, 0.45);
  text(inv.billedTo.gstinOrPan, 316, 606, 8, true, 0.2, 0.25, 0.35);
  text(`Email: ${inv.billedTo.email}`, 316, 591, 8, false, 0.3, 0.35, 0.45);

  // Line Items Table Header
  rectFill(36, 542, 523, 24, 0.0, 0.173, 0.4);
  text("#", 46, 551, 8.5, true, 1, 1, 1);
  text("SERVICE DESCRIPTION & PLAN DETAILS", 68, 551, 8.5, true, 1, 1, 1);
  text("SAC CODE", 330, 551, 8.5, true, 1, 1, 1);
  text("QTY / CYCLE", 392, 551, 8.5, true, 1, 1, 1);
  text("AMOUNT (INR)", 472, 551, 8.5, true, 1, 1, 1);

  let currentY = 542;
  inv.lineItems.forEach((item, idx) => {
    const rowH = 34;
    currentY -= rowH;
    if (idx % 2 === 1) {
      rectFill(36, currentY, 523, rowH, 0.975, 0.98, 0.995);
    }
    rectStroke(36, currentY, 523, rowH, 0.85, 0.88, 0.93, 0.5);
    text(String(idx + 1), 46, currentY + 18, 8.5, true);
    text(item.description.slice(0, 48), 68, currentY + 20, 8.5, true);
    if (item.description.length > 48) {
      text(item.description.slice(48, 98), 68, currentY + 9, 7.5, false, 0.4, 0.45, 0.55);
    } else {
      text(`Billing Cycle: ${inv.billingCycle}`, 68, currentY + 9, 7.5, false, 0.4, 0.45, 0.55);
    }
    text(item.sac, 334, currentY + 15, 8.5, false);
    text(item.qty, 394, currentY + 15, 8.5, false);
    text(fmtInrPdf(item.amount), 468, currentY + 15, 8.5, true);
  });

  // Summary & Tax Calculation Box
  const summaryTop = currentY - 14;
  // Left Box: Payment Gateway & Settlement Details
  rectFill(36, summaryTop - 118, 285, 118, 0.965, 0.975, 0.99);
  rectStroke(36, summaryTop - 118, 285, 118, 0.82, 0.86, 0.92, 0.75);
  text("PAYMENT & SETTLEMENT METADATA", 48, summaryTop - 18, 8.5, true, 0.0, 0.173, 0.4);
  line(48, summaryTop - 24, 308, summaryTop - 24);
  text(`Payment Method: ${inv.paymentMethod}`, 48, summaryTop - 40, 8.5, false);
  text(`Gateway Reference: ${inv.transactionRef}`, 48, summaryTop - 55, 8.5, false);
  text(`Billing Period: ${inv.billingCycle}`, 48, summaryTop - 70, 8.5, false);
  text(`Place of Supply: Karnataka (29), India`, 48, summaryTop - 85, 8.5, false);
  text(`Reverse Charge Applicable: No`, 48, summaryTop - 100, 8, false, 0.4, 0.45, 0.55);

  // Right Box: Subtotal, CGST, SGST, Total
  rectStroke(334, summaryTop - 118, 225, 118, 0.82, 0.86, 0.92, 0.75);
  text("Taxable Base Amount:", 346, summaryTop - 24, 8.5, false, 0.3, 0.35, 0.45);
  text(fmtInrPdf(inv.baseAmount), 468, summaryTop - 24, 8.5, true);

  text(`CGST @ ${inv.cgstRate}%:`, 346, summaryTop - 44, 8.5, false, 0.3, 0.35, 0.45);
  text(fmtInrPdf(inv.cgstAmount), 468, summaryTop - 44, 8.5, false);

  text(`SGST @ ${inv.sgstRate}%:`, 346, summaryTop - 64, 8.5, false, 0.3, 0.35, 0.45);
  text(fmtInrPdf(inv.sgstAmount), 468, summaryTop - 64, 8.5, false);

  line(344, summaryTop - 78, 548, summaryTop - 78);
  rectFill(334, summaryTop - 118, 225, 36, 0.0, 0.173, 0.4);
  text("TOTAL INVOICE AMOUNT", 346, summaryTop - 103, 9, true, 1, 1, 1);
  text(fmtInrPdf(inv.totalAmount), 462, summaryTop - 103, 10, true, 0.984, 0.573, 0.235);

  // Footer & Declaration
  const footerY = summaryTop - 165;
  line(36, footerY + 25, 559, footerY + 25);
  text("DECLARATION & TERMS:", 36, footerY + 10, 8, true, 0.0, 0.173, 0.4);
  text(
    "1. This is a computer-generated GST tax invoice sample issued by IAmTalento Technologies Pvt. Ltd.",
    36,
    footerY - 4,
    7.5,
    false,
    0.35,
    0.4,
    0.5
  );
  text(
    "2. All amounts are shown in Indian Rupees (INR) inclusive of 9% CGST and 9% SGST under SAC 998314 / 998519.",
    36,
    footerY - 16,
    7.5,
    false,
    0.35,
    0.4,
    0.5
  );
  text(
    "3. Digital signature not required for electronically verified platform invoices.",
    36,
    footerY - 28,
    7.5,
    false,
    0.35,
    0.4,
    0.5
  );

  text("For IAmTalento Technologies Pvt. Ltd.", 402, footerY + 10, 8, true, 0.0, 0.173, 0.4);
  text("Authorized Digital Signatory", 425, footerY - 24, 8, true, 0.2, 0.25, 0.35);

  const streamContent = ops.join("\n");

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
  link.download = `IAmTalento-Invoice-${inv.invoiceNo}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function buildDetailedInvoicesForUser(user: {
  name: string;
  email: string;
  role?: string;
  cp?: { name?: string; loc?: string };
  wal?: { hist?: any[] };
}): DetailedInvoiceItem[] {
  const isEmployer = user.role === "employer";
  const orgName = user.cp?.name || (isEmployer ? `${user.name} Technologies Pvt. Ltd.` : undefined);
  const city = user.cp?.loc || "Bengaluru, Karnataka - 560102, India";

  if (isEmployer) {
    return [
      {
        id: "INV-EMP-2026-104",
        invoiceNo: "INV-EMP-2026-104",
        date: "24 Oct 2026",
        dueDate: "24 Oct 2026",
        title: "Annual ATS Enterprise Suite & Recruiter Workspace License",
        subtitle: "25 Active Job Slots · Autonomous 24h SLA Pipeline · 5 Recruiter Seats",
        sacCode: "998314",
        billingCycle: "Annual (Oct 2026 - Oct 2027)",
        qty: 1,
        baseAmount: 45000,
        cgstRate: 9,
        sgstRate: 9,
        cgstAmount: 4050,
        sgstAmount: 4050,
        totalAmount: 53100,
        paymentMethod: "Corporate Visa Card ••4242",
        transactionRef: "RZP_LIVE_EMP_98412054",
        status: "Paid",
        role: "employer",
        billedTo: {
          name: user.name,
          organization: orgName,
          email: user.email,
          address: city,
          gstinOrPan: "Customer GSTIN: 29AAACZ4821M1Z8",
          customerCode: "EMP-CORP-1048",
        },
        lineItems: [
          {
            description: "Annual ATS Enterprise Suite License (25 Job Slots + Talent Search)",
            sac: "998314",
            qty: "1 Year",
            unitPrice: 35000,
            amount: 35000,
          },
          {
            description: "Multi-Recruiter Collaborative Seats & Automated 24h SLA Engine (5 Seats)",
            sac: "998314",
            qty: "5 Seats",
            unitPrice: 2000,
            amount: 10000,
          },
        ],
      },
      {
        id: "INV-EMP-2026-098",
        invoiceNo: "INV-EMP-2026-098",
        date: "15 Oct 2026",
        dueDate: "15 Oct 2026",
        title: "AI-Proctored Technical Assessment Library (50 Candidate Credits)",
        subtitle: "Cheating Prevention · Live Coding Sandbox · Instant CIR Scorecards",
        sacCode: "998314",
        billingCycle: "Quarterly Pack",
        qty: 50,
        baseAmount: 12500,
        cgstRate: 9,
        sgstRate: 9,
        cgstAmount: 1125,
        sgstAmount: 1125,
        totalAmount: 14750,
        paymentMethod: "HDFC Corporate NetBanking",
        transactionRef: "UTR_HDFC_662910482",
        status: "Paid",
        role: "employer",
        billedTo: {
          name: user.name,
          organization: orgName,
          email: user.email,
          address: city,
          gstinOrPan: "Customer GSTIN: 29AAACZ4821M1Z8",
          customerCode: "EMP-CORP-1048",
        },
        lineItems: [
          {
            description: "AI-Proctored Engineering Skill Assessments (50 Candidate Seat Credits)",
            sac: "998314",
            qty: "50 Credits",
            unitPrice: 250,
            amount: 12500,
          },
        ],
      },
      {
        id: "INV-EMP-2026-089",
        invoiceNo: "INV-EMP-2026-089",
        date: "02 Oct 2026",
        dueDate: "02 Oct 2026",
        title: "Featured Job Promotion & Priority Candidate Spotlight Pack",
        subtitle: "Pinned Placement in Candidate Feed · Instant Push Alerts to Top 10% Engineers",
        sacCode: "998361",
        billingCycle: "30-Day Campaign",
        qty: 1,
        baseAmount: 5000,
        cgstRate: 9,
        sgstRate: 9,
        cgstAmount: 450,
        sgstAmount: 450,
        totalAmount: 5900,
        paymentMethod: "UPI Corporate VPA (accounts@okhdfcbank)",
        transactionRef: "UPI_REF_429581029412",
        status: "Paid",
        role: "employer",
        billedTo: {
          name: user.name,
          organization: orgName,
          email: user.email,
          address: city,
          gstinOrPan: "Customer GSTIN: 29AAACZ4821M1Z8",
          customerCode: "EMP-CORP-1048",
        },
        lineItems: [
          {
            description: "Featured Employer Brand Banner & Priority Role Spotlight (30 Days)",
            sac: "998361",
            qty: "1 Campaign",
            unitPrice: 5000,
            amount: 5000,
          },
        ],
      },
      {
        id: "INV-EMP-2026-074",
        invoiceNo: "INV-EMP-2026-074",
        date: "18 Sep 2026",
        dueDate: "18 Sep 2026",
        title: "Corporate Learning Cohort — Generative AI & LLM Systems",
        subtitle: "18 Enrolled Engineers · Hands-on Capstone Evaluation & Certification",
        sacCode: "999293",
        billingCycle: "8-Week Cohort",
        qty: 18,
        baseAmount: 28000,
        cgstRate: 9,
        sgstRate: 9,
        cgstAmount: 2520,
        sgstAmount: 2520,
        totalAmount: 33040,
        paymentMethod: "Corporate Visa Card ••4242",
        transactionRef: "RZP_LIVE_EMP_77120498",
        status: "Paid",
        role: "employer",
        billedTo: {
          name: user.name,
          organization: orgName,
          email: user.email,
          address: city,
          gstinOrPan: "Customer GSTIN: 29AAACZ4821M1Z8",
          customerCode: "EMP-CORP-1048",
        },
        lineItems: [
          {
            description: "Enterprise Workforce Upskilling Cohort: Generative AI & LLM Engineering",
            sac: "999293",
            qty: "1 Cohort (18 Seats)",
            unitPrice: 28000,
            amount: 28000,
          },
        ],
      },
    ];
  }

  // Employee / Candidate detailed sample invoices
  return [
    {
      id: "INV-CAND-2026-312",
      invoiceNo: "INV-CAND-2026-312",
      date: "25 Oct 2026",
      dueDate: "25 Oct 2026",
      title: "Talento Pro Verified Career Booster & Recruiter Spotlight",
      subtitle: "Priority 24h SLA Shortlist Badge · Top-of-Feed Profile Placement · AI Guidance",
      sacCode: "998519",
      billingCycle: "Quarterly Pro Membership",
      qty: 1,
      baseAmount: 1000,
      cgstRate: 9,
      sgstRate: 9,
      cgstAmount: 90,
      sgstAmount: 90,
      totalAmount: 1180,
      paymentMethod: "UPI · yogesh@okaxis",
      transactionRef: "UPI_TXN_630294817264",
      status: "Paid",
      role: "employee",
      billedTo: {
        name: user.name,
        email: user.email,
        address: city,
        gstinOrPan: "Candidate PAN: ABCDE1234F (Individual)",
        customerCode: "CAND-PRO-8842",
      },
      lineItems: [
        {
          description: "Talento Pro Candidate Spotlight & Verified Badge Subscription (90 Days)",
          sac: "998519",
          qty: "1 Quarter",
          unitPrice: 750,
          amount: 750,
        },
        {
          description: "AI Career Guidance & Unlimited ATS Resume Tailoring Credits",
          sac: "998314",
          qty: "1 Add-on",
          unitPrice: 250,
          amount: 250,
        },
      ],
    },
    {
      id: "INV-CAND-2026-287",
      invoiceNo: "INV-CAND-2026-287",
      date: "14 Oct 2026",
      dueDate: "14 Oct 2026",
      title: "AI-Proctored Skill Assessment & CIR Certification Bundle",
      subtitle: "React, TypeScript & System Design Proctored Exams + Verifiable QR Certificates",
      sacCode: "999293",
      billingCycle: "One-Time Assessment Bundle",
      qty: 3,
      baseAmount: 1500,
      cgstRate: 9,
      sgstRate: 9,
      cgstAmount: 135,
      sgstAmount: 135,
      totalAmount: 1770,
      paymentMethod: "Visa Credit Card ••4242",
      transactionRef: "RZP_CAND_55920184",
      status: "Paid",
      role: "employee",
      billedTo: {
        name: user.name,
        email: user.email,
        address: city,
        gstinOrPan: "Candidate PAN: ABCDE1234F (Individual)",
        customerCode: "CAND-PRO-8842",
      },
      lineItems: [
        {
          description: "AI-Proctored Advanced Skill Assessments (React, TypeScript, System Design)",
          sac: "999293",
          qty: "3 Exams",
          unitPrice: 500,
          amount: 1500,
        },
      ],
    },
    {
      id: "INV-CAND-2026-241",
      invoiceNo: "INV-CAND-2026-241",
      date: "03 Oct 2026",
      dueDate: "03 Oct 2026",
      title: "1-on-1 FAANG Senior Architect Mock Interview & Rubric Audit",
      subtitle: "60-Min Live System Design Session + Detailed Competency Scorecard",
      sacCode: "998399",
      billingCycle: "Single Mentorship Session",
      qty: 1,
      baseAmount: 2000,
      cgstRate: 9,
      sgstRate: 9,
      cgstAmount: 180,
      sgstAmount: 180,
      totalAmount: 2360,
      paymentMethod: "HDFC NetBanking",
      transactionRef: "UTR_HDFC_883920144",
      status: "Paid",
      role: "employee",
      billedTo: {
        name: user.name,
        email: user.email,
        address: city,
        gstinOrPan: "Candidate PAN: ABCDE1234F (Individual)",
        customerCode: "CAND-PRO-8842",
      },
      lineItems: [
        {
          description: "1-on-1 Senior Engineering Mentor Mock Interview & Portfolio Review",
          sac: "998399",
          qty: "1 Session",
          unitPrice: 2000,
          amount: 2000,
        },
      ],
    },
    {
      id: "INV-CAND-2026-198",
      invoiceNo: "INV-CAND-2026-198",
      date: "21 Sep 2026",
      dueDate: "21 Sep 2026",
      title: "Video Resume Studio HD Hosting & Public Portfolio Domain Sync",
      subtitle: "Full-Page Video Resume Streaming + Custom Verifiable Portfolio Link",
      sacCode: "998315",
      billingCycle: "Annual Add-on",
      qty: 1,
      baseAmount: 500,
      cgstRate: 9,
      sgstRate: 9,
      cgstAmount: 45,
      sgstAmount: 45,
      totalAmount: 590,
      paymentMethod: "PhonePe Wallet",
      transactionRef: "PPE_99201847261",
      status: "Paid",
      role: "employee",
      billedTo: {
        name: user.name,
        email: user.email,
        address: city,
        gstinOrPan: "Candidate PAN: ABCDE1234F (Individual)",
        customerCode: "CAND-PRO-8842",
      },
      lineItems: [
        {
          description: "HD Video Resume Cloud Streaming & Verified Portfolio Credential Sync",
          sac: "998315",
          qty: "1 Year",
          unitPrice: 500,
          amount: 500,
        },
      ],
    },
  ];
}
