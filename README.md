# 🏔️ Discover Kyrgyzstan — Interactive Travel Guide

A modern, responsive tourism portal for Kyrgyzstan built with **Next.js 16**, **Tailwind CSS**, and an **interactive 3D map** (MapLibre GL + terrain). Explore 10 breathtaking destinations, build your dream itinerary, and submit a travel inquiry — all in one experience.

**Run the website:** From the project root run `npm run dev`, then open **[http://localhost:3000](http://localhost:3000)**. To edit the page layout open `src/app/page.tsx`; to change the map open `src/components/MapView.tsx`. You do not need to run `kg-3d-map` separately — the 3D map is built into this app.

![Hero Screenshot](/public/hero.png)

## ✨ Features

- **Interactive 3D Map** — MapLibre GL with terrain, pitch, hillshade, and optional satellite layer; 10 category-styled markers (Lake 💧, Mountain ⛰️, Historical 🏛️, City 🏙️, Nature 🌿, Forest 🌲) with click-to-open detail modal
- **Location Modals** — Click any marker to view a rich detail card with description, highlights, image gallery, elevation, and best season
- **Journey Planner** — Add destinations to your bucket list with real-time sidebar updates and persistent `localStorage` state
- **Multi-Step Inquiry Form** — 3-step lead-gen flow (Contact → Trip Details → Review) that POSTs to `/api/inquiry`
- **Nomadic Modern Design** — Deep forest greens, Issyk-Kul sky blues, glassmorphism cards, micro-animations, and Outfit typography

## 🗺️ Featured Destinations

| # | Destination | Category | Elevation |
|---|---|---|---|
| 1 | Bishkek | City | 800m |
| 2 | Issyk-Kul Lake | Lake | 1,607m |
| 3 | Son-Kul Lake | Lake | 3,016m |
| 4 | Tash Rabat | Historical | 3,200m |
| 5 | Arslanbob | Forest | 1,600m |
| 6 | Ala-Archa National Park | Mountain | 2,200–4,860m |
| 7 | Jeti-Ögüz | Mountain | 2,200m |
| 8 | Karakol | City | 1,770m |
| 9 | Burana Tower | Historical | 760m |
| 10 | Skazka Canyon | Nature | 1,650m |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── globals.css              # Theme, animations, Leaflet overrides
│   ├── layout.tsx               # Root layout (Outfit font, SEO meta)
│   ├── page.tsx                 # Hero, map, destinations grid, footer
│   └── api/inquiry/route.ts     # Mock inquiry POST endpoint
├── components/
│   ├── MapView.tsx              # 3D MapLibre map with terrain + markers
│   ├── MapView.css              # 3D map and marker styles
│   ├── LocationModal.tsx        # Location detail modal
│   ├── JourneySidebar.tsx       # Bucket-list sidebar
│   ├── InquiryForm.tsx          # Multi-step lead-gen form
│   └── Navbar.tsx               # Glassmorphism navigation bar
├── context/
│   └── JourneyContext.tsx       # Global state (React Context + useReducer)
└── data/
    └── locations.ts             # 10 locations with metadata
```

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Map | MapLibre GL JS + PMTiles (optional) + free terrain tiles |
| Icons | Lucide React |
| Tiles | OSM + MapLibre terrain; optional Sentinel-2 satellite |
| Font | Outfit (Google Fonts) |

## 📬 API

### `POST /api/inquiry`

Accepts a JSON body with travel inquiry data:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1 234 567 8900",
  "startDate": "2026-06-15",
  "endDate": "2026-06-25",
  "groupSize": "4",
  "notes": "Interested in horse riding",
  "locations": [
    { "id": "issyk-kul", "name": "Issyk-Kul Lake", "category": "lake" }
  ]
}
```

Currently logs to the server console. Swap with EmailJS, a database, or any email service for production.

## 📄 License

MIT
