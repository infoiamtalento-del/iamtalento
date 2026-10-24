import hero from '@/assets/hackathon-hero.jpg';
import event1 from '@/assets/hackathon-event-1.jpg';
import event2 from '@/assets/hackathon-event-2.jpg';
import ticket1 from '@/assets/hackathon-ticket-1.jpg';
import ticket2 from '@/assets/hackathon-ticket-2.jpg';
import ticket3 from '@/assets/hackathon-ticket-3.jpg';
import ananya from '@/assets/learner-ananya.jpg';
import rahul from '@/assets/learner-rahul.jpg';
import priya from '@/assets/learner-priya.jpg';

export const liveChallenges = [
  { title: 'AI-Powered Resume Screener, Build Sprint', speaker: 'Aditya Sharma', role: 'CTO, RecruitAI', image: hero, tags: ['AI/ML', 'Hiring Tech'], status: 'live' },
  { title: 'FinTech Fraud Detection, Live Challenge', speaker: 'Neha Kapoor', role: 'VP Eng, Razorpay', image: event1, tags: ['FinTech', 'Security'], status: 'live' },
  { title: 'EdTech Accessibility Hackathon, Open Build', speaker: 'Rohan Verma', role: "Product Lead, Byju’s", image: event2, tags: ['EdTech', 'Impact'], status: 'live' },
  { title: 'Green Energy Dashboard, Sustainability Sprint', speaker: 'Kavya Reddy', role: 'Eng Lead, Tata Power', image: hero, tags: ['CleanTech', 'Data Viz'], status: 'upcoming' },
  { title: 'HealthTech Diagnostics, AI Challenge', speaker: 'Vikram Joshi', role: 'CTO, Practo', image: event1, tags: ['HealthTech', 'AI'], status: 'upcoming' },
  { title: 'Smart City IoT, Connected Solutions', speaker: 'Priya Nair', role: 'IoT Lead, Cisco India', image: event2, tags: ['IoT', 'Smart City'], status: 'upcoming' },
];
export const eventTickets = [
  { title: 'Code Arena', subtitle: 'Season 4', date: 'Aug 15–17, 2025', time: '48 Hours Non-Stop', location: 'Koramangala Tech Park, Bangalore, India', spots: '120', total: '500', image: ticket1, tag: 'REGISTERING NOW' },
  { title: 'HackFest', subtitle: 'Awards Night', date: 'Sep 20, 2025', time: '6:00 PM IST', location: 'BKC Convention Centre, Mumbai, India', spots: '45', total: '200', image: ticket2, tag: 'VIP ACCESS' },
  { title: "Builder’s", subtitle: 'Meetup', date: 'Oct 5, 2025', time: '10:00 AM IST', location: 'Cyber Hub, Gurgaon, Delhi NCR, India', spots: '80', total: '150', image: ticket3, tag: 'FREE ENTRY' },
];
export const builderStories = [
  { name: 'Ananya Rao', role: 'Product Analyst, Bengaluru', image: ananya, quote: 'The hackathon gave my work a stage. A hiring manager reached out before the final results were announced.' },
  { name: 'Rahul Mehta', role: 'Software Engineer, Pune', image: rahul, quote: 'I entered to test my skills and left with a verified project, a mentor, and two interview conversations.' },
  { name: 'Priya Nair', role: 'UX Designer, Kochi', image: priya, quote: 'The brief felt like real work, not a classroom task. That made the feedback genuinely useful for my career.' },
];
export const hackathonTracks = ['All Tracks', 'AI/ML', 'Web3', 'FinTech', 'HealthTech', 'Open Innovation'];
export const trackBriefs = [
  { title: 'AI-Powered Resume Screener', track: 'AI/ML', text: 'Build a fair, explainable screening tool for high-volume hiring teams.' },
  { title: 'FinTech Fraud Detection', track: 'FinTech', text: 'Spot suspicious transaction patterns without slowing genuine customers.' },
  { title: 'Accessible Learning Systems', track: 'Open Innovation', text: 'Create an inclusive learning experience for different abilities and devices.' },
  { title: 'Web3 Builder Sprint', track: 'Web3', text: 'Build working prototypes with mentor support.' },
  { title: 'HealthTech Diagnostics', track: 'HealthTech', text: 'Solve real industry challenges and put your skills in front of employers.' },
  { title: 'Green Energy Dashboard', track: 'Open Innovation', text: 'Build, earn recognition, and open the right conversations.' },
];
export const hackathonFaqs = [
  { question: 'Who can join a TalentCIR hackathon?', answer: 'Students, recent graduates, and working professionals can participate. Each challenge page lists any specific eligibility requirements.' },
  { question: 'Can I participate without a team?', answer: 'Yes. You can enter solo or use the community to find teammates with complementary skills.' },
  { question: 'How are submissions evaluated?', answer: 'Industry judges review problem solving, execution, creativity, collaboration, presentation, and real-world impact.' },
  { question: 'What do participants receive?', answer: 'Eligible participants receive a certificate, verified project proof, expert feedback, and visibility with participating employers.' },
];