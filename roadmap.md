# Roadmap

## Employer page — plan video flush and aligned
- Remove the space on all four sides of the plan section video and set it to a 4:5 shape so the left and right columns look aligned — done; the video now measures 479x599 (ratio 0.800) with zero gap on all four sides and both columns at 599px, verified in the browser with no page errors.

## Employer page — more testimonials
- Add four more testimonial cards below the existing four in "Trusted by Hiring Teams Across India." — done; the section now shows eight cards in two rows of four, all names, roles and company logos render and every logo loads, verified in the browser with no page errors.

## Employer page — AI Interviewer section
- Rename the heading to "Meet Linda, Your AI Interviewer." and reduce the introduction to one headline line and one description line — done; verified at 1881 width the headline and description each sit on a single line, all eight points, the centre portrait, the status pill and the Get Started button render unchanged, and the build is OK.
- Make the four left-side captions one line each — done; all eight captions now sit on a single line at 1881 width with the columns aligned row by row, no clipping, no page errors. On a 390px phone the narrow column still wraps most of them to two lines.


## Employer page — 10 reasons video section
- Replace the "Your Next Great Hire. Five Clear Steps." section with a titled video ("10 Reasons to Choose TalentCIR.") plus a matching thumbnail, and remove the five process-step boxes — implemented
- Widen the video so its edges line up with the header logo and the For Employers button — done; at 1881 width the media box runs 274 to 1608 against the logo's left 272 and the button's right 1608
- Change the thumbnail background to a lighter colour — done; light cream thumbnail with navy/blue title, navy play button, section inspected at 1881 width with no clipping and no page errors
- Swap the placeholder clip for the rendered 10-reasons video when the render finishes, and confirm playback — done; the section now points at the 30-second rendered clip, its address serves correctly from the hosted preview, and the light poster and layout are unchanged with no page errors
- Place "What You Get Inside Candidates CIR Report" directly above "AI-Evaluate Candidates Like Your Top Recruiters Would." — done; order checked in the browser (CIR report 26, AI-Evaluate 28, Five Clear Steps 29), both sections inspected with no clipping or page errors, build OK.


## Networking participants
- Rename the section to Participants from Top Industries and replace flat portrait backgrounds with realistic workplaces — done
- Verify images, category filtering and layout — done; all four workplace portraits load, Engineering filters to one participant and All restores four, desktop/phone screenshots inspected, no page errors, build OK.

## Networking page — remove the city community section
- Delete the "A growing community / Find Your Community In Your City" section and its now-unused city photo helpers — done; section text gone from the live page, participant cards flow straight into Event Highlights, remaining section order intact, no page errors, build OK.

## Networking calendar — spacious redesign
- Replace the rejected matrix with city navigation, topic filters and spacious event rows — done
- Verify city/topic browsing, registration destinations and desktop/phone layout — done; Mumbai events, topic empty state and reset verified, registration opens /auth, desktop/phone screenshots inspected, no horizontal page overflow or browser errors, build OK.
- Centre the section heading block (label, two-line headline and "Across 7 cities" line) — done; heading centre point matches page centre at 1624 width, screenshot inspected, build OK.
- Put the whole calendar (heading, cities, topics, event rows, bottom line) inside one rounded bordered card — done; card spans the header's width (144px margins at 1624), heading/city list/event rows/bottom line all inside on desktop and phone, no page errors, build OK.

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

## Employer page — closing banner removed
- Remove the "Ready to Hire Better?" banner — done; FinalCTA component and its render deleted from ForEmployers.tsx, page now ends on the "Build Your Team. Make Your Next Move." banner; verified in browser (text absent, no page errors) and build OK
- Hero wheel top hidden behind fixed header + score pill covering wedge labels on the shared Home2 hero — hero top padding raised, wheel pull-up reduced, pill repositioned (done 2026-10-19)

## Home page — hero benefit chips reworded
- Verified Jobs → Browse Jobs / 10L+ Job Openings, Personalized Matches → Skill Assessments / 500+ Assessments, Your Career Edge → AI Learning / 100+ Courses — done; heroBenefits in src/components/home2/data.ts, verified in browser (three chips render the new text, no clipping, no page errors) and build OK
- Open: the same three labels still read the old wording on the Browse Jobs page (JobsHeroSection.tsx) — only the home page was in scope; awaiting the user's word on whether to update it too
- Right-side wheel sat high in the two-column hero — `.h2-hero-grid` align-items start→center and `.h2-wheel` negative top margin removed, so the wheel's midline now matches the text column's (both 417.5px at 1280); single-column layout unchanged, build OK

## Home page — hero headline on two lines
- Headline now reads "India's Next Big Leap in Hiring Starts Here." / "Learning. Skill Assessments. Job Hunt. All Connected." with each sentence on one line at a reduced size — done; Home2Hero.tsx h1 text extended, `.h2-hero h1` font-size changed to clamp(17px, 3.7cqw, 26px) with `.h2-hero-copy` given container-type: inline-size so the type scales with the copy column; verified in browser at 1624/1440/1280/1024/890 (exactly 2 lines, no clipping or header overlap) and on /home2, build OK. On phones (390px) the second sentence wraps to two lines — a single line would need ~13px text.

## Home page — hero CTA buttons removed
- "Take Free Assessment" and "Browse 5,00,000+ Jobs" removed from the shared Home2 hero — done; the `.h2-hero-actions` block deleted from src/components/home2/Home2Hero.tsx along with the now-unused Link and ArrowRight imports; verified in browser on / and /home2 (no hero buttons, neither label present anywhere on either page, no page errors, no leftover gap — the trust line and three benefit chips follow the paragraph directly), build OK

## Home page — hero headline sizes rebalanced
- Line 1 "India's Next Big Leap in Hiring Starts Here." enlarged and line 2 set a step smaller — done; `.h2-hero h1` font-size clamp(17px, 4.7cqw, 38px), `.h2-hero h1 em` font-size 0.78em, copy column widened (`.h2-hero-copy` max-width 700→900px, grid 1.32fr/0.68fr, gap 64→48px) so line 1 stays on one line; phone tweak at max-width 640px keeps line 2 readable (20px/0.86em, wraps instead of shrinking to ~13px); verified in browser at 1624/1440/1280/1120/1024/890 (line 1 37-38px, line 2 29px, both one line, no clipping or wheel collision) and 390/320, build OK

## Home page — hero label reworded
- Eyebrow above the hero headline changed to "NEW ERA OF HIRING TALENTS" (all caps) — done; `.h2-eyebrow` text in src/components/home2/Home2Hero.tsx (the class already uppercases via text-transform), verified in browser on / and /home2 (label renders in full caps, no page errors), build OK

## Home page — hero label reworded again
- Eyebrow changed from "NEW ERA OF HIRING TALENTS" to "A NEW ERA OF HIRING TALENTS" — done; single `.h2-eyebrow` text in src/components/home2/Home2Hero.tsx (shared by / and /home2); verified in browser at 1280/890/390 on both pages (label 230px wide, starts at the page's 24px padding so nothing clips, all caps intact), build OK

## Home page — hero headline set in two-tone two-line format
- Headline split to "India's Next Big Leap" / "in Hiring Starts Here." with line 1 near-black and line 2 brand blue at the same size (reference image supplied) — done; span.h2-hero-accent added in src/components/home2/Home2Hero.tsx, styled display:block + color hsl(var(--h2-red)) in home2.css; the smaller blue "Learning. Skill Assessments. Job Hunt. All Connected." sub-line unchanged; verified in browser at 1624/1280/890/390 on / and /home2 (each line one box, 43-46px both lines, line 1 rgb(15,23,41), line 2 rgb(0,44,102), nothing clipped in page context, no wheel collision), build OK

## Home page — hero paragraph enlarged 25%
- Lede "Talent CIR is building India's next-generation talent ecosystem…" raised from 12px to 15px — done; `.h2-hero-lede` font-size 12px→15px in src/components/home2/home2.css, and max-width 560px→620px so the larger text balances over two lines instead of stranding "platform." on a third; verified in browser at 1280/890/390 on / and /home2 (15px everywhere, two balanced lines on desktop, four on phone, no orphan, no clipping or overlap, 48px gap to the buttons kept), build OK

## Home page — hero headline set bold
- Headline weight raised from 400 to 700 (bold), layout and colours unchanged per request — done; `.h2-hero h1` font-weight in src/components/home2/home2.css; verified in browser at 1280/890/390 on / and /home2 (weight 700 on both lines, each still one line — line 1 431px, line 2 431px at 1280 — black over brand blue kept, sub-line one line on desktop, nothing clipped or overlapping the wheel), build OK
- Hero fit-to-page: hero fills the first viewport on >=961px with content vertically centred; sub-line "Learning. Skill Assessments. Job Hunt. All Connected." recoloured to the lede ink colour.

## Home hero — headline enlarged
- Increase "India's Next Big Leap / in Hiring Starts Here." font size by 15% — done; headline now clamp(25px, 6.3cqw, 55px) above 640px and clamp(23px, 6.7cqw, 30px) on phones, sub-line held at its previous rendered size (0.44em / 0.75em), checked in browser at 1497, 890 and 390 with no clipping or overlap, build OK

## Employer page v2 — new era section
- Move the two CTA buttons below the left-hand text and add space between the headline lines — done; buttons sit left-aligned under the description (x 231 matches the headline's x 231) and the two headline lines sit 68px apart at 1797 width, phone layout checked with both buttons readable, no horizontal overflow, build OK.

## Employer page v2 — trust bar logos colour flip
- Logos now render in full colour by default and turn greyscale + faded on hover (was the reverse).
- Checked in the preview: default filter none, hover grayscale applied; build clean.

## Employer page v2 — hero copy swap
- Hero left column replaced with the client's copy: eyebrow "The Future of Hiring Is Here", headline "Stop Screening Resumes." / "Start Finding the Right People.", bold line "TalentCIR changes the way you hire.", the discover/interview/assess/shortlist paragraph, CTAs "Book a Demo" + "Explore the Platform", and the two closing lines.
- Checked at 1797 and 390: both buttons work (Book a Demo scrolls to the demo form, Explore the Platform opens /employer-profile), no overflow, no page errors.

## Employer page v2 — hero in the main-hero format
- Left column rebuilt to the reference format: uppercase label, large two-line bold headline, medium regular line, muted paragraph, solid + outlined buttons, proof line with bold navy phrases, thin divider, three icon items (title + grey subtitle).
- Removed "Built for founders who need to scale and HR teams that need to hire better."
- Checked at 1797 (headline exactly two lines, 48px, column fits) and 390 (all three items render, no overflow); Book a Demo scrolls to the form, Explore the Platform opens /employer-profile; build OK.
