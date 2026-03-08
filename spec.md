# Indie Bloodline Esports

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Public-facing esports website with smooth-scroll single-page layout
- Hero section: company name "Indie Bloodline Esports", tagline, CTA button
- Tournaments section: grid of upcoming/past tournaments with game name, date, prize pool, status badge, registration link
- "How to Register" section: step-by-step visual process guide
- About Us section: company mission and values
- Gallery/Highlights section: image grid of past events
- Contact section: social links (Facebook, Discord, YouTube, etc.) and contact info
- Sticky navigation bar with smooth scrolling to sections
- Admin content management panel (requires login) for:
  - Add / edit / remove tournaments (name, game, date, prize pool, status, registration link, banner image)
  - Add / edit / remove gallery images (caption, image)
  - Edit about/contact info
- Authorization (admin-only CMS)
- Blob storage for tournament banners and gallery images

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Select `authorization` and `blob-storage` Caffeine components
2. Generate Motoko backend with:
   - Tournament CRUD (id, title, game, date, prizePool, status, registrationUrl, bannerImageId)
   - GalleryItem CRUD (id, caption, imageId)
   - SiteInfo record (about text, contact info, social links)
   - Admin-only write operations via authorization
3. Frontend:
   - Public landing page with Hero, Tournaments, HowToRegister, AboutUs, Gallery, Contact sections
   - Sticky navbar with smooth scrolling
   - Admin panel route (/admin) protected by login, with tabs for Tournaments, Gallery, Site Info
   - Image upload via blob-storage for tournament banners and gallery images
   - Sample content seeded from frontend using backend APIs
