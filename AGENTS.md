# Project Rules

- Keep Pro job card presentation in a dedicated component with container-responsive details and actions so cards fit both result layouts.
- Render Pro job details from the shell's job URL parameter with shared job, application and save state so every job entry opens the same bookmarkable page.
- Paginate Pro job results through the shared page-size helper so filtering and navigation cannot produce inconsistent result pages.

- Keep assessment creator imagery in the shared assessment data model so discovery and detail views always use the same profile photo and company identity.
- Present every assessment journey with mandatory core tests first and exactly one selected domain-specific test below them.
- Build employer marketing pages as focused editorial flows with integrated product previews and real workplace imagery, avoiding long grids of generic feature cards.
- Use the shared demo candidate model for employer candidate previews and link to the full demo profile so identity stays consistent.
- Build event marketing pages as image-led editorial journeys with real event content, clear participation steps, and prominent registration actions.
- Keep podcast episode selection and audio playback in shared page state so every play action opens the same listening experience.
- Keep Networking section introductions in one shared heading component and city selection in page state so visual rhythm and event filtering stay consistent.
- Use the same CDN-hosted logo asset in all site and profile headers and the footer so branding stays consistent.
- Keep the reference-style demo profile dashboard separate from the reusable profile body, while sourcing candidate identity and sections from the shared demo data, so other profile views do not change unexpectedly.
- Keep the demo profile's left menu (Home, Jobs, Notifications, Messages, Me) in its own component with its own demo data, so the rail and its panels stay consistent with the shared candidate without touching other profile views.
