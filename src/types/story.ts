/**
 * Story / Voyager-style tour schema for the Kyrgyzstan 3D map.
 * Used by: Public Viewer (slide tour mode) and Admin Panel (camera capture, CRUD).
 *
 * Backend: See docs/story-backend.md for JSON-server vs Supabase recommendation.
 */

/** Exact 3D camera state for a slide — matches MapLibre flyTo options. */
export interface CameraView {
  /** [longitude, latitude] — MapLibre convention */
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
}

/** Slide type for filtering and UI (e.g. icons, colors). */
export type LocationSlideType = 'activity' | 'housing' | 'info';

/** A single step in a destination's story — one "slide" with its own camera angle. */
export interface LocationSlide {
  id: string;
  title: string;
  /** Rich text: HTML or Markdown, depending on your renderer */
  description: string;
  image_url: string;
  type: LocationSlideType;
  /** The exact 3D angle for this slide (from Camera Capture in admin). */
  camera: CameraView;
  /** Optional elevation at this view (meters). */
  altitude_meters?: number;
  /** Order within the destination's slides (1-based or 0-based). */
  order: number;
  /** Optional: seconds to hold this view before auto-advance (0 = no auto). */
  duration_seconds?: number;
}

/** A destination (pin on the map) with a sequence of slides = one "story." */
export interface Destination {
  id: string;
  name: string;
  /** [longitude, latitude] for the main pin — MapLibre convention */
  main_pin_coordinates: [number, number];
  /** e.g. "lake" | "mountain" | "city" — for pin icon and theming */
  icon_type: string;
  /** Ordered sequence of slides (the tour). */
  slides: LocationSlide[];
  /** Optional short blurb for the pin popup / list view. */
  short_description?: string;
}

/** Top-level story/tour (e.g. "Kyrgyzstan Highlights"). Use when you have multiple tours. */
export interface Story {
  id: string;
  title: string;
  description?: string;
  /** Cover image for the tour card. */
  cover_image_url?: string;
  destinations: Destination[];
  created_at?: string;
  updated_at?: string;
}

/** Helper: create an empty CameraView from current map state (for Camera Capture). */
export function createCameraView(
  center: [number, number],
  zoom: number,
  pitch: number,
  bearing: number
): CameraView {
  return { center: [...center], zoom, pitch, bearing };
}

/** Default camera view (e.g. fallback for new slides). */
export const DEFAULT_CAMERA_VIEW: CameraView = {
  center: [75.5, 41.5],
  zoom: 6,
  pitch: 65,
  bearing: -15,
};
