/**
 * GeoJSON for "world minus Kyrgyzstan" — inverted polygon for spotlight dimming.
 * Outer ring: whole world (counter-clockwise so interior = world).
 * Inner ring: Kyrgyzstan border (clockwise = hole).
 */

/** World box exactly as specified: [[-180, 90], [180, 90], [180, -90], [-180, -90], [-180, 90]].
 * GeoJSON uses [lng, lat]. For the exterior ring we need counter-clockwise so the interior is the world:
 * walk so "left" is inside the rectangle → [[-180, 90], [-180, -90], [180, -90], [180, 90], [-180, 90]]
 */
const WORLD_OUTER_RING: [number, number][] = [
  [-180, 90],
  [-180, -90],
  [180, -90],
  [180, 90],
  [-180, 90],
];

/** Simplified Kyrgyzstan border (clockwise = hole). [lng, lat] */
const KYRGYZSTAN_BORDER_CLOCKWISE: [number, number][] = [
  [69.27, 40.18],
  [70.46, 42.22],
  [71.87, 42.75],
  [73.82, 42.73],
  [75.99, 42.56],
  [78.54, 42.34],
  [79.89, 42.5],
  [80.26, 42.35],
  [80.18, 41.85],
  [79.72, 41.03],
  [78.4, 40.96],
  [77.52, 40.4],
  [76.48, 40.18],
  [75.75, 40.52],
  [74.78, 40.37],
  [73.82, 39.89],
  [73.68, 39.43],
  [72.0, 39.54],
  [71.18, 39.45],
  [70.55, 39.6],
  [69.73, 40.15],
  [69.27, 40.18],
];

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
      coordinates: [WORLD_OUTER_RING, KYRGYZSTAN_BORDER_CLOCKWISE],
    },
  };
}
