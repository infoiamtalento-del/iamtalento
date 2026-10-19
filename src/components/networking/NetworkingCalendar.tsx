import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Users, CalendarDays, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const cities = ["Bengaluru", "Mumbai", "Delhi", "Kolkata", "Pune", "Ahmedabad", "Chennai"];
const domains = ["IT", "Sales", "Marketing", "Design", "AI", "Automation", "HR", "Operations"];

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

const NetworkingCalendar = () => {
  const [city, setCity] = useState(cities[0]);
  const [domain, setDomain] = useState("All events");
  const visibleEvents = events.filter((event) => event.city === city && (domain === "All events" || event.domain === domain));

  return (
    <section className="py-16 md:py-24" aria-labelledby="networking-calendar-heading">
      <div className="container">
        <div className="overflow-hidden rounded-[28px] border border-border bg-card p-5 shadow-sm sm:p-8 md:p-10 lg:p-12">
        <div className="mb-10 flex flex-col items-center gap-4 text-center md:mb-12">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase text-primary">The networking calendar</p>
            <h2 id="networking-calendar-heading" className="font-display text-3xl font-bold leading-tight md:text-4xl">Your city. Your people.<br /><span className="text-primary">Your next connection.</span></h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><CalendarDays className="h-4 w-4" /> Across 7 cities</div>
        </div>

        <div className="border-y border-border lg:grid lg:grid-cols-[220px_minmax(0,1fr)]">
          <nav aria-label="Calendar cities" className="border-b border-border py-5 lg:border-b-0 lg:border-r lg:py-7 lg:pr-6">
            <p className="mb-4 flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> Cities</p>
            <div className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
              {cities.map((name) => (
                <Button key={name} variant="ghost" aria-pressed={city === name} onClick={() => { setCity(name); setDomain("All events"); }} className={`h-11 shrink-0 justify-between gap-6 px-3 lg:w-full ${city === name ? "bg-primary/5 text-primary hover:bg-primary/10" : "text-muted-foreground"}`}>
                  <span className={city === name ? "font-semibold" : ""}>{name}</span>
                  <ChevronRight className={`hidden h-4 w-4 lg:block ${city === name ? "opacity-100" : "opacity-0"}`} />
                </Button>
              ))}
            </div>
          </nav>

          <div className="min-w-0 lg:pl-9">
            <div aria-label="Event topics" className="flex gap-5 overflow-x-auto border-b border-border pt-2 lg:gap-6">
              {["All events", ...domains].map((topic) => (
                <Button key={topic} variant="ghost" aria-pressed={domain === topic} onClick={() => setDomain(topic)} className={`h-14 shrink-0 rounded-none border-b-2 px-0 text-xs hover:bg-transparent ${domain === topic ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{topic}</Button>
              ))}
            </div>
            <div className="flex items-center justify-between gap-4 pb-2 pt-7">
              <h3 className="font-display text-xl font-semibold">In {city}</h3>
              <span className="text-xs text-muted-foreground">{visibleEvents.length} {visibleEvents.length === 1 ? "event" : "events"}</span>
            </div>
            <div aria-live="polite" className="min-h-[290px]">
              {visibleEvents.map((event) => (
                <article key={`${event.city}-${event.domain}`} className="flex flex-col gap-5 border-b border-border/70 py-6 last:border-b-0 xl:flex-row xl:items-center xl:justify-between xl:gap-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted text-primary"><Users className="h-5 w-5" /></div>
                    <div>
                      <p className="mb-2 text-xs font-medium text-primary">{event.domain} <span className="mx-2 text-border">/</span> Networking</p>
                      <h4 className="font-display text-lg font-semibold leading-snug md:text-xl">{event.name}</h4>
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{event.city}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-start gap-1 xl:items-end">
                    <Button asChild size="sm" className="h-10 text-xs"><Link to="/auth">Register for New Users <ArrowRight className="h-3.5 w-3.5" /></Link></Button>
                    <Button asChild variant="link" size="sm" className="h-9 px-0 text-xs"><Link to="/auth">Register for Existing Priority User</Link></Button>
                  </div>
                </article>
              ))}
              {visibleEvents.length === 0 && (
                <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 text-center">
                  <CalendarDays className="mb-1 h-7 w-7 text-muted-foreground" />
                  <p className="font-display text-lg font-semibold">No {domain} events in {city} yet</p>
                  <Button variant="link" onClick={() => setDomain("All events")}>View all {city} events <ArrowRight className="h-4 w-4" /></Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <p className="font-display text-lg font-semibold leading-relaxed md:text-2xl"><span className="text-primary">1 Year</span> <span className="mx-1 text-muted-foreground">=</span> 15 New Events <span className="mx-1 text-muted-foreground">×</span> 10 Cities</p>
          <Button asChild variant="link" className="h-auto justify-start px-0"><Link to="/auth">Get Your Priority Pass <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
        </div>
      </div>
    </section>
  );
};

export default NetworkingCalendar;
