/**
 * GeoJSON for "world minus Kyrgyzstan" — inverted polygon for spotlight dimming.
 * Outer ring: whole world (counter-clockwise so interior = world).
 * Inner ring: Kyrgyzstan border (clockwise = hole).
 *
 * Border data: 160-point high-resolution outline from src/data/kyrgyzstan-border.ts
 * (Natural Earth 1:10m style; smooth at zoom 5–12).
 */

import { KG_COORDS } from '@/data/kyrgyzstan-border';

/** World box. GeoJSON [lng, lat]. Exterior = counter-clockwise so interior is the world. */
const WORLD_OUTER_RING: [number, number][] = [
  [-180, 90],
  [-180, -90],
  [180, -90],
  [180, 90],
  [-180, 90],
];

/** Inner ring for the hole: border reversed so the polygon cutout is clockwise. */
const KG_HOLE_RING: [number, number][] = [...KG_COORDS].reverse();

/**
 * Returns a GeoJSON Feature: polygon of the world with Kyrgyzstan cut out (inverted mask).
 * Use as a fill layer with fill-color '#000000' and fill-opacity 0.7 for the spotlight.
 */
export function getWorldMinusKyrgyzstanGeoJSON(): {
  type: 'Feature';
  properties: Record<string, unknown>;
  geometry: { type: 'Polygon'; coordinates: [number[][], number[][]] };
} {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [WORLD_OUTER_RING, KG_HOLE_RING],
    },
  };
}

/**
 * Returns a GeoJSON Feature: Kyrgyzstan border as a LineString for a highlight stroke.
 * Use with a line layer (color #2E7D32, width 2.5) to highlight the country.
 */
export function getKyrgyzstanBorderGeoJSON(): {
  type: 'Feature';
  properties: Record<string, unknown>;
  geometry: { type: 'LineString'; coordinates: [number, number][] };
} {
  return {
    type: 'Feature',
    properties: { name: 'Kyrgyzstan' },
    geometry: {
      type: 'LineString',
      coordinates: [...KG_COORDS],
    },
  };
}
