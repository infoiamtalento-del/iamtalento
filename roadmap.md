# Roadmap

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
