import type { Destination, LocationSlide } from '@/types/story';
import { DEFAULT_CAMERA_VIEW } from '@/types/story';
import { locations } from '@/data/locations';
import customDestinations from './custom_destinations.json';

/** Build one slide with default camera (admin can capture later). */
function slide(
  id: string,
  title: string,
  description: string,
  imageUrl: string,
  type: LocationSlide['type'],
  order: number,
  camera = DEFAULT_CAMERA_VIEW
): LocationSlide {
  return {
    id,
    title,
    description,
    image_url: imageUrl,
    type,
    camera: { ...camera },
    order,
  };
}

/** Seed destinations from locations, each with 1–2 slides for story mode. */
export function getSeedDestinations(): Destination[] {
  if (Array.isArray(customDestinations) && customDestinations.length > 0) {
    return customDestinations as Destination[];
  }

  return locations.map((loc) => {


    const lng = loc.coordinates[1];
    const lat = loc.coordinates[0];
    const mainView: [number, number] = [lng, lat];
    const slides: LocationSlide[] = [
      slide(
        `${loc.id}-overview`,
        loc.name,
        loc.shortDescription,
        loc.images[0] ?? '/hero.png',
        'info',
        1,
        { center: mainView, zoom: 9, pitch: 65, bearing: -15 }
      ),
      slide(
        `${loc.id}-detail`,
        `Discover ${loc.name}`,
        loc.description,
        loc.images[1] ?? loc.images[0] ?? '/hero.png',
        'activity',
        2,
        { center: mainView, zoom: 10, pitch: 70, bearing: -10 }
      ),
    ];
    return {
      id: loc.id,
      name: loc.name,
      main_pin_coordinates: mainView,
      icon_type: loc.category,
      short_description: loc.shortDescription,
      slides,
    };
  });
}

