# Data Sourcing for the Kyrgyzstan 3D Tourism Map

This document explains how to obtain the **vector tiles** (PMTiles) and **terrain tiles** (Terrain-RGB) used by the map. The app is designed to work with **free, serverless-friendly** data.

---

## 1. Vector Tiles (PMTiles) for Kyrgyzstan

The map uses **PMTiles** (Protocol Map Tiles) so tiles can be served over HTTP Range Requests from static hosting (e.g. GitHub Pages, Cloudflare Pages, S3) with no backend.

### Option A: Protomaps regional extract (recommended)

1. **Go to [Protomaps](https://protomaps.com/downloads)** (or [Protomaps Downloads](https://protomaps.com/downloads/na)).
2. **Download a regional extract** that includes Kyrgyzstan:
   - **Central Asia** or **Asia** extract if available, or
   - **World** (larger file) and use it as-is; the app only requests tiles for the viewed area.
3. The download is a single `.pmtiles` file (e.g. `central_asia.pmtiles` or `world.pmtiles`).
4. **Host it statically:**
   - Put the file in your app’s `public/` folder (e.g. `public/kyrgyzstan.pmtiles`), or
   - Upload to a static host (S3, R2, GitHub Releases, etc.) and use that URL in the app.

### Option B: Custom extract with a bounding box

If you want a **Kyrgyzstan-only** file to minimize size:

1. **Bounding box for Kyrgyzstan** (approximate):  
   West 69.2°, South 39.2°, East 80.3°, North 43.3°.
2. Use **Planetiler** or **tile-join** with OpenStreetMap data to build a PMTiles file for that bbox.
3. **Protomaps “Build your own”** (if offered) or [PMTiles CLI](https://github.com/protomaps/PMTiles) with a region filter.
4. Host the resulting `.pmtiles` file as in Option A.

### Where to point the app

In the app’s map config, set the vector source URL to your hosted file, for example:

- Local: `pmtiles:///kyrgyzstan.pmtiles` (from `public/`)
- Remote: `pmtiles://https://your-cdn.com/path/to/kyrgyzstan.pmtiles`

The app is preconfigured to use a **demo/sample URL** until you add your own. Replace that URL in the map style source (e.g. in `src/map/config.ts` or wherever the style is defined).

---

## 2. Terrain-RGB Tiles (3D Elevation)

3D terrain uses **raster DEM** tiles in **Terrain-RGB** (or Terrarium) encoding. The app needs a `tiles.json` (or equivalent) that describes the tile URL pattern.

### Option A: MapLibre demo tiles (default, no setup)

- **URL:** `https://demotiles.maplibre.org/terrain-tiles/tiles.json`
- **Encoding:** Compatible with MapLibre’s `raster-dem` (Terrarium-style).
- **Use case:** Free, no key; good for development and low-cost production. Global coverage.

The app uses this by default so it works immediately.

### Option B: AWS Open Data Terrain Tiles (Mapzen)

- **Registry:** [Terrain Tiles on AWS Open Data](https://registry.opendata.aws/terrain-tiles/).
- **Format:** Terrain-RGB; formula:  
  `height = -10000 + ((R * 256 * 256 + G * 256 + B) * 0.1)` meters.
- **Zoom levels:** Typically 0–11 (check the dataset docs).
- **Access:** HTTP from the given S3 path; no AWS account required for public read. Use the tile URL pattern in a `raster-dem` source (with correct `encoding` if MapLibre supports it for this dataset).

### Option C: Self-hosted terrain tiles

- Generate Terrain-RGB (e.g. from SRTM/Copernicus DEM) with [rio-rgbify](https://github.com/mapbox/rio-rgbify) or [gdal dem to terrain-rgb](https://gdal.org/programs/gdaldem.html) and a tiling pipeline (e.g. [martin](https://github.com/maplibre/martin), [tileserver-gl](https://github.com/maplibre/tileserver-gl), or a static tile tree).
- Serve the tiles over HTTP and point the app’s terrain source to your `tiles.json` or `{z}/{x}/{y}` URL template.

---

## 3. Optional: Satellite Imagery (Sentinel-2 cloudless)

For a “Satellite” layer you can use **EOX Sentinel-2 cloudless** (non‑commercial, with attribution):

- **XYZ tile URL pattern:**  
  `https://{a|b|c|d|e|f|g|h}.tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg`
- **Zoom levels:** 0–13 (confirm on EOX’s site).
- **Attribution:** “Sentinel-2 cloudless – https://s2maps.eu by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 20XX)”.

Add a **raster source** in your style with this template and a **raster layer**; add a layer toggle in the UI to switch between “Map” and “Satellite”.

---

## 4. Checklist

| Data            | Purpose           | Default in app              | Your action                          |
|----------------|-------------------|-----------------------------|--------------------------------------|
| Vector PMTiles | Roads, water, etc.| Placeholder / demo URL      | Add Kyrgyzstan PMTiles URL or file   |
| Terrain tiles  | 3D elevation      | MapLibre demotiles          | Optional: switch to AWS or self-host  |
| Satellite      | Optional layer    | Off                         | Optional: add EOX raster + toggle     |

After you have your PMTiles file and (optionally) terrain URL, update the map configuration in the app (e.g. `src/map/config.ts` or the component that sets `style.sources`) and rebuild.
