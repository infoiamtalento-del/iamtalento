import { useState } from "react";
import { addDays, differenceInCalendarDays, format, getDay, startOfDay } from "date-fns";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Clock3,
  History,
  MessageSquare,
  Video,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import expertMale1 from "@/assets/experts/male-1.jpg";
import expertFemale1 from "@/assets/experts/female-1.jpg";
import expertMale2 from "@/assets/experts/male-2.jpg";
import expertFemale2 from "@/assets/experts/female-2.jpg";
import expertMale3 from "@/assets/experts/male-3.jpg";
import expertFemale3 from "@/assets/experts/female-3.jpg";
import expertMale4 from "@/assets/experts/male-4.jpg";
import expertFemale4 from "@/assets/experts/female-4.jpg";

import googleLogo from "@/assets/company-logos/google.svg";
import microsoftLogo from "@/assets/company-logos/microsoft.svg";
import amazonLogo from "@/assets/company-logos/amazon.svg";
import accentureLogo from "@/assets/company-logos/accenture.svg";
import ibmLogo from "@/assets/company-logos/ibm.svg";
import oracleLogo from "@/assets/company-logos/oracle.svg";
import infosysLogo from "@/assets/company-logos/infosys.svg";

const BOOKING_WINDOW_DAYS = 21;

interface ExpertAvailability {
  id: string;
  days: number[];
  times: string[];
}

const expertSchedules: ExpertAvailability[] = [
  { id: "arjun", days: [1, 2, 3, 4, 5], times: ["10:00 AM", "3:00 PM"] },
  { id: "priya", days: [1, 2, 3, 4, 5], times: ["10:00 AM", "12:00 PM", "5:00 PM"] },
  { id: "rohan", days: [2, 4, 5], times: ["12:00 PM", "3:00 PM", "5:00 PM"] },
  { id: "sneha", days: [1, 3, 5], times: ["10:00 AM", "12:00 PM"] },
  { id: "vikram", days: [2, 3, 4], times: ["3:00 PM", "5:00 PM"] },
  { id: "ananya", days: [1, 2, 4, 5], times: ["10:00 AM", "5:00 PM"] },
  { id: "kabir", days: [3, 4, 5], times: ["12:00 PM", "3:00 PM"] },
  { id: "meera", days: [1, 2, 3, 5], times: ["10:00 AM", "3:00 PM", "5:00 PM"] },
];

function isWithinBookingWindow(date: Date, now: Date) {
  const diff = differenceInCalendarDays(date, now);
  return diff >= 1 && diff <= BOOKING_WINDOW_DAYS;
}

function getSchedule(id: string) {
  return expertSchedules.find((item) => item.id === id);
}

function isExpertAvailableOnDate(id: string, date: Date, now = new Date()) {
  const schedule = getSchedule(id);
  return Boolean(schedule && isWithinBookingWindow(date, now) && schedule.days.includes(getDay(date)));
}

function getAvailableTimes(id: string, date: Date, now = new Date()) {
  const schedule = getSchedule(id);
  return !schedule || !isExpertAvailableOnDate(id, date, now) ? [] : schedule.times;
}

function findNextAvailableSlot(id: string, now = new Date()) {
  let cursor = addDays(startOfDay(now), 1);
  for (let i = 0; i < BOOKING_WINDOW_DAYS; i += 1) {
    if (isExpertAvailableOnDate(id, cursor, now)) {
      return { date: cursor, time: getAvailableTimes(id, cursor, now)[0] };
    }
    cursor = addDays(cursor, 1);
  }
  return null;
}

interface IndustryExpert {
  id: string;
  name: string;
  photo: string;
  logo: string;
  role: string;
  company: string;
  previous: string[];
  experience: string;
}

const defaultExperts: IndustryExpert[] = [
  {
    id: "arjun",
    name: "Arjun Mehta",
    photo: expertMale1,
    logo: googleLogo,
    role: "Senior AI Engineer",
    company: "Google",
    previous: ["Microsoft", "Flipkart"],
    experience: "9 years",
  },
  {
    id: "priya",
    name: "Priya Nair",
    photo: expertFemale1,
    logo: microsoftLogo,
    role: "Applied ML Lead",
    company: "Microsoft",
    previous: ["Amazon", "Zoho"],
    experience: "11 years",
  },
  {
    id: "rohan",
    name: "Rohan Shah",
    photo: expertMale2,
    logo: amazonLogo,
    role: "Senior ML Engineer",
    company: "Amazon",
    previous: ["Oracle", "TCS"],
    experience: "8 years",
  },
  {
    id: "sneha",
    name: "Sneha Iyer",
    photo: expertFemale2,
    logo: googleLogo,
    role: "AI Product Manager",
    company: "Google",
    previous: ["Wipro", "Infosys"],
    experience: "7 years",
  },
  {
    id: "vikram",
    name: "Vikram Rao",
    photo: expertMale3,
    logo: accentureLogo,
    role: "Staff ML Engineer",
    company: "Accenture",
    previous: ["IBM", "Oracle"],
    experience: "12 years",
  },
  {
    id: "ananya",
    name: "Ananya Gupta",
    photo: expertFemale3,
    logo: ibmLogo,
    role: "Generative AI Lead",
    company: "IBM",
    previous: ["TCS", "Capgemini"],
    experience: "10 years",
  },
  {
    id: "kabir",
    name: "Kabir Khanna",
    photo: expertMale4,
    logo: oracleLogo,
    role: "MLOps Architect",
    company: "Oracle",
    previous: ["Wipro", "Infosys"],
    experience: "9 years",
  },
  {
    id: "meera",
    name: "Meera Krishnan",
    photo: expertFemale4,
    logo: infosysLogo,
    role: "Applied AI Scientist",
    company: "Infosys",
    previous: ["TCS", "Amazon"],
    experience: "8 years",
  },
];

const calendarClassNames = {
  months: "flex flex-col w-full",
  head_row: "flex w-full gap-1",
  head_cell: "flex-1 text-muted-foreground rounded-md font-normal text-[0.8rem] text-center",
  row: "flex w-full mt-1.5 gap-1",
  cell: "flex-1 h-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
  day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-full p-0 font-normal aria-selected:opacity-100"),
};

interface ExpertBookingSectionProps {
  expertRoles?: string[];
  subject?: string;
}

export function ExpertBookingSection({ expertRoles, subject }: ExpertBookingSectionProps) {
  const experts = defaultExperts.map((expert, idx) => ({
    ...expert,
    role: expertRoles?.[idx] ?? expert.role,
  }));

  const [today] = useState(() => new Date());
  const [selectedExpert, setSelectedExpert] = useState<IndustryExpert | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmedPreview, setConfirmedPreview] = useState<{
    expert: IndustryExpert;
    date: Date;
    time: string;
  } | null>(null);

  const openExpertSlots = (expert: IndustryExpert, prefillNext: boolean) => {
    const nextSlot = prefillNext ? findNextAvailableSlot(expert.id, today) : null;
    setSelectedExpert(expert);
    setSelectedDate(nextSlot ? nextSlot.date : null);
    setSelectedTime(nextSlot ? nextSlot.time : null);
  };

  const closeSlotDialog = () => {
    setSelectedExpert(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const availableTimes =
    selectedExpert && selectedDate ? getAvailableTimes(selectedExpert.id, selectedDate, today) : [];

  return (
    <section aria-labelledby="expert-booking-heading" id="expert-sessions" className="scroll-mt-24">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
          Beyond the classroom
        </p>
        <h2
          id="expert-booking-heading"
          className="font-display font-bold text-3xl md:text-4xl leading-tight tracking-normal"
        >
          Book Private Sessions
          <br />
          <span className="text-primary">with an Industry Expert</span>
        </h2>
        <p className="text-muted-foreground mt-4">
          {subject
            ? `Discuss your ${subject} project, explore career questions and get focused guidance from an industry expert.`
            : "Your project. Your questions. Your next big move. Get a focused conversation with someone who works in the industry."}
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-5 text-xs text-primary font-medium">
          <span className="flex items-center gap-1.5">
            <Video className="h-4 w-4" /> Private video session
          </span>
          <span className="flex items-center gap-1.5">
            <Clock3 className="h-4 w-4" /> 30 minutes
          </span>
          <span className="flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4" /> Advice that moves you forward
          </span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-7 gap-y-9">
        {experts.map((expert) => (
          <article
            key={expert.id}
            className="flex flex-col overflow-hidden rounded-lg border bg-card transition-colors hover:border-primary/40"
          >
            <div className="relative aspect-[4/5] bg-muted">
              <img
                src={expert.photo}
                alt={expert.name}
                className="h-full w-full object-cover object-top"
                loading="lazy"
              />
              <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
                <BriefcaseBusiness className="h-3 w-3" /> {expert.experience}
              </span>
            </div>

            <div className="flex flex-col gap-2.5 p-4">
              <div className="min-w-0">
                <h3 className="truncate font-display text-base font-bold leading-snug tracking-normal">
                  {expert.name}
                </h3>
                <p className="mt-1 flex min-w-0 items-center gap-1.5">
                  <img
                    src={expert.logo}
                    alt=""
                    className="h-4 max-w-14 shrink-0 object-contain object-left"
                    loading="lazy"
                  />
                  <span className="truncate text-xs font-semibold">{expert.company}</span>
                </p>
                <p className="truncate text-xs font-medium text-primary">{expert.role}</p>
              </div>

              <p className="flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground">
                <History className="h-3 w-3 shrink-0" />
                <span className="truncate">Earlier: {expert.previous.join(", ")}</span>
              </p>

              <div className="mt-1 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="px-2 text-xs"
                  aria-label={`Available Slots for ${expert.name}`}
                  onClick={() => openExpertSlots(expert, false)}
                >
                  Available Slots
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5 px-2 text-xs"
                  aria-label={`Book Now with ${expert.name}`}
                  onClick={() => openExpertSlots(expert, true)}
                >
                  Book Now <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-6 text-xs text-muted-foreground text-center">
        Sample expert profiles, company affiliations and availability. Live booking is not yet available.
      </p>

      {/* Slot Picker Modal */}
      <Dialog
        open={Boolean(selectedExpert)}
        onOpenChange={(open) => {
          if (!open) closeSlotDialog();
        }}
      >
        <DialogContent className="max-w-lg w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto rounded-lg">
          <DialogTitle className="font-display text-2xl tracking-normal">
            {selectedExpert ? `${selectedExpert.name} — available slots` : "Available slots"}
          </DialogTitle>
          <DialogDescription>
            {selectedExpert
              ? "Pick a date and time that suits you. All times are India Standard Time (IST)."
              : "Pick a date and time that suits you."}
          </DialogDescription>

          {selectedExpert && (
            <>
              <div className="flex items-center gap-4 border-b pb-4">
                <img
                  src={selectedExpert.photo}
                  alt={selectedExpert.name}
                  className="h-14 w-14 rounded-md object-cover object-top"
                />
                <div className="min-w-0">
                  <p className="font-semibold">{selectedExpert.name}</p>
                  <p className="text-sm text-primary">{selectedExpert.role}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedExpert.company} · {selectedExpert.experience} experience
                  </p>
                </div>
              </div>

              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Pick a date
              </p>
              <Calendar
                mode="single"
                numberOfMonths={2}
                selected={selectedDate ?? undefined}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    setSelectedTime(null);
                  }
                }}
                fromMonth={today}
                toMonth={addDays(today, BOOKING_WINDOW_DAYS)}
                disabled={(date) => !isExpertAvailableOnDate(selectedExpert.id, date, today)}
                className="pointer-events-auto w-full p-0"
                classNames={calendarClassNames}
              />

              {selectedDate && (
                <>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Pick a time · {format(selectedDate, "EEE, d MMM")}
                  </p>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Available session times">
                    {availableTimes.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedTime === slot ? "default" : "outline"}
                        aria-pressed={selectedTime === slot}
                        onClick={() => setSelectedTime(slot)}
                        className="h-10 gap-1.5 text-xs"
                      >
                        {selectedTime === slot && <Check className="h-3.5 w-3.5" />} {slot}
                      </Button>
                    ))}
                  </div>
                </>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {selectedDate && selectedTime
                    ? `${format(selectedDate, "EEE, d MMM yyyy")} · ${selectedTime} IST`
                    : "Select a date and time to continue"}
                </p>
                <Button
                  className="gap-2"
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => {
                    if (selectedDate && selectedTime) {
                      setConfirmedPreview({
                        expert: selectedExpert,
                        date: selectedDate,
                        time: selectedTime,
                      });
                      closeSlotDialog();
                    }
                  }}
                >
                  Book Now <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Session Preview Modal */}
      <Dialog
        open={Boolean(confirmedPreview)}
        onOpenChange={(open) => {
          if (!open) setConfirmedPreview(null);
        }}
      >
        <DialogContent className="max-w-md w-[calc(100%-2rem)] rounded-lg">
          <DialogTitle className="font-display text-2xl tracking-normal">
            Your 1on1 session preview
          </DialogTitle>
          <DialogDescription>
            This is a sample session, not a confirmed booking. No appointment has been reserved.
          </DialogDescription>

          {confirmedPreview && (
            <>
              <div className="flex items-center gap-4 border-b pb-5">
                <img
                  src={confirmedPreview.expert.photo}
                  alt={confirmedPreview.expert.name}
                  className="h-16 w-16 rounded-md object-cover object-top"
                />
                <div>
                  <p className="font-semibold">{confirmedPreview.expert.name}</p>
                  <p className="text-sm text-primary">{confirmedPreview.expert.role}</p>
                  <p className="text-xs text-muted-foreground">{confirmedPreview.expert.company}</p>
                </div>
              </div>

              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Date</dt>
                  <dd className="font-medium">{format(confirmedPreview.date, "d MMMM yyyy")}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Time</dt>
                  <dd className="font-medium">{confirmedPreview.time} IST</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Session</dt>
                  <dd className="font-medium">30-minute video call</dd>
                </div>
              </dl>

              <Button onClick={() => setConfirmedPreview(null)}>Back to Experts</Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
