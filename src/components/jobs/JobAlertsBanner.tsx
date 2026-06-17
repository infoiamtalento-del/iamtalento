import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const JobAlertsBanner = () => {
  return (
    <section className="py-8">
      <div className="container px-4 md:px-6">
        <div className="bg-primary text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold font-display text-white">Get Job Alerts in Your Inbox</h3>
              <p className="text-white/85 text-sm">Subscribe to get notified about new job opportunities</p>
            </div>
          </div>
          <form className="flex items-stretch gap-2 w-full md:w-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-card text-foreground border-0 h-11 min-w-0 md:min-w-[280px]"
            />
            <Button type="submit" variant="secondary" className="bg-card text-primary hover:bg-card/90 h-11 px-6 font-semibold shrink-0">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default JobAlertsBanner;
