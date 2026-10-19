# Roadmap

## Employer page — action-first CTAs
- Replace demo-request CTAs with Post Jobs, Create Company Profile and Get Started, preserving See How It Works — implemented
- Add two reference-inspired navy action banners with white buttons and supporting items — implemented
- Verify banner layouts and existing onboarding destinations — done; both banners inspected at 1280 and 390 widths, four supporting items each, no banner clipping or browser errors. Post Jobs opens existing company setup, which sends signed-out users to login. Existing interviewer glow extends beyond the phone viewport; unchanged by this task.

## Employer page — section order
- Move "Everything It Takes, In One Platform." above the AI Interviewer band, and "AI-Evaluate Candidates Like Your Top Recruiters Would." above "Your Next Great Hire. Five Clear Steps." — done; order checked in the browser (Everything It Takes 3, AI Interviewer 4, AI-Evaluate 6, Five Clear Steps 7), both moved sections inspected at 1497 width with headings clear of the header and no clipping, no page errors, build OK

## Employer page — AI Interviewer section restyle
- Remove the scroll-stop pin so all eight points show together, and switch the band to brand navy with white text — done; section is one static block (bg-primary), all eight points render at once, avatar badge and CTA inverted to white-on-navy, checked at 1497 and 390 with no page errors, build OK

## Employer page — Career Intelligence
- Add the shared homepage Career Intelligence section directly before the AI Interviewer section — implemented
- Verify section order and interactive report previews — done; placement confirmed, Employability Score preview switches correctly, screenshot inspected, no page errors, build OK

## Employer candidate and assessment reference pages
- Open candidate reviews as full-page, linkable profiles with connected application actions — done
- Match the assessment dashboard reference with search, filters, creation and results — done
- Verify sample workflows, reload and desktop/phone layouts — done; employer demo login, profile opening, stage/notes save and reload, activity readback, return to candidates, assessment creation/result and reload checked; 1280/890/390 widths without overflow or page errors; existing employer tests passed.

## Employer — realistic interactive demo
- Seed connected jobs, applicants, interviews and account activity without overwriting existing changes — done
- Make assessment, AI interview, advertising, subscription, payment and settings demo workflows interactive — done; support tickets have persistent sample conversations and simulated resolutions
- Add clearly labelled simulated activity and verify cross-page updates and reload — done; employer login, simulated arrival, 20-second automatic arrival, stage change, saved notes, scheduled interview readback, assessment result, AI screening, campaign engagement/pause, plan activation/receipt download, saved settings, draft/reload, publish/description readback, Employee application and Employer pipeline readback, support resolution/reload checked; 1280/890/390 layouts without overflow, no browser errors, build OK

## Employer pages — supplied dashboard references
- Redesign Job Posting with grouped fields and a live listing preview — done
- Redesign Job Applications with summary counts, filters and candidate board/list — done
- Redesign Notifications with SLA health, applicants, interviews and quick actions — done
- Refresh My Account in the same style (fourth reference was not attached) — done
- Verify employer actions and desktop/phone layouts without changing employee pages — done; employer quick login, preview, draft/reload, publish, description readback, employee application, employer candidate review and shortlisting, filtering and notification navigation checked; all four pages inspected at 1280, 890 and 390 widths without overflow; build OK.

## Employee and Employer demo login
- Add blue account-type choices and quick entry to existing dummy profiles — implemented
- Match employer account dropdown to the employee design and connect all existing employer views — implemented
- Verify both demo entries, employer menu destinations, reload and logout — done; Employee and Employer profiles opened at 1496, 890 and 390 widths, all twelve employer destinations opened, reload retained Employer, logout cleared demo selection and returned home, no page errors; login blue verified as #0d5cb2 and build OK. AI interviews, advertising and subscriptions now have explicitly simulated interactive workflows; no live services or charges.

## Employee account — restore reference features
- Restore all screenshot menu options and connect the existing inner pages and actions — implemented
- Verify menu navigation, certificate, theme and sign-out in the preview — done; all eleven options checked, eight existing pages opened, certificate displayed, theme toggled and sign-out returned home at 1496, 890 and 390 widths without overflow or page errors; portfolio project saved and read back after reload; tests passed and build OK

## Demo profile — complete sections and availability
- Remove left rail and quote, center the profile, and move availability before Contact Candidate — implemented
- Add all eleven requested tabs and matching full-profile sections using shared demo content — implemented
- Verify every tab, availability choices and desktop/phone layout — done; all eleven tabs reach visible sections, status switches, contact opens and resume downloads at 1496 and 390 widths with no overflow or page errors; build OK

## Employer account menu
- Add the requested employer side menu and matching profile dropdown — done
- Connect existing destinations and verify every menu option and layout — done; all 13 labels checked, receipts and demo logout verified, no desktop or phone overflow or runtime errors. AI interviews, advertising and subscriptions now show explicitly simulated workflows rather than live services.

## Pro job description page
- Add the reference-style full job page and connect all job-card clicks — done
- Verify opening details, saving, applying, similar jobs, and returning to results — done; desktop and phone checked, no overflow or page errors, build OK

## Pro job cards — reference repair
- Match the latest compact reference with smaller type, three-column details and single-row actions — done; verified at 1280, 934 and 390, saving and comparison work
- Repair card layout, detail spacing, skills and actions using the supplied reference — done
- Verify rendering and card actions — done; checked at 1280, 889 and 390 widths without overflow; saving, comparison and application succeeded

## Demo profile — sidebar removal, centering and spacing
- Remove the right-hand column and center the remaining profile content — done; the page is one 940px column centered in the space right of the rail, verified at 1497 and 390 with no overflow or page errors
- Open up spacing across the page, its sections, panels, icons and the left rail — done; wider column and roomier panel, tab, timeline, chip, expertise and rail spacing, verified at 1497 and 390 with no clipped text, overlap or page errors


## Demo profile — left menu rail
- Remove the fixed left sidebar and let the profile use the full page width — done; the top bar keeps all six destinations, content edges align with the logo on desktop and phone, and the bar is now solid so scrolled content no longer shows through
- Add a LinkedIn-style left rail with Home, Jobs, Notifications, Messages and Me — done; icons above labels, red count badges, Jobs/Notifications/Messages open slide-over panels with demo content, Me opens the profile menu; on phone it becomes a solid bottom bar; verified at 1280, 1497 and 390 with no overflow or page errors

## Demo profile — reference dashboard
- Match reference header, sidebar, cover and candidate overview — done
- Build compact two-column profile sections and working actions — done; shared demo identity retained, other profile views unchanged
- Verify profile layout and interactions — done; images loaded at 1280, 1497 and 390 widths, no side scroll or page errors; contact, PDF download, tabs and availability checked; build OK

## Employer page updates
- Add six two-word USPs across three sections — done
- Show the existing demo candidate in AI Talent Search — done; linked to Arjun Mehta's full demo profile
- Expand create, post, talent hunt and shortlist steps — done
- Add pricing and company-profile closing actions and verify — done; both destinations opened, desktop/mobile showed no overflow or page errors

## Networking page — Modern Networking Hub
- Preserve the current opening banner — done; original banner retained verbatim
- Restyle the remaining sections around the selected reference — done
- Verify images, event browsing, FAQ and layout — done; city filtering, event expansion and FAQ passed, no desktop/mobile overflow or page errors; CDN images checked through the preview asset service

## Podcasts page — Studio contrast redesign
- Rebuild the selected photo-led studio layout with consistent headings and spacing — done
- Preserve episode playback and filters, and retain live webinar content — done
- Verify images, desktop/mobile layout and interactions — done; photos loaded, audio played/paused, filters and carousels passed, no overflow or page errors

## Hackathons page — Elite Hackathon Hub redesign

- Rebuild the page as a premium editorial journey — done
- Preserve I Am Talento branding and existing hackathon content — done
- Add featured event, upcoming challenges, partner trust, journey, seasons, community,
  metrics, judging, participant stories, FAQ, and closing CTAs — done
- Verify desktop and mobile layout, interactions, overflow, and current build — done

## Assessment detail page — make it visually appealing, uniform spacing

- Header image banner — done
- More images across the page — done
- CTA banners — done (red "Your Score and Next Steps" band + dark photo "One session" band)
- Uniform section rhythm — done: every section `py-16 md:py-20`, one shared `SectionHeading`
  (icon + uppercase label, two-line heading with red second line, two-line description),
  all headings left-aligned on this page including the Credibility & Trust block
- Heading copy balanced so no orphan word on any screen; both CTA band headings fit two
  lines on desktop and phone (`text-xl md:text-3xl`, break only at `md`)
- Small labels above headings unified: plain uppercase text + icon, no pills (verified 0
  run-together words at 390 and 1158)
- Verified at 390 and 1158 widths: 2-line headings, no overflow, build OK

## Waiting on the user

- Real assessment price (₹1,999 + 18% GST shown now is a placeholder; payment is for show
  only and does not charge)
- Whether to bring back the removed "How the Assessment Works", demo video and final banner

## Header Products and job search
- Replace Resources with grouped Candidate/Employer Products and remove theme, login and Pro header controls — implemented
- Link Browse Jobs hero Search to Talento Pro and verify navigation — done; desktop/mobile menu checked, Search opens /talento-pro, build OK

## Employer banner layout
- Move the Talent Search panel to the right and the headline, copy, buttons and trust labels to the left — done; verified at 1497 and 390 widths, no overlap, phone titles wrap instead of truncating, build OK
- Remove the two workplace photos under the banner — done; hero now ends at the Talent Search panel, verified at 1497 and 390 with build OK

## Employer benefits layout
- Replace the six-card grid with a photo-led editorial layout and six open numbered rows — done
- Verify all benefits remain visible and the section fits desktop and phone — done; all six benefits and photo checked at 1497 and 390 widths, no mobile overflow or runtime errors, build OK

## Employer "One Platform" section
- Remove the wide photo above the six capability cards — done; heading and copy now lead straight into the cards, verified in the preview with build OK

## Employer AI evaluation section
- Add the supplied reference section above "Meet Your Next Hire. Beyond a Resume." — done; centred headline, two buttons, "No login required" note, and three connected cards (your question + AI criteria, candidate response with Text/Audio/Video tabs, scored AI report)
- Verify the flow and layout — done; tabs switch, the sample answer plays and advances, cards stack on phone with no overflow, section confirmed above "Meet Your Next Hire", build OK


## Employer page — section removals
- Remove the "Hiring at the Speed Of Conversation." copilot chat section — done; component, sample prompts and its unused icons removed from the shared showcase file
- Remove the "Great People Are Hard to Find." problem section — done; its three cards, banner photo and unused imports removed from the employer page
- Verify the remaining page — done; both sections gone and "Everything It Takes", "Meet Your Next Hire" and "Book a Demo" still present at 1497 and 390 widths, no overflow or page errors, build OK

## Employer page — testimonial company logos
- Add a company logo under the name and designation in the quote card and at the bottom of each customer-story card — implemented with Razorpay, Infosys, Flipkart and Zoho from the existing logo library; laptop and phone checked

## Employer page — "All-in-One AI Hiring That Thinks Like You Do." layout rebuild
- Keep the section's content and heading, rebuild the layout like the attached reference: left column with the plan list as icon rows, pill CTA and a handwritten-style note; right column a warm rounded panel holding the product video with floating skill tags — done; plan list, video, "Get Started" and "No credit card required" all unchanged in content
- Verify laptop and phone layout — done; heading clear of the header, panel full with the video filling it, tags on the panel edges and hidden on phones, poster showing before play, no overlap or clipping at 1497 and 390 widths, build OK

## Employer page — remove candidate spotlight and talent intelligence sections
- Remove the "Meet Your Next Hire. Beyond a Resume." candidate-spotlight section and the dark "See the People Behind Your Organisation." skills-overview section — done; both components, their data and now-unused imports removed
- Verify the rest of the page — done; both sections gone and "Everything It Takes", "All-in-One AI Hiring", "One Platform for Every", integrations, stories, FAQ and demo form still present at 1497 and 390 widths, no overflow or page errors, build OK

## Employer hiring steps — five steps
- Replace the four steps with Post Jobs, Talent Hunt, Qualified Pool, Shortlist and Hire and Support — done; heading now reads "Five Clear Steps" and the row fits five cards
- Verify the row at laptop and phone — done; all five titles present, old steps gone, five equal cards at 1497 and no overflow or page errors at 390

## Employer page — "All-in-One AI Hiring" heading style
- Restyle the "All-in-One AI Hiring That Thinks Like You Do." heading like the other section headings — done; it now uses the shared centred heading (small uppercase blue label, bold sans-serif, blue second line) instead of the serif one, with the label "One Subscription"
- Verify it matches — done; identical typography, colour and centred alignment to the "One Platform for Every Team That Hires" heading at 1497 and 390 widths, no overflow or page errors, build OK


## Home3 — hero replaces search bar
- Remove the search bar from the Home3 hero and add the "India's Next Big Leap in Hiring Starts Here." copy with Browse Jobs, Assessment and Learning buttons — done; new Home3-only hero component, original homepage hero untouched
- Verify both pages — done; new headline, sub-line and paragraph present with three working links at 1280 and 390 widths, no overflow, homepage still shows its search bar, build OK

## Home3 — banner split layout and skills wheel
- Left-align the headline, copy and buttons, and add the circular skills wheel on the right — done; new Home3SkillsWheel component with twelve equal wedges, two-line labels, three category arcs and a portrait that breaks the inner circle; original homepage hero untouched
- Remove the Learning button and change the eyebrow to "New Era of Hiring" — done
- Verify laptop and phone — done; all twelve wedges read top-to-bottom in order, no label sits off its wedge, category arcs complete, no phone overflow, build OK
- Make Browse Jobs double width with Assessment and Learning below it, and remove the Learning / Skill Assessments / Job Hunt strip — done; Browse Jobs spans the full column, Assessment and Learning sit side by side beneath it, all three stack on phones; strip removed

## Employer page — testimonial videos
- Add 4 testimonial videos to "Trusted by Hiring Teams Across India." — done; four 6-second AI-generated talking-head clips (testimonial-1..4.mp4, CDN assets) with the original photos as posters, each card keeps quote, name, role and company logo; added a fourth testimonial (Arjun Mehta, Talent Manager, Consulting, TCS logo — placeholder name/quote for the user to replace)
- Move the section above "One Platform for Every Team That Hires." — done; TestimonialsSection now renders directly before TeamsSection
- Verified in browser at 1497px: correct order, all four videos load with posters, build OK
