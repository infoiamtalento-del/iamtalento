import { motion } from "framer-motion";

const alerts = [
  "Sneha from Mumbai just completed her Digital Marketing assessment, scored Above Market",
  'Rahul from Bangalore unlocked the "I Am Talento Verified" badge 12 minutes ago',
  "47 employers viewed verified candidate profiles in the last hour",
  "A hiring manager from Razorpay shortlisted 3 verified candidates today",
  "Arjun just received an interview invite, 6 hours after completing his assessment",
];

const FomoTicker = () => (
  <div className="py-2.5 overflow-hidden" style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
    <div className="relative flex">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[...alerts, ...alerts].map((a, i) => (
          <span key={i} className="text-xs font-medium px-4 flex items-center gap-2" style={{ color: "#475569" }}>
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            {a}
          </span>
        ))}
      </motion.div>
    </div>
  </div>
);

export default FomoTicker;
