import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const JobsFinalCTA = () => {
  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <div className="bg-foreground text-background rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-background/10 flex items-center justify-center shrink-0">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold font-display">Ready to Find Your Dream Job?</h3>
              <p className="text-background/75 text-sm">Join thousands of professionals who found their perfect match</p>
            </div>
          </div>
          <Link to="/auth">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 h-11 px-6 font-semibold">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JobsFinalCTA;
