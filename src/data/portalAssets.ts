import googleLogo from "@/assets/company-logos/google.svg";
import microsoftLogo from "@/assets/company-logos/microsoft.svg";
import amazonLogo from "@/assets/company-logos/amazon.svg";
import accentureLogo from "@/assets/company-logos/accenture.svg";
import ibmLogo from "@/assets/company-logos/ibm.svg";
import oracleLogo from "@/assets/company-logos/oracle.svg";
import infosysLogo from "@/assets/company-logos/infosys.svg";
import capgeminiLogo from "@/assets/company-logos/capgemini.svg";
import tcsLogo from "@/assets/company-logos/tcs.svg";
import wiproLogo from "@/assets/company-logos/wipro.svg";
import awsLogo from "@/assets/logo-aws.svg";
import metaLogo from "@/assets/logo-meta.svg";

import learnerAnanya from "@/assets/learner-ananya.jpg";
import learnerPriya from "@/assets/learner-priya.jpg";
import learnerRahul from "@/assets/learner-rahul.jpg";
import learnerVikram from "@/assets/learner-vikram.jpg";
import expertFemale1 from "@/assets/experts/female-1.jpg";
import expertFemale2 from "@/assets/experts/female-2.jpg";
import expertFemale3 from "@/assets/experts/female-3.jpg";
import expertFemale4 from "@/assets/experts/female-4.jpg";
import expertFemale5 from "@/assets/experts/female-5.jpg";
import expertFemale6 from "@/assets/experts/female-6.jpg";
import expertMale1 from "@/assets/experts/male-1.jpg";
import expertMale2 from "@/assets/experts/male-2.jpg";
import expertMale3 from "@/assets/experts/male-3.jpg";
import expertMale4 from "@/assets/experts/male-4.jpg";
import expertMale5 from "@/assets/experts/male-5.jpg";
import expertMale6 from "@/assets/experts/male-6.jpg";

export const COMPANY_LOGOS: Record<string, string> = {
  Google: googleLogo,
  Microsoft: microsoftLogo,
  Amazon: amazonLogo,
  Accenture: accentureLogo,
  IBM: ibmLogo,
  Oracle: oracleLogo,
  Infosys: infosysLogo,
  Capgemini: capgeminiLogo,
  TCS: tcsLogo,
  Wipro: wiproLogo,
  Meta: metaLogo,
  AWS: awsLogo,
  Adobe: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Adobe_Corporate_Logo.png/200px-Adobe_Corporate_Logo.png",
  Deloitte: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Deloitte.svg/200px-Deloitte.svg.png",
  Cognizant: "https://companieslogo.com/img/orig/CTSH-82a8444b.png?t=1720244491",
  SAP: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/SAP_2011_logo.svg/200px-SAP_2011_logo.svg.png",
  Salesforce: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/200px-Salesforce.com_logo.svg.png",
  Flipkart: "/company-logos/flipkart.svg",
  Razorpay: "/company-logos/razorpay.svg",
  Swiggy: "/company-logos/swiggy.svg",
  Zomato: "https://www.google.com/s2/favicons?domain=zomato.com&sz=128",
  Paytm: "https://www.google.com/s2/favicons?domain=paytm.com&sz=128",
  PhonePe: "https://www.google.com/s2/favicons?domain=phonepe.com&sz=128",
  Zoho: "/company-logos/zoho.svg",
  Atlassian: "/company-logos/atlassian.svg",
  Uber: "https://www.google.com/s2/favicons?domain=uber.com&sz=128",
  Spotify: "https://www.google.com/s2/favicons?domain=spotify.com&sz=128",
  Postman: "https://www.google.com/s2/favicons?domain=postman.com&sz=128",
  Unacademy: "https://www.google.com/s2/favicons?domain=unacademy.com&sz=128",
  Freshworks: "https://www.google.com/s2/favicons?domain=freshworks.com&sz=128",
  Super30: "https://www.google.com/s2/favicons?domain=talento.app&sz=128",
};

export const getCompanyLogo = (companyName: string): string => {
  if (!companyName) return googleLogo;
  const match = Object.keys(COMPANY_LOGOS).find(
    (k) => k.toLowerCase() === companyName.toLowerCase().trim()
  );
  if (match) return COMPANY_LOGOS[match];
  const cleaned = companyName.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `https://www.google.com/s2/favicons?domain=${cleaned}.com&sz=128`;
};

export const CANDIDATE_PHOTOS: Record<string, string> = {
  "Aarav Mehta": expertMale1,
  "Diya Nair": expertFemale1,
  "Rohan Das": learnerRahul,
  "Sneha Iyer": expertFemale2,
  "Kabir Shah": expertMale2,
  "Meera Pillai": expertFemale3,
  "Arjun Rao": learnerVikram,
  "Priya Menon": learnerPriya,
  "Ananya Sharma": learnerAnanya,
  "Yogesh": expertMale3,
  "Vignesh": expertMale3,
  "Nikhil Kumar": expertMale4,
  "Tanvi Gupta": expertFemale4,
  "Pooja K": expertFemale5,
  "Devansh C": expertMale5,
  "Sanya Rao": expertFemale6,
  "Harsh V": expertMale6,
};

const candidatePhotoPool = [
  learnerAnanya,
  learnerPriya,
  learnerRahul,
  learnerVikram,
  expertFemale1,
  expertFemale2,
  expertFemale3,
  expertFemale4,
  expertFemale5,
  expertFemale6,
  expertMale1,
  expertMale2,
  expertMale3,
  expertMale4,
  expertMale5,
  expertMale6,
];

export const getCandidatePhoto = (name: string): string => {
  if (!name) return learnerAnanya;
  if (CANDIDATE_PHOTOS[name]) return CANDIDATE_PHOTOS[name];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % candidatePhotoPool.length;
  return candidatePhotoPool[idx];
};
