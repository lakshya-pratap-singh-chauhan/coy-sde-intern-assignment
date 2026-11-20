# Coy SDE Intern Assignment: Discover Tab

> A swipe-based Discover tab for Coy. Likes stay secret until they are mutual.

## Overview

This project is my submission for the Coy SDE intern assignment (Part B). It adds a **Discover** tab, in the style of Bumble and Tinder, next to a placeholder **Home** tab and a **Matches** tab. It is a standalone app: one fixed logged-in user, no authentication.

The core promise of Coy is privacy, so the app never reveals who liked the user unless the like is mutual.

## Features

- **Swipe cards**: one profile at a time. Drag the card on mobile, or use the Pass and Like buttons (and the Left and Right arrow keys) on desktop.
- **Clear swipe feedback**: a light green tint with a LIKE stamp when swiping right, a light red tint with a NOPE stamp when swiping left.
- **Mutual matching**: an "It's a match!" screen appears only when both people liked each other.
- **Matches tab**: lists all mutual matches, newest first.
- **No repeats**: a swiped profile never appears again, even after a page reload.
- **Gender preference**: choose Women, Men or Everyone to filter the feed.
- **Empty state**: a friendly "You're all caught up" screen, with a Start over button for demos.
- **Persistence**: swipes and matches are stored in the database and survive reloads.
- **Home tab**: an intentional "We're working on it" placeholder, as in the brief.

## Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js 14 (App Router), React, TypeScript |
| Styling | Tailwind CSS v3 |
| Animation | Framer Motion |
| Database | SQLite via @libsql/client (local file, or Turso when configured) |
| Testing | Vitest |
| Tooling | ESLint, tsx |

## Getting Started

### Prerequisites

- Node.js 18.17 or newer
- npm

### Installation

```bash
git clone https://github.com/lakshya-pratap-singh-chauhan/coy-sde-intern-assignment.git
cd coy-sde-intern-assignment
npm install
npm run dev
```

The database is created and filled with the 32 demo profiles automatically on first run. `npm run seed` resets the demo data to its initial state.

Open [http://localhost:3000](http://localhost:3000). For the best view, use your browser's device toolbar at about 390 px wide.

### Photos

Sample profile photos are included in `public/photos/` (`p01.jpg` to `p32.jpg`, matching profile ids 1 to 32) so the demo works right after cloning. Names, bios and other details are fictional, and the photos are used for assignment demonstration only. Profiles without a photo file show a silhouette placeholder.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run seed` | Create the tables and load 32 mock profiles |
| `npm test` | Run the unit tests |
| `npm run lint` | Run ESLint |

## Privacy Design

"Never reveal who has liked the user unless it is mutual" is the core rule, and it is enforced on the server:

- The seed data keeps the secret likes in a separate table, `likes_me`, which no feed or matches query ever reads.
- `GET /api/feed` returns public profile fields only. There is no `likedYou` flag and the order never favors people who liked the user.
- Only `POST /api/swipe` decides matches. It returns `match: true` only when the user likes someone who already liked the user.
- Duplicate swipes are blocked by a unique constraint, so a profile can never be swiped twice.
- A unit test checks that the feed output contains no field that reveals likes.

## API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/feed?show=girl\|boy\|all` | Profiles the user has not swiped on yet |
| `POST` | `/api/swipe` | Body: `{ "profileId": number, "direction": "like" \| "pass" }`. Returns `{ "match": boolean, "profile"?: Profile }` |
| `GET` | `/api/matches` | The user's mutual matches, newest first |
| `POST` | `/api/reset` | Clears swipes and matches for demos. Never touches profiles or secret likes |

## Demo Guide

The seed data includes 12 profiles that already liked the user, so matches can happen in a demo. Swiping right on any of these creates a match: **Aanya, Meera, Riya, Tanvi, Simran, Neha, Rohan, Arjun, Dev, Reyansh, Nikhil, Manav**. Swiping right on anyone else, or swiping left on anyone, never creates a match.

## Project Structure

```text
coy-sde-intern-assignment/
├── scripts/
│   └── seed.ts              # Creates tables and loads the mock profiles
├── src/
│   ├── app/
│   │   ├── api/             # feed, swipe, matches and reset routes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/          # SwipeCard, DiscoverTab, MatchesTab, TabBar, ...
│   ├── data/
│   │   └── profiles.ts      # 32 mock profiles (server only)
│   └── lib/
│       ├── db.ts            # Database client and schema
│       ├── swipe.ts         # All swipe and match logic
│       ├── api.ts           # Client fetch helpers
│       └── types.ts
├── tests/
│   └── swipe.test.ts        # Unit tests
└── public/photos/           # Profile photos (not committed)
```
