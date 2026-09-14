# TrailTalk — Ionic Angular App

A hiking & trail community app built with **Ionic 8 + Angular 18 (standalone components)**, recreating the Home, TrailTalk community feed, Notifications, Profile, and Personal Info screens — fully wired up and interactive.

## Features implemented

- **Home** — live search over trails, category filter chips (Nearby/Popular/Scenic/Forest), weather alert banner (tap for detail toast), trail cards with a working **DETAILS** button that opens a full trail page, notification bell with unread badge, and a community posts preview strip.
- **Explore tab** — full trail catalog with search + difficulty segment filter.
- **TrailTalk (Community)** — social feed with working **like** (heart fill + count), **comment** (bottom-sheet modal, add & view comments), **share** (native share sheet if supported, otherwise copy-link toast), and a **"+" compose button** to publish a new post.
- **Notifications** — tapping a notification marks it read and routes contextually (weather → Home, maintenance → trail detail, social → Community, tips → info alert). "Mark all" clears the unread badge everywhere.
- **Planner tab** — upcoming adventures list with add/remove, feeding the Profile page's "Upcoming Adventures".
- **Profile** — stats, upcoming adventures (tap → trail detail), account menu (Personal Info, Notifications, Privacy & Security, Help Center), and a **Sign Out** flow with confirmation that routes to a Login screen.
- **Personal Info** — reactive form with validation (name, email, phone, DOB, gender, emergency contact), tap-to-change avatar (reads a local image file, no backend needed), and **Save** persists back to the shared user state.
- **Trail Detail** — full trail page with stats grid, description, "Start Hike" action, and "Add to Planner" (syncs with Planner + Profile).

All state is held in Angular **signals** inside injectable services (`TrailService`, `PostService`, `NotificationService`, `UserService`, `WeatherService`) — no backend required, everything works fully offline with realistic mock data.

## Getting started

```bash
npm install
npm start
```

Then open the printed local URL (usually `http://localhost:4200`). For the best mobile-app feel, open Chrome DevTools device toolbar and pick an iPhone/Android preset.

### Run as a native app (optional)

```bash
npm install -g @ionic/cli
ionic build
npx cap add ios      # or: npx cap add android
npx cap sync
npx cap open ios     # or: npx cap open android
```

## Project structure

```
src/app/
  models/            Trail, Post, Notification, UserProfile interfaces
  services/          Signal-based state + mock data
  components/        Reusable trail-card & post-card
  tabs/              Bottom tab bar (Home, Explore, Community, Planner, Profile)
  pages/
    home/            Screenshot 1
    community/       Screenshot 2 (TrailTalk feed)
    notifications/   Screenshot 2 (Notifications)
    profile/         Screenshot 3 (Profile)
    personal-info/   Screenshot 3 (Personal Info)
    explore/         Extra tab: full trail catalog
    planner/         Extra tab: upcoming adventures management
    trail-detail/     Full trail page opened from "DETAILS"
    login/           Shown after Sign Out
```

## Notes

- Images are pulled from Unsplash/Pravatar URLs for a realistic look — swap in your own asset paths in the services if you'd rather bundle local images.
- Dark theme + green accent colors are defined in `src/theme/variables.scss`.
