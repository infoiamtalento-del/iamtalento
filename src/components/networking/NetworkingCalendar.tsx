import { Link } from "react-router-dom";
import { CalendarDays, ArrowRight } from "lucide-react";

const cities = ["Bengaluru", "Mumbai", "Delhi", "Kolkata", "Pune", "Ahmedabad", "Chennai"];
const domains = ["IT", "Sales", "Marketing", "Design", "AI", "Automation", "HR", "Operations"];

// A small, deliberately sparse set of events — most city/domain cells stay empty.
const events: { city: string; domain: string; name: string }[] = [
  { city: "Bengaluru", domain: "IT", name: "Tech Leaders Meetup" },
  { city: "Bengaluru", domain: "AI", name: "AI Builders Night" },
  { city: "Mumbai", domain: "Sales", name: "Sales Growth Summit" },
  { city: "Mumbai", domain: "Marketing", name: "Marketing Mixer" },
  { city: "Delhi", domain: "IT", name: "Tech Leaders Meetup" },
  { city: "Delhi", domain: "HR", name: "People & Culture Meet" },
  { city: "Kolkata", domain: "Operations", name: "Ops Excellence Roundtable" },
  { city: "Pune", domain: "Design", name: "Design Circle" },
  { city: "Pune", domain: "Automation", name: "Automation Forum" },
  { city: "Ahmedabad", domain: "Sales", name: "Sales Growth Summit" },
  { city: "Chennai", domain: "AI", name: "AI Builders Night" },
  { city: "Chennai", domain: "IT", name: "Tech Leaders Meetup" },
];

const eventMap = new Map(events.map((e) => [`${e.city}|${e.domain}`, e]));

const NetworkingCalendar = () => (
  <section className="py-16 md:py-20">
    <div className="container">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          <CalendarDays className="h-3.5 w-3.5" /> Event Calendar
        </span>
        <h2 className="mt-4 text-3xl md:text-4xl font-bold font-display">
          Find Your Event,<br /><span className="text-primary">City by City</span>
        </h2>
        <p className="mt-3 text-muted-foreground">Pick your city and domain, then register in one click.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-separate [border-spacing:0] text-left">
          <thead>
            <tr>
              <th className="w-40 border-b border-border px-4 pb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">City</th>
              {domains.map((d) => (
                <th key={d} className="border-b border-border px-3 pb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cities.map((city) => (
              <tr key={city}>
                <th className="px-4 pt-5 pb-5 align-top font-display text-sm font-semibold text-foreground">{city}</th>
                {domains.map((d) => {
                  const event = eventMap.get(`${city}|${d}`);
                  return (
                    <td key={d} className="px-3 pt-5 pb-5 align-top">
                      {event ? (
                        <div className="rounded-xl border border-primary/15 bg-primary/5 p-3">
                          <p className="flex items-start gap-2 text-xs font-semibold leading-snug text-foreground">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            {event.name}
                          </p>
                          <div className="mt-2.5 flex items-center gap-3 pl-3.5 text-[11px] font-medium">
                            <Link to="/auth" className="text-primary underline-offset-2 hover:underline">New user</Link>
                            <span className="h-3 w-px bg-border" />
                            <Link to="/auth" className="text-primary underline-offset-2 hover:underline">Priority user</Link>
                          </div>
                        </div>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card px-6 py-5 sm:flex-row">
        <p className="font-display text-xl md:text-2xl font-bold">1 Year = 15 New Events × 10 Cities</p>
        <Link to="/auth" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
          Get Your Priority Pass <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
);

export default NetworkingCalendar;
