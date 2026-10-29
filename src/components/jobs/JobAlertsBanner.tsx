import { useState } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { subscribeJobAlerts } from "@/services/candidate/jobs";
import { backendErrorMessage } from "@/hooks/useCandidateBackend";

const JobAlertsBanner = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Please enter your email address.");
      return;
    }
    setSubmitting(true);
    try {
      await subscribeJobAlerts(trimmed);
      setSubscribed(true);
      setEmail("");
      toast.success("Subscribed! You will receive matched job alerts in your inbox.");
    } catch (err) {
      toast.error(backendErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-8">
      <div className="container px-4 md:px-6">
        <div className="bg-primary text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold font-display leading-[1.15] text-white">
                Get Job Alerts in<br />
                Your Inbox
              </h3>
              <p className="text-white/85 text-sm md:text-base mt-2">
                Subscribe to get notified about new jobs
                <br className="hidden md:block" />
                matched to your skills and profile.
              </p>
            </div>
          </div>
          <form action="/jobs" method="post" onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2 w-full md:w-auto">
            <label htmlFor="job-alert-email" className="sr-only">
              Email address for job alerts
            </label>
            <Input
              id="job-alert-email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (subscribed) setSubscribed(false);
              }}
              autoComplete="email"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="Enter your email"
              className="bg-card text-foreground border-0 h-11 min-w-0 md:min-w-[280px]"
            />
            <Button
              type="submit"
              disabled={submitting}
              variant="secondary"
              className="bg-card text-primary hover:bg-card/90 h-11 px-6 font-semibold shrink-0 gap-2"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : subscribed ? <CheckCircle2 className="h-4 w-4" /> : null}
              {submitting ? "Subscribing..." : subscribed ? "Subscribed" : "Subscribe"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default JobAlertsBanner;
