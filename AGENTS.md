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
