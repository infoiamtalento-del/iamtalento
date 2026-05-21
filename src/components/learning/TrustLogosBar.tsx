import { motion } from "framer-motion";
import logoGoogle from "@/assets/logo-google.svg";
import logoAws from "@/assets/logo-aws.svg";
import logoMeta from "@/assets/logo-meta.svg";

const logos = [
  { src: logoGoogle, name: "Google" },
  { src: logoAws, name: "AWS" },
  { src: logoMeta, name: "Meta" },
  { src: logoGoogle, name: "Microsoft" },
  { src: logoAws, name: "Amazon" },
  { src: logoMeta, name: "Flipkart" },
];

const TrustLogosBar = () => (
  <section className="py-8 border-y bg-muted/20">
    <div className="container px-4 md:px-6">
      <p className="text-center text-xs text-muted-foreground mb-5 font-medium">
        Trusted by over 15,000 companies and millions of learners around the world
      </p>
      <div className="flex items-center justify-center gap-8 md:gap-14 flex-wrap opacity-60 grayscale">
        {logos.map((l, i) => (
          <motion.img
            key={l.name + i}
            src={l.src}
            alt={l.name}
            className="h-6 md:h-8 object-contain"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          />
        ))}
      </div>
    </div>
  </section>
);

export default TrustLogosBar;
