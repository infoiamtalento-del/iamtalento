/** Two-line company blurbs shown on job cards: what the company does, then what it is like to work there. */
export const COMPANY_BLURBS: Record<string, [string, string]> = {
  Zoho: ["Chennai-based software company behind business apps like CRM, Mail and Books.", "Builds its own products in-house and is known for growing freshers into engineers."],
  Flipkart: ["One of India's biggest e-commerce marketplaces for electronics, fashion and daily needs.", "Fast-paced teams solving large-scale problems in search, data and delivery."],
  Razorpay: ["Payments and banking platform that helps businesses accept online payments.", "Product-focused engineering culture, good for learning fintech and APIs."],
  Swiggy: ["Food and grocery delivery app (Swiggy, Instamart) used across Indian cities.", "Consumer-tech team where design and data shape daily decisions."],
  Infosys: ["Global IT services company that builds and runs software for large businesses.", "Structured training for freshers and projects across many industries."],
  Freshworks: ["SaaS company making customer support and sales software.", "Product company with a global customer base and a startup-style team."],
  "Ola Krutrim": ["AI company building Indian-language AI models and cloud services.", "Early-stage, fast-moving team with room to own big problems."],
  Postman: ["API platform that developers worldwide use to build and test APIs.", "Remote-friendly dev-tools company, a good place to learn real engineering."],
  PhonePe: ["Digital payments app on UPI, also offering insurance and investments.", "Large-scale fintech engineering with strong ownership at senior levels."],
  Unacademy: ["Online learning platform for exam preparation and skill courses.", "Remote-friendly team focused on learners, content and education tech."],
  Amazon: ["Global e-commerce and cloud company (Amazon and AWS).", "High ownership and big-scale systems, with a structured hiring process."],
  Microsoft: ["Makes Windows, Office, Azure cloud and developer tools.", "Strong learning culture, hybrid work and long career paths."],
  Adobe: ["Maker of Photoshop, Acrobat and Creative Cloud.", "Design-led product teams with flexible hybrid work."],
  Uber: ["Ride-hailing and delivery platform operating in many countries.", "Data-heavy teams working on pricing, maps and real-time matching."],
  Paytm: ["Digital payments and financial services app.", "Fast-moving fintech team working on payments and merchant tools."],
  Zomato: ["Food delivery and quick-commerce app.", "Quick decisions and a strong focus on mobile and growth."],
  Spotify: ["Music and podcast streaming service with a global audience.", "Engineering teams own their products and work flexibly."],
  Wipro: ["Global IT services and consulting company.", "Training-led start for freshers with client projects in many domains."],
  Accenture: ["Consulting and technology firm that helps companies modernise their business.", "Varied client projects and many learning programmes."],
  TCS: ["India's largest IT services company, part of the Tata Group.", "Stable career with structured training and wide domain exposure."],
  Google: ["Builds Search, Android, YouTube and Google Cloud.", "Engineering-first culture with large-scale problems and strong peers."],
  Atlassian: ["Makes team tools like Jira, Confluence and Trello.", "Known for remote-friendly work and a collaborative culture."],
};

export const companyBlurb = (company: string, industry: string, size: string): [string, string] =>
  COMPANY_BLURBS[company] || [
    `${industry} company with a ${size.toLowerCase()} team.`,
    "Ask the recruiter about the team and culture before you apply.",
  ];

/** Salary bands (LPA) used by the Salary dropdown. */
export const SALARY_BANDS: [string, string][] = [
  ["", "Any salary"],
  ["0-5", "Up to \u20B95 LPA"],
  ["5-10", "\u20B95\u201310 LPA"],
  ["10-20", "\u20B910\u201320 LPA"],
  ["20-40", "\u20B920\u201340 LPA"],
  ["40-999", "\u20B940 LPA and above"],
];

export const salaryBandOk = (job: { a: number; b: number }, band: string): boolean => {
  const [lo, hi] = band.split("-").map(Number);
  return job.b > lo && job.a < hi;
};
