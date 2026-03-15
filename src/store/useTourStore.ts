import { create } from 'zustand';
import type { Destination, LocationSlide, CameraView } from '@/types/story';
import { createCameraView } from '@/types/story';
import { getSeedDestinations } from '@/data/destinations';

export type ViewMode = 'map' | 'story' | 'admin';

type MapInstance = import('maplibre-gl').Map;

interface TourState {
  map: MapInstance | null;
  setMap: (map: MapInstance | null) => void;

  mode: ViewMode;
  setMode: (mode: ViewMode) => void;

  storyDestination: Destination | null;
  storySlideIndex: number;
  openStory: (destination: Destination) => void;
  closeStory: () => void;
  nextSlide: () => void;
  prevSlide: () => void;
  setStorySlideIndex: (index: number) => void;

  destinations: Destination[];
  setDestinations: (d: Destination[]) => void;
  updateDestinationSlides: (destinationId: string, slides: LocationSlide[]) => void;

  adminDestinationId: string | null;
  adminSlides: LocationSlide[];
  adminActiveSlideIndex: number;
  setAdminDestination: (id: string | null) => void;
  setAdminSlides: (slides: LocationSlide[]) => void;
  setAdminActiveSlideIndex: (i: number) => void;
  addSlide: () => void;
  updateSlide: (index: number, patch: Partial<LocationSlide>) => void;
  removeSlide: (index: number) => void;

  captureCamera: () => void;
  previewSlide: () => void;

  flyToCamera: (camera: CameraView, duration?: number) => void;
  flyToGlobalView: () => void;
}

const FLY_DURATION_MS = 2000;
const GLOBAL_VIEW: CameraView = { center: [75.5, 41.5], zoom: 6, pitch: 65, bearing: -15 };

export const useTourStore = create<TourState>((set, get) => ({
  map: null,
  setMap: (map) => set({ map }),

  mode: 'map',
  setMode: (mode) => set({ mode }),

  storyDestination: null,
  storySlideIndex: 0,
  openStory: (destination) =>
    set({
      mode: 'story',
      storyDestination: destination,
      storySlideIndex: 0,
    }),
  closeStory: () =>
    set({
      mode: 'map',
      storyDestination: null,
      storySlideIndex: 0,
    }),
  nextSlide: () => {
    const { storyDestination } = get();
    if (!storyDestination) return;
    const max = storyDestination.slides.length - 1;
    set((s) => ({ storySlideIndex: Math.min(s.storySlideIndex + 1, max) }));
  },
  prevSlide: () =>
    set((s) => ({ storySlideIndex: Math.max(0, s.storySlideIndex - 1) })),
  setStorySlideIndex: (index) => set({ storySlideIndex: index }),

  destinations: getSeedDestinations(),
  setDestinations: (destinations) => set({ destinations }),
  updateDestinationSlides: (destinationId, slides) =>
    set((s) => ({
      destinations: s.destinations.map((d) =>
        d.id === destinationId ? { ...d, slides } : d
      ),
    })),

  adminDestinationId: null,
  adminSlides: [],
  adminActiveSlideIndex: 0,
  setAdminDestination: (id) => {
    const { destinations } = get();
    const dest = id ? destinations.find((d) => d.id === id) : null;
    set({
      adminDestinationId: id,
      adminSlides: dest ? [...dest.slides] : [],
      adminActiveSlideIndex: 0,
    });
  },
  setAdminSlides: (slides) => set({ adminSlides: slides }),
  setAdminActiveSlideIndex: (i) => set({ adminActiveSlideIndex: i }),
  addSlide: () => {
    const { adminSlides } = get();
    const newSlide: LocationSlide = {
      id: `slide-${Date.now()}`,
      title: 'New Slide',
      description: '',
      image_url: '/hero.png',
      type: 'info',
      camera: { ...GLOBAL_VIEW },
      order: adminSlides.length + 1,
    };
    set({ adminSlides: [...adminSlides, newSlide], adminActiveSlideIndex: adminSlides.length });
  },
  updateSlide: (index, patch) =>
    set((s) => ({
      adminSlides: s.adminSlides.map((sl, i) =>
        i === index ? { ...sl, ...patch } : sl
      ),
    })),
  removeSlide: (index) =>
    set((s) => ({
      adminSlides: s.adminSlides.filter((_, i) => i !== index),
      adminActiveSlideIndex: Math.max(0, Math.min(s.adminActiveSlideIndex, s.adminSlides.length - 2)),
    })),

  captureCamera: () => {
    const { map, adminSlides, adminActiveSlideIndex } = get();
    if (!map || adminSlides.length === 0) return;
    const c = map.getCenter();
    const center: [number, number] = [c.lng, c.lat];
    const camera = createCameraView(center, map.getZoom(), map.getPitch(), map.getBearing());
    get().updateSlide(adminActiveSlideIndex, { camera });
  },

  previewSlide: () => {
    const { map, adminSlides, adminActiveSlideIndex } = get();
    if (!map || !adminSlides[adminActiveSlideIndex]) return;
    get().flyToCamera(adminSlides[adminActiveSlideIndex].camera, 1500);
  },

  flyToCamera: (camera, duration = FLY_DURATION_MS) => {
    const { map } = get();
    if (!map) return;
    map.flyTo({
      center: camera.center,
      zoom: camera.zoom,
      pitch: camera.pitch,
      bearing: camera.bearing,
      duration,
      essential: true,
    });
  },

  flyToGlobalView: () => {
    get().flyToCamera(GLOBAL_VIEW, 2500);
  },
}));
