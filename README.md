# Aji Fruit Farm — Website

Static marketing site for Ajith's guesthouse on a fruit farm in Embilipitiya, Sri Lanka. Live at: **https://yfelig.github.io/ajis-mango-farm/**

Custom domain purchased: `aji-fruit-farm.lk` (DNS not yet configured).

---

## The Goal

Build a simple, beautiful, direct-booking website for Aji Fruit Farm. No Booking.com, no Airbnb — guests message Aji on WhatsApp directly. The site should feel editorial and personal, not generic hotel.

**Four pages:**
- `index.html` — landing page with teasers linking to sub-pages
- `rooms.html` — the cottage (photo slider, specs, book CTA)
- `farm.html` — the land, the lake, the activities, the food
- `story.html` — Ajith's personal story

**Utility:**
- `photo-picker.html` — internal tool (not linked publicly) for Rivka to review/select photos and export a ZIP with notes for Yair

---

## Tech Stack

Pure HTML + CSS + vanilla JS. No framework, no build step. Deploys automatically via GitHub Pages on every push to `main`.

- Font: Cormorant Garamond (display) + Inter (body) via Google Fonts
- Colors: `--bg: #f0ede4` (warm cream), `--bg-dark: #1b3826` (deep green), `--bg-alt: #e8e3d8`
- All photos in `photos/` — real farm photos from Rivka's Nikon shoot

---

## Who Works on This

| Person | GitHub | Role |
|--------|--------|------|
| Yair | `yfelig` | Builds the site (copy, structure, code) |
| Rivka | `rivsh4-a11y` | Photography, photo selection, visual direction |

Both work with Claude Code. This README is read by both Claude instances to stay in sync.

---

## For Claude — Working on This Repo

**Before making any changes:** run `git pull` to get the latest.

**After any push:** add a brief entry to `CHANGES.md` (create it if it doesn't exist) with:
- Date
- What changed (which files, what was added/removed)
- Who made the change (Yair or Rivka)

Format:
```
## YYYY-MM-DD — [short title]
**By:** Yair / Rivka
**Changed:** brief description
**Files:** list of files touched
```

This keeps both collaborators in sync even if they don't talk before working.

**Commit message style:** `type: description` — e.g. `feat: add food carousel to farm page`, `fix: nav link on mobile`, `photos: replace room-full with Rivka's shot`

**Never push placeholder images** — if a slot doesn't have a real photo yet, leave the existing placeholder rather than pulling something from the internet without checking.

---

## Current State (as of 2026-05-04)

### What's done
- All 4 pages built and live
- 26 real photos from Rivka's shoot placed across the site
- Photo picker tool built with ZIP export for Rivka's workflow

### Open items
- **DNS** — `aji-fruit-farm.lk` needs CNAME + 4 A records pointing to GitHub Pages, then set custom domain in repo Settings → Pages
- **Placeholder photos** — 5 slots still have stock/placeholder images: `horses.jpg` (Pexels), `room-bed.jpg`, `room-view.jpg`, `room-bathroom-sky.jpg`, `room-vanity.jpg`
- **Horse riding copy** — activity card says "Ask Aji" — needs the actual farm name and location
- **Photo picker** — Rivka can use `photo-picker.html` (open locally or via GitHub Pages) to review photos and export a ZIP

### Photo inventory
All real photos are Nikon NW6A filenames renamed on import:
- `aji.jpg`, `farm-wide.jpg`, `kayak.jpg`, `cottage-exterior.jpg`, `room-doorway.jpg`, `room-full.jpg`, `bathroom.jpg` — Rivka's 7 main selections
- `farm-branch-lake.jpg`, `farm-swing.jpg`, `farm-gazebo.jpg`, `farm-mangos.jpg`, `farm-path.jpg`, `farm-vines.jpg` — farm extras
- `food-fruits.jpg`, `food-eggs.jpg`, `food-hoppers.jpg`, `food-table.jpg`, `food-hopper-juice.jpg`, `food-papaya.jpg` — food extras
- `cottage-veranda.jpg`, `cottage-lounge.jpg`, `cottage-doors.jpg`, `cottage-vines.jpg` — cottage exterior extras
- `room-armchairs.jpg`, `room-rack.jpg`, `room-bed-mirror.jpg` — room interior extras
- `bathroom-shower.jpg`, `bathroom-vanity.jpg` — bathroom extras
- `family-path.jpg`, `ajith-portrait.jpg` — Ajith/family

---

## Deployment

Every push to `main` deploys automatically to GitHub Pages. No build step, no action needed. Allow ~60 seconds for changes to go live.

To deploy: `git add . && git commit -m "..." && git push`
