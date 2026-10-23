# Project Rules

- Keep employer account side navigation and the profile dropdown sourced from one shared menu, with role-specific views in the Pro shell, so labels and destinations stay consistent without changing candidate navigation.

- Render Pro job descriptions in a dedicated full-page detail component within the Pro shell, sharing the selected job, match calculations, and application/save handlers with all job-card entry points.

- Keep Pro job card presentation in a dedicated component with container-responsive details and actions so cards fit both result layouts.

- Keep assessment creator imagery in the shared assessment data model so discovery and detail views always use the same profile photo and company identity.
- Present every assessment journey with mandatory core tests first and exactly one selected domain-specific test below them.
- Build employer marketing pages as focused editorial flows with integrated product previews and real workplace imagery, avoiding long grids of generic feature cards.
- Use the shared demo candidate model for employer candidate previews and link to the full demo profile so identity stays consistent.
- Build event marketing pages as image-led editorial journeys with real event content, clear participation steps, and prominent registration actions.
- Keep podcast episode selection and audio playback in shared page state so every play action opens the same listening experience.
- Keep Networking section introductions in one shared heading component and city selection in page state so visual rhythm and event filtering stay consistent.
- Use the same CDN-hosted logo asset in all site and profile headers and the footer so branding stays consistent.
- Keep the reference-style demo profile dashboard separate from the reusable profile body, while sourcing candidate identity and sections from the shared demo data, so other profile views do not change unexpectedly.
- Keep demo profile section navigation mapped to explicit section IDs and source section content from the shared demo candidate model, so every tab reaches its full-profile section without changing other profile layouts.

- Keep the Products dropdown groups shared between desktop and mobile navigation so both menus show identical offerings.
- Render the candidate Pro account menu through the shared Navbar slot on desktop and mobile, with actions owned by the Pro shell, so existing feature pages remain connected without altering employer or public menus.
- Render both Pro account menus through the shared Navbar slot, sourcing employer options from employerMenu, to retain full-width profiles and consistent navigation across screen sizes.
- Keep dummy profile entry separate from real authentication and reuse the existing demo users and shell state so quick login never grants access to private accounts.
- Keep employer posting, pipeline, notifications and account presentation in employer-only views sharing shell job/application handlers, so reference redesigns cannot change employee pages or duplicate hiring state.
- Keep employer sample records and simulated service state separate from real authentication and transactions; seed once without overwriting edits, and share shell applications across demo pages so cross-page workflows stay consistent.

- Render employer candidate and applicant entry points in one linkable full-page review within the Pro shell, reusing shell application state; this preserves cross-page stages, notes and interviews.
- Keep the employer assessment dashboard in its own presentation component using shared employer service records; this keeps creation and results consistent without changing candidate assessment journeys.
- Build the /employers-page-2 employer marketing page (the main /for-employers page keeps the earlier design) from the employer-only sections in ProofEraSections, with ROI math in a tested pure helper, so candidate-facing copy never leaks into employer copy; employer-only sections from the earlier design may be reused there with the sheet's own heading copy. The client has since cut the problem, new-era, how-it-works, day-by-day, product-tour, explainable, CIR-report, integrity, responsible-AI, results, ROI, comparison, built-for-team, testimonial, candidate-experience and integrations sections from this page, so keep only the sections still listed there and do not restore them without a new ask. The AI Interviewer showcase (LindaShowcaseSection: white background, interview-dashboard image left, "Meet Linda," text and the eight capability points right, no portrait circle) sits directly after the Product Ecosystem six-product grid. Any product screenshot used there must carry the TalentCIR brand name, never a placeholder brand. The homepage Career Intelligence section (CareerIntelligencePackageHome) is reused on /employers-page-2 only with the client's own employer-framed eyebrow, headline and description passed as props; the homepage and /for-employers keep their original copy.
- Keep employer action banners in one reusable presentation component and send onboarding CTAs to the existing company-profile flow, so marketing never silently enters a demo account.
- Keep networking calendar city and topic selection within its dedicated presentation, using existing sample events and registration destinations, so browsing does not change other page filters.
- Keep the numbered employer benefits list in one shared presentation component whose items, eyebrow and headline arrive as props, so each employer page supplies its own benefits without a second copy of the layout.
