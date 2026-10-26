# DoorLah website

The official website for DoorLah, the community app for HDB, condo and landed estates across Singapore.

**Live site:** [www.doorlah.com](https://www.doorlah.com)

**Get the app:**
- [App Store](https://apps.apple.com/in/app/doorlah/id6755138562) (iPhone, available now)
- Google Play is in testing. [Join the Android beta](https://forms.gle/DwSXCWDer9uvjH8x7).

## About DoorLah

Your block, all in one place. DoorLah gives every block its own space to:

- **Chat with neighbours.** One community chat per block, with photos, replies, reporting and blocking.
- **Never miss a notice.** A notice board for everyone on your road.
- **Buy and sell nearby.** Sell items with up to five photos, or rent out a home, room or item. Buyers call the seller directly.
- **Book trusted pros.** Cleaning, repairs, aircon servicing, tuition and more:
  - choose a day and the number of hours, and see the price before you book
  - follow each booking from pending to confirmed to completed
  - rate the provider afterwards
- **Find shops nearby.** A directory of local shops with their current specials.
- **Run a business.** Turn on business mode in your profile to list a shop, offer services, or both. Providers manage booking requests and set their working hours in Singapore time.
- **Search everything.** One search covers listings, services, shops, notices, chat and your bookings.
- **Choose an appearance.** Light and dark modes, plus the option to follow your system setting.

## Site structure

| File | Purpose |
| --- | --- |
| `index.html` | Landing page with animated HTML mockups of the app (Home, Community, Market, Services, Search, Create, Business mode) |
| `privacy.html`, `terms-of-service.html`, `child-safety.html` | Legal and safety pages |
| `account-deletion.html` | How to delete an account, in the app or by email |
| `Verification.html` | Page shown after a user confirms their email address |
| `styles.css` | All styles, shared by every page |
| `script.js` | All behaviour, shared by every page |
| `images/doorlah_splash.png` | Logo, favicon and social preview image |
| `CNAME` | Custom domain for GitHub Pages (`www.doorlah.com`) |

### Design

The site uses the app's "Fluid" design system. The source tokens live in the app repo at `lib/config/fluid_colors.dart`, `fluid_tokens.dart`, `fluid_typography.dart` and `fluid_categories.dart`. When the app's tokens change, update them here too.

- **Colour:** monochrome ink (`#0C0E12`) with one teal accent (`#009583`). Each feature has a pastel tint/deep colour pair, set through `.hue-*` classes that provide `--tint` and `--deep`.
- **Dark mode:** follows the system by default. The theme switch in the header sets `data-theme` on `<html>` and remembers the choice in `localStorage` under `doorlah-theme`.
- **Type and icons:** Nunito Sans (400, 500, 700) and Material Symbols Rounded (the `.ms` class, with `.fill` for active icons), both loaded from Google Fonts.
- **Motion:**
  - Easing curves are `--ease` (`cubic-bezier(.22,1,.36,1)`) and `--spring` (`cubic-bezier(.34,1.4,.64,1)`). Springy curves are only used for movement and scale.
  - Demos run only while they are on screen.
  - With `prefers-reduced-motion`, everything shows its final state without animation.

### `script.js` modules

- Theme switch and the scrolled state of the top bar.
- Scroll reveal: elements with `.reveal` get `.reveal-in` when they scroll into view.
- Greeting and date in the hero phone, in Singapore time.
- Floating nav pill: appears after the hero, and its indicator follows the section in view, using each section's `data-tab`.
- The "+" button, which opens the "Get DoorLah" card.
- App demos: hero carousel and toast, community tabs and chat, market filter, booking lifecycle, search, Create menu and business mode toggles.

## Run locally

No build step is needed. From the repo root:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

GitHub Pages serves the `main` branch. The `CNAME` file points the site at `www.doorlah.com`, so pushing to `main` publishes it.

## Contact

[doorlah.singapore@gmail.com](mailto:doorlah.singapore@gmail.com)
