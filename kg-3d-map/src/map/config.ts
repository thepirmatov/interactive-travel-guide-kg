/**
 * Map configuration: sources, style, and defaults.
 * Replace PMTILES_URL with your own file (see DATA_SOURCING.md).
 */

/** Kyrgyzstan center [lng, lat] */
export const DEFAULT_CENTER: [number, number] = [75.5, 41.5];
export const DEFAULT_ZOOM = 6;
export const DEFAULT_PITCH = 60;
export const MAX_PITCH = 85;
export const TERRAIN_EXAGGERATION = 1.5;

/** PMTiles vector file. Put your file in public/ and use '/filename.pmtiles', or use a full URL. */
export const PMTILES_URL =
  typeof import.meta.env?.VITE_PMTILES_URL === 'string' && import.meta.env.VITE_PMTILES_URL
    ? import.meta.env.VITE_PMTILES_URL
    : '/kyrgyzstan.pmtiles';

/** Free MapLibre terrain tiles (Terrarium). Alternative: AWS Open Data (see DATA_SOURCING.md). */
export const TERRAIN_TILES_URL = 'https://demotiles.maplibre.org/terrain-tiles/tiles.json';

/** Optional satellite layer (EOX Sentinel-2 cloudless). Set to true to enable layer toggle. */
export const SATELLITE_LAYER_ENABLED = true;
export const SATELLITE_TILES =
  'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg';
