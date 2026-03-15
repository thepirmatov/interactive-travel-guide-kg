# Kyrgyzstan 3D Tourism Map

A **serverless**, low-cost 3D interactive map of Kyrgyzstan built with **MapLibre GL JS**, **PMTiles**, and free terrain/satellite data. Optimized for nature (mountains, lakes) and slow connections.

## Features

- **3D terrain** with hillshade and elevation exaggeration (1.5×)
- **PMTiles** vector base (optional): add your own `.pmtiles` for rich styling
- **Raster fallback**: OSM tiles when no PMTiles file is provided
- **Satellite layer**: EOX Sentinel-2 cloudless (toggle in UI)
- **Floating markers** for Issyk-Kul, Ala-Archa, Karakol
- **Service Worker** caches tiles and PMTiles for offline / fast repeat visits
- **Pitch 60°**, max pitch 85° for a strong 3D horizon

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173. For production:

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to any static host (GitHub Pages, Cloudflare Pages, Netlify, S3, etc.).

## Data setup

1. **Vector tiles (optional)**  
   See [DATA_SOURCING.md](./DATA_SOURCING.md) for how to get a PMTiles file for Kyrgyzstan (e.g. Protomaps regional extract).  
   - Place it in `public/` as `kyrgyzstan.pmtiles`, or  
   - Set `VITE_PMTILES_URL=https://your-cdn.com/your.pmtiles` when building.

2. **Terrain**  
   Uses free MapLibre demo terrain tiles by default. You can switch to AWS Open Data or self-hosted tiles (see DATA_SOURCING.md).

3. **Satellite**  
   EOX Sentinel-2 cloudless is used for the optional satellite layer (attribution in the app).

## Stack

- **Vite** + **React** + **TypeScript**
- **MapLibre GL JS** for rendering
- **PMTiles** for vector tiles (HTTP Range Requests, serverless)
- **Service Worker** for caching map resources

## Cost

Designed for **~$0** runtime: static hosting only, no paid map APIs (no Google Maps, Mapbox, or paid Maptiler).
