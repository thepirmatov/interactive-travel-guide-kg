# Deep review: uncommitted changes

Review covers **modified** and **untracked** files for the 3D map, Story mode, and Admin (Creator) panel.

---

## Summary

- **Scope:** MapLibre 3D + PMTiles/terrain, Zustand tour store, Story overlay, Admin panel, `/admin` route, seed destinations.
- **Bug fixed:** Map markers were not cleared when `destinations` changed, causing duplicate pins after admin save (fixed in `MapView.tsx`).
- **Recommendations:** XSS mitigation for slide descriptions, add `id="inquiry"` for Book link, optional dependency and README tweaks.

---

## 1. Correctness & data flow

### 1.1 Types (`src/types/story.ts`)
- **Good:** Clear interfaces (`CameraView`, `LocationSlide`, `Destination`, `Story`), MapLibre-friendly `[lng, lat]`, `createCameraView` and `DEFAULT_CAMERA_VIEW` helpers.
- **Note:** `Location.coordinates` in `locations.ts` is `[lat, lng]`; `destinations.ts` correctly converts to `[lng, lat]` for MapLibre.

### 1.2 Store (`src/store/useTourStore.ts`)
- **Good:** Single source of truth for map ref, mode, story state, admin state; `captureCamera` uses `getCenter()` / `getZoom()` / `getPitch()` / `getBearing()` (no non-existent `getCamera()`).
- **Good:** `flyToCamera` and `flyToGlobalView` guard on `map`; `nextSlide` / `prevSlide` clamp indices; `removeSlide` clamps `adminActiveSlideIndex` so it stays valid.
- **Minor:** `FLY_DURATION_MS` and `GLOBAL_VIEW` could be imported from `@/types/story` / `@/lib/map/config` for single source of truth (optional).

### 1.3 MapView markers (fixed)
- **Bug (fixed):** The effect that adds markers had `[mapReady, destinations, openStory]` as deps but never cleared existing markers. After "Save to {destination}" in admin, `destinations` changed and the effect re-ran, adding a second full set of pins.
- **Fix applied:** At the start of the marker effect, call `ref.markers.forEach((m) => m.remove())` and set `ref.markers = []` before re-adding.

### 1.4 StoryOverlay
- **Good:** Slide index and `flyToCamera` are in sync; `handleClose` flies to global view then calls `closeStory()` after 600 ms so the transition is visible.
- **useEffect deps:** `[storySlideIndex, slide?.id, isOpen]` is correct; `flyToCamera` is stable from the store so omitting it is fine.

### 1.5 Admin panel
- **Good:** Selecting a destination copies its slides into `adminSlides`; Save calls `updateDestinationSlides(adminDestinationId, adminSlides)` so in-memory store stays consistent.
- **Good:** Capture Camera / Preview disabled when no active slide; Add Slide appends and sets active index.

---

## 2. Security

### 2.1 XSS in slide description (medium)
- **Where:** `StoryOverlay.tsx` line 79: `dangerouslySetInnerHTML={{ __html: slide.description }}`.
- **Risk:** If slide content ever comes from users or an API, HTML/script in `description` runs in the page.
- **Mitigation options:**
  1. **Sanitize:** Use a library like `dompurify` and render `DOMPurify.sanitize(slide.description)`.
  2. **Plain text:** If you don’t need HTML, render as text (e.g. `{slide.description}`) or use a markdown renderer with safe options.
- **Current:** Acceptable if descriptions are only from seed data or trusted admin input; document that and add sanitization before any user-generated or API content.

### 2.2 MapView marker labels
- **Where:** `el.innerHTML = \`...${emoji} ${dest.name}\`\``. `dest.name` comes from seed/admin.
- **Risk:** Low if names are controlled; if ever from users, escape or use `textContent` for the label part.

---

## 3. Performance & lifecycle

### 3.1 MapView
- **Good:** Map and protocol cleanup in effect return; markers cleared on unmount; dynamic imports for maplibre and pmtiles.
- **Good:** Cinematic intro only when `pathname !== '/admin'` so admin page doesn’t fly on load.
- **Note:** First effect has empty deps `[]`; `pathname` is read once at run time. When navigating from `/` to `/admin`, a new `MapView` mounts on the admin page so pathname is correct. No issue.

### 3.2 Markers effect
- **Good:** After the fix, each run removes old markers then adds current `destinations`; no accumulation.
- **Optional:** If `destinations` is large, consider clearing markers synchronously before the async `Promise.all`, so the UI doesn’t briefly show stale + new markers.

### 3.3 Admin page
- **Good:** `useEffect` sets mode to `'admin'` on mount and back to `'map'` on unmount so the rest of the app doesn’t stay in admin mode.

---

## 4. Accessibility & UX

- **Good:** Story overlay: "Close tour", "Previous slide", "Next", "Go to slide N" and dot buttons have `aria-label`s; nav buttons disabled when not applicable.
- **Good:** Admin: "Remove slide" has `aria-label`.
- **Suggestion:** Ensure overlay is focus-trapped when open and focus returns to the trigger (e.g. the pin) on close, for keyboard-only users.
- **Inquiry link:** "Book / More Info" points to `#inquiry`. There is no `id="inquiry"` on the page or in `InquiryForm`. Add `id="inquiry"` to the InquiryForm container or its section so the link scrolls to the form.

---

## 5. Dependencies & config

### 5.1 package.json
- **Good:** Added `maplibre-gl`, `pmtiles`, `zustand`; kept `react-leaflet` and `leaflet` (still used elsewhere or can be removed later).
- **Optional:** If the app no longer uses Leaflet anywhere, remove `react-leaflet` and `leaflet` to trim bundle size.

### 5.2 tsconfig
- **Good:** `"exclude": ["node_modules", "kg-3d-map"]` keeps the standalone Vite app out of Next type-checking.

### 5.3 layout.tsx
- **Good:** `suppressHydrationWarning` on `<html>` and `<body>` to avoid mismatches from extension-injected attributes (e.g. `bis_register`).

---

## 6. Documentation & consistency

### 6.1 README
- **Updated:** Map stack described as MapLibre + terrain; run instructions and file pointers are clear.
- **Inconsistency:** README still says "Location Modals" and "Click any marker to view a rich detail card". The app now uses the **Story overlay** (slide tour), not a modal. Consider updating to: e.g. "Story overlay — click a pin to start a slide tour with camera flyTo".

### 6.2 Code comments
- **Good:** `story.ts` and `config.ts` are well commented; admin panel placeholders like "Description (HTML ok)" set expectations.

---

## 7. Optional improvements

| Area | Suggestion |
|------|------------|
| **FlyTo** | Add `curve` to `map.flyTo` in the store for smoother easing (e.g. `curve: 1.2`). |
| **Story overlay** | Trap focus when overlay is open; restore focus to map/pin on close. |
| **Inquiry** | Add `id="inquiry"` to the section or wrapper that contains `InquiryForm`. |
| **Sanitization** | Use DOMPurify (or similar) for `slide.description` before `dangerouslySetInnerHTML` if content is or will be user/API-driven. |
| **Persistence** | Wire admin Save to `docs/story-backend.md` (e.g. JSON-server or Supabase) when ready. |

---

## 8. Files touched (summary)

| Status | Path | Notes |
|--------|------|--------|
| Modified | `README.md` | Map stack + run instructions; minor wording mismatch with current UX. |
| Modified | `package.json` / `package-lock.json` | New deps. |
| Modified | `src/app/layout.tsx` | suppressHydrationWarning. |
| Modified | `src/app/page.tsx` | StoryOverlay in map section. |
| Modified | `src/components/MapView.tsx` | MapLibre 3D, markers, cleanup; **marker-clear fix applied**. |
| Modified | `src/components/Navbar.tsx` | Creator link to `/admin`. |
| Modified | `tsconfig.json` | exclude kg-3d-map. |
| New | `src/app/admin/page.tsx` | Creator route, mode switch. |
| New | `src/components/AdminPanel.tsx` + CSS | Add/Capture/Preview, slide form. |
| New | `src/components/StoryOverlay.tsx` + CSS | Slide card, nav, close, Book link. |
| New | `src/data/destinations.ts` | Seed from locations. |
| New | `src/store/useTourStore.ts` | Full tour + admin state. |
| New | `src/types/story.ts` | CameraView, LocationSlide, Destination, Story. |
| New | `src/lib/map/*` | Config, style, Kyrgyzstan mask. |
| New | `docs/*` | Backend notes; this review. |

---

## 9. Verdict

- **Correctness:** One real bug (duplicate markers) — fixed.
- **Security:** Document/sanitize slide HTML if content source expands.
- **UX:** Add `id="inquiry"` for the Book link; consider focus management in the overlay.
- **Maintainability:** Types and store are clear; README can be aligned with Story mode.

Safe to commit after adding `id="inquiry"` (and optional sanitization/focus tweaks as you prefer).
