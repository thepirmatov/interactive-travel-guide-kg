import type { StyleSpecification } from 'maplibre-gl';
import {
  TERRAIN_TILES_URL,
  PMTILES_URL,
  SATELLITE_LAYER_ENABLED,
  SATELLITE_TILES,
} from './config';

/**
 * Base map style: OSM raster + terrain + optional satellite.
 * Vector layers from PMTiles are added at runtime when the source loads.
 */
export function getBaseStyle(usePmtiles: boolean): StyleSpecification {
  const sources: StyleSpecification['sources'] = {
    osm: {
      type: 'raster',
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxzoom: 19,
    },
    terrain: {
      type: 'raster-dem',
      url: TERRAIN_TILES_URL,
      tileSize: 256,
    },
    hillshade: {
      type: 'raster-dem',
      url: TERRAIN_TILES_URL,
      tileSize: 256,
    },
  };

  if (usePmtiles) {
    const fullUrl = typeof window !== 'undefined' ? (PMTILES_URL.startsWith('http') ? PMTILES_URL : window.location.origin + PMTILES_URL) : '';
    if (fullUrl) {
      sources.pmtiles = {
        type: 'vector',
        url: `pmtiles://${fullUrl}`,
      };
    }
  }

  if (SATELLITE_LAYER_ENABLED) {
    sources.satellite = {
      type: 'raster',
      tiles: [SATELLITE_TILES],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://s2maps.eu">Sentinel-2 cloudless</a> by EOX (Contains modified Copernicus Sentinel data)',
      maxzoom: 14,
    };
  }

  const layers: StyleSpecification['layers'] = [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
      layout: { visibility: 'visible' },
      minzoom: 0,
      maxzoom: 22,
    },
    // Optional vector layers from PMTiles (when source is present) – tourism/nature look
    ...(sources.pmtiles
      ? ([
          { id: 'pmtiles-water', type: 'fill' as const, source: 'pmtiles', 'source-layer': 'water', paint: { 'fill-color': '#0ea5e9', 'fill-opacity': 0.85 } },
          { id: 'pmtiles-landcover', type: 'fill' as const, source: 'pmtiles', 'source-layer': 'landcover', paint: { 'fill-color': '#22c55e', 'fill-opacity': 0.5 } },
          { id: 'pmtiles-landuse', type: 'fill' as const, source: 'pmtiles', 'source-layer': 'landuse', paint: { 'fill-color': '#15803d', 'fill-opacity': 0.4 } },
          { id: 'pmtiles-park', type: 'fill' as const, source: 'pmtiles', 'source-layer': 'park', paint: { 'fill-color': '#16a34a', 'fill-opacity': 0.6 } },
        ] as StyleSpecification['layers'])
      : []),
    {
      id: 'hillshade',
      type: 'hillshade',
      source: 'hillshade',
      layout: { visibility: 'visible' },
      paint: {
        'hillshade-shadow-color': '#1a1a2e',
        'hillshade-highlight-color': '#f0f4e8',
        'hillshade-illumination-direction': 180,
        'hillshade-exaggeration': 0.4,
      },
    },
  ];

  if (SATELLITE_LAYER_ENABLED) {
    layers.push({
      id: 'satellite',
      type: 'raster',
      source: 'satellite',
      layout: { visibility: 'none' },
      minzoom: 0,
      maxzoom: 14,
    });
  }

  const style: StyleSpecification = {
    version: 8,
    sources,
    layers,
    terrain: {
      source: 'terrain',
      exaggeration: 1.5,
    },
    sky: {},
  };

  return style;
}

/** Layer IDs that might exist in OSM/Protomaps PMTiles for nature-focused styling */
export const PMTILES_LAYER_IDS = [
  'earth',
  'water',
  'waterway',
  'landuse',
  'park',
  'boundary',
  'road',
  'building',
  'place_label',
] as const;
