import { Link } from "react-router-dom";
import { CalendarDays, ArrowRight } from "lucide-react";

const cities = ["Bengaluru", "Mumbai", "Delhi", "Kolkata", "Pune", "Ahmedabad", "Chennai"];
const domains = ["IT", "Sales", "Marketing", "Design", "AI", "Automation", "HR", "Operations"];
const eventNames: Record<string, string> = {
  IT: "Tech Leaders Meetup",
  Sales: "Sales Growth Summit",
  Marketing: "Marketing Mixer",
  Design: "Design Circle",
  AI: "AI Builders Night",
  Automation: "Automation Forum",
  HR: "People & Culture Meet",
  Operations: "Ops Excellence Roundtable",
};

const NetworkingCalendar = () => (
  <section className="py-16 md:py-20">
    <div className="container">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          <CalendarDays className="h-3.5 w-3.5" /> Event Calendar
        </span>
        <h2 className="mt-4 text-3xl md:text-4xl font-bold font-display">
          Find Your Event,<br /><span className="text-primary">City by City</span>
        </h2>
        <p className="mt-3 text-muted-foreground">Pick your city and domain, then register in one click.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[1200px] border-collapse text-left">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="sticky left-0 z-10 bg-primary px-4 py-3 text-xs font-semibold uppercase tracking-wider">City</th>
              {domains.map((d) => (
                <th key={d} className="px-3 py-3 text-xs font-semibold uppercase tracking-wider border-l border-primary-foreground/15">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cities.map((city) => (
              <tr key={city} className="border-t border-border">
                <th className="sticky left-0 z-10 bg-card px-4 py-3 font-display text-sm font-bold text-foreground">{city}</th>
                {domains.map((d) => (
                  <td key={d} className="border-l border-border p-2 align-top">
                    <div className="flex h-full flex-col gap-2 rounded-lg bg-accent/60 p-2.5">
                      <p className="text-xs font-semibold leading-snug text-foreground">{city} {eventNames[d]}</p>
                      <Link to="/auth" className="rounded-md bg-primary px-2 py-1.5 text-center text-[10px] font-semibold leading-tight text-primary-foreground hover:bg-primary/90">
                        Register · New User
                      </Link>
                      <Link to="/auth" className="rounded-md border border-primary px-2 py-1.5 text-center text-[10px] font-semibold leading-tight text-primary hover:bg-primary/5">
                        Register · Priority User
                      </Link>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl bg-primary px-6 py-5 text-primary-foreground sm:flex-row">
        <p className="font-display text-xl md:text-2xl font-bold">1 Year = 15 New Events × 10 Cities</p>
        <Link to="/auth" className="inline-flex items-center gap-2 rounded-full bg-primary-foreground px-5 py-2.5 text-sm font-semibold text-primary">
          Get Your Priority Pass <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
);

export default NetworkingCalendar;
