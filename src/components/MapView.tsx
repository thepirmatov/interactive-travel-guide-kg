'use client';

/**
 * MapView — MapLibre GL JS + MapTiler Cloud vector tiles
 *
 * The boundary layer in vector tiles is the real country border (OSM admin_level=2).
 * We style it with glow + crisp line — no approximation, no overlay.
 *
 * Free tier: 100k requests/month. Key at https://cloud.maptiler.com
 * Set NEXT_PUBLIC_MAPTILER_KEY in .env.local
 */

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { categoryConfig } from '@/data/locations';
import type { LocationCategory } from '@/data/locations';
import { useTourStore } from '@/store/useTourStore';
import {
  KG_BOUNDS,
  FLYTO_CENTER,
  FLYTO_ZOOM,
  FLYTO_PITCH,
  FLYTO_BEARING,
  FLYTO_START_ZOOM,
  FLYTO_START_PITCH,
  FLYTO_DELAY_MS,
  FLYTO_DURATION_MS,
} from '@/lib/map/config';
import type { Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './MapView.css';

const MAPTILER_KEY =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_MAPTILER_KEY) ||
  '';

function makeStyle(satellite: boolean): string {
  if (!MAPTILER_KEY) {
    return 'https://demotiles.maplibre.org/style.json';
  }
  const key = encodeURIComponent(MAPTILER_KEY);
  return satellite
    ? `https://api.maptiler.com/maps/satellite/style.json?key=${key}`
    : `https://api.maptiler.com/maps/streets-v2/style.json?key=${key}`;
}

const BORDER_LAYER_IDS = ['kg-border-glow-outer', 'kg-border-glow-inner', 'kg-border-crisp'];
const COUNTRY_BORDER_FILTER = ['all', ['==', ['get', 'admin_level'], 2], ['==', ['get', 'maritime'], 0]] as any;
const LAYOUT_ROUND = { 'line-join': 'round' as const, 'line-cap': 'round' as const };

function applyBorderStyle(map: MapLibreMap): void {
  const style = map.getStyle();
  if (!style?.layers) return;

  const sourceIds = ['maptiler_planet', 'openmaptiles'];
  let boundarySourceId: string | null = null;
  for (const sid of sourceIds) {
    if (map.getSource(sid)) {
      boundarySourceId = sid;
      break;
    }
  }
  if (!boundarySourceId) {
    const sources = Object.keys(style.sources ?? {});
    for (const sid of sources) {
      if (map.getSource(sid)) {
        boundarySourceId = sid;
        break;
      }
    }
  }

  style.layers.forEach((layer: { id?: string; type?: string }) => {
    if (layer.id?.includes('boundary') && layer.type === 'line') {
      try {
        map.setPaintProperty(layer.id, 'line-width', [
          'interpolate',
          ['linear'],
          ['zoom'],
          5,
          2.5,
          8,
          4,
          12,
          6,
        ]);
        map.setPaintProperty(layer.id, 'line-color', '#4CAF50');
        map.setPaintProperty(layer.id, 'line-opacity', 1);
      } catch {
        // ignore
      }
    }
  });

  if (!boundarySourceId) return;

  BORDER_LAYER_IDS.forEach((id) => {
    if (map.getLayer(id)) map.removeLayer(id);
  });

  map.addLayer({
    id: 'kg-border-glow-outer',
    type: 'line',
    source: boundarySourceId,
    'source-layer': 'boundary',
    filter: COUNTRY_BORDER_FILTER,
    layout: LAYOUT_ROUND,
    paint: {
      'line-color': '#A5D6A7',
      'line-width': ['interpolate', ['linear'], ['zoom'], 5, 10, 10, 18],
      'line-opacity': 0.2,
      'line-blur': 6,
    },
  });
  map.addLayer({
    id: 'kg-border-glow-inner',
    type: 'line',
    source: boundarySourceId,
    'source-layer': 'boundary',
    filter: COUNTRY_BORDER_FILTER,
    layout: LAYOUT_ROUND,
    paint: {
      'line-color': '#66BB6A',
      'line-width': ['interpolate', ['linear'], ['zoom'], 5, 5, 10, 9],
      'line-opacity': 0.45,
      'line-blur': 2,
    },
  });
  map.addLayer({
    id: 'kg-border-crisp',
    type: 'line',
    source: boundarySourceId,
    'source-layer': 'boundary',
    filter: COUNTRY_BORDER_FILTER,
    layout: LAYOUT_ROUND,
    paint: {
      'line-color': '#4CAF50',
      'line-width': ['interpolate', ['linear'], ['zoom'], 5, 2, 10, 3.5],
      'line-opacity': 1,
    },
  });
}

function addTerrain(map: MapLibreMap): void {
  if (map.getSource('terrain-dem')) return;

  // Use documented endpoint — `terrain-rgb-v2` (or other typos) returns HTML 404 → JSON parse errors in MapLibre
  const terrainUrl = MAPTILER_KEY
    ? `https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=${encodeURIComponent(MAPTILER_KEY)}`
    : 'https://demotiles.maplibre.org/terrain-tiles/tiles.json';

  map.addSource('terrain-dem', {
    type: 'raster-dem',
    url: terrainUrl,
    tileSize: 256,
    bounds: [69.0, 39.0, 81.0, 43.8],
  });
  map.setTerrain({ source: 'terrain-dem', exaggeration: 1.5 });
}


/** Custom nav: zoom +/-, compass toggles 2D/3D and resets bearing to north. */
function createNavControlWith2D3DToggle(pitch3D: number): {
  onAdd: (map: MapLibreMap) => HTMLElement;
  onRemove: () => void;
} {
  let container: HTMLElement | null = null;
  let toggleBtn: HTMLButtonElement | null = null;
  let pitchEndHandler: (() => void) | null = null;
  let mapRef: MapLibreMap | null = null;

  return {
    onAdd(map) {
      mapRef = map;
      container = document.createElement('div');
      container.className = 'maplibregl-ctrl maplibregl-ctrl-group';

      const zoomIn = document.createElement('button');
      zoomIn.className = 'maplibregl-ctrl-zoom-in';
      zoomIn.type = 'button';
      zoomIn.setAttribute('aria-label', 'Zoom in');
      zoomIn.addEventListener('click', () => map.zoomIn());
      const zoomInIcon = document.createElement('span');
      zoomInIcon.className = 'maplibregl-ctrl-icon';
      zoomIn.appendChild(zoomInIcon);

      const zoomOut = document.createElement('button');
      zoomOut.className = 'maplibregl-ctrl-zoom-out';
      zoomOut.type = 'button';
      zoomOut.setAttribute('aria-label', 'Zoom out');
      zoomOut.addEventListener('click', () => map.zoomOut());
      const zoomOutIcon = document.createElement('span');
      zoomOutIcon.className = 'maplibregl-ctrl-icon';
      zoomOut.appendChild(zoomOutIcon);

      toggleBtn = document.createElement('button');
      toggleBtn.className = 'maplibregl-ctrl-icon map-view-ctrl-2d3d';
      toggleBtn.type = 'button';
      toggleBtn.setAttribute('aria-label', 'Toggle 2D / 3D view');
      pitchEndHandler = () => {
        if (!toggleBtn || !mapRef) return;
        const is2D = mapRef.getPitch() < 10;
        const label = is2D
          ? 'Switch to 3D view (north up)'
          : 'Reset to north and switch to 2D view';
        toggleBtn.setAttribute('aria-label', label);
        toggleBtn.title = label;
      };
      toggleBtn.addEventListener('click', () => {
        const c = map.getCenter();
        const zoom = map.getZoom();
        const is2D = map.getPitch() < 10;
        map.flyTo({
          center: [c.lng, c.lat],
          zoom,
          pitch: is2D ? pitch3D : 0,
          bearing: 0,
          duration: 600,
          essential: true,
        });
      });
      map.on('pitchend', pitchEndHandler);
      pitchEndHandler();

      container.appendChild(zoomIn);
      container.appendChild(zoomOut);
      container.appendChild(toggleBtn);
      return container;
    },
    onRemove() {
      if (mapRef && pitchEndHandler) mapRef.off('pitchend', pitchEndHandler);
      container = null;
      toggleBtn = null;
      pitchEndHandler = null;
      mapRef = null;
    },
  };
}

export default function MapView() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{
    map: MapLibreMap;
    markers: import('maplibre-gl').Marker[];
  } | null>(null);
  const cancelledRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [satellite, setSatellite] = useState(false);
  const [styleLoading, setStyleLoading] = useState(false);
  const { destinations, openStory, setMap } = useTourStore();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    cancelledRef.current = false;
    let flyToTimeoutId: ReturnType<typeof setTimeout> | null = null;

    import('maplibre-gl').then((maplibregl) => {
      if (cancelledRef.current) return;
      const ml = maplibregl.default;

      const map = new ml.Map({
        container: containerRef.current!,
        style: makeStyle(false),
        center: FLYTO_CENTER,
        zoom: FLYTO_START_ZOOM,
        pitch: FLYTO_START_PITCH,
        bearing: FLYTO_BEARING,
        maxPitch: 80,
        minZoom: 5.5,
        maxZoom: 13,
        maxBounds: KG_BOUNDS,
        antialias: true,
        pixelRatio: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 2, 2),
      });

      map.on('error', (e: any) => {
        const msg = e.error?.message || e.message || '';
        if (msg.includes('AbortError') || msg.toLowerCase().includes('aborted')) {
          if (typeof e.preventDefault === 'function') {
            e.preventDefault();
          }
          return;
        }
        console.warn('Map Error:', e.error || e.message);
      });



      mapRef.current = { map, markers: [] };
      map.addControl(createNavControlWith2D3DToggle(FLYTO_PITCH), 'bottom-right');

      map.on('load', () => {
        if (cancelledRef.current) return;
        addTerrain(map);
        applyBorderStyle(map);
        setMap(map);
        setReady(true);

        const isAdmin = pathname === '/admin';
        if (!isAdmin) {
          flyToTimeoutId = setTimeout(() => {
            if (cancelledRef.current || !mapRef.current) return;
            map.flyTo({
              center: FLYTO_CENTER,
              zoom: FLYTO_ZOOM,
              pitch: FLYTO_PITCH,
              bearing: FLYTO_BEARING,
              duration: FLYTO_DURATION_MS,
              curve: 1,
              essential: true,
            });
          }, FLYTO_DELAY_MS);
        }
      });
    });

    return () => {
      cancelledRef.current = true;
      if (flyToTimeoutId != null) clearTimeout(flyToTimeoutId);
      if (mapRef.current) {
        mapRef.current.markers.forEach((m) => m.remove());
        mapRef.current.map.remove();
        mapRef.current = null;
      }
      setMap(null);
    };
  }, [pathname, setMap]);

  useEffect(() => {
    if (!mapRef.current || !ready) return;

    import('maplibre-gl').then((maplibregl) => {
      if (cancelledRef.current || !mapRef.current) return;
      const ref = mapRef.current;
      const { map } = ref;
      ref.markers.forEach((m) => m.remove());
      ref.markers = [];

      destinations.forEach((dest) => {
        const config = categoryConfig[dest.icon_type as LocationCategory];
        const color = config?.color ?? '#2E7D32';
        const emoji = config?.icon ?? '📍';
        const el = document.createElement('div');
        el.className = 'map-view-3d-marker map-view-3d-marker-float';
        el.innerHTML = `
          <span class="map-view-3d-marker-pin" style="background: linear-gradient(180deg, ${color} 0%, ${color}99 100%);"></span>
          <span class="map-view-3d-marker-label">${emoji} ${dest.name}</span>
        `;
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => openStory(dest));

        const marker = new maplibregl.default.Marker({ element: el, anchor: 'bottom' })
          .setLngLat(dest.main_pin_coordinates)
          .addTo(map);
        ref.markers.push(marker);
      });

      const markerContainer = map.getContainer().querySelector('.maplibregl-marker-container');
      if (markerContainer instanceof HTMLElement) {
        markerContainer.style.zIndex = '5';
      }
    });
  }, [ready, destinations, openStory]);

  const handleSatellite = () => {
    const ref = mapRef.current;
    if (!ref?.map || styleLoading) return;
    const map = ref.map;
    const next = !satellite;

    try {
      if (map.getTerrain?.()) {
        map.setTerrain(null as any);
      }
    } catch (err) {
      // ignore
    }

    setSatellite(next);
    setStyleLoading(true);
    map.setStyle(makeStyle(next));

    map.once('styledata', () => {
      if (cancelledRef.current || !mapRef.current) return;
      setStyleLoading(false);
      addTerrain(map);
      applyBorderStyle(map);
      import('maplibre-gl').then((maplibregl) => {
        if (cancelledRef.current || !mapRef.current) return;
        const r = mapRef.current!;
        r.markers.forEach((m) => m.remove());
        r.markers = [];
        destinations.forEach((dest) => {
          const config = categoryConfig[dest.icon_type as LocationCategory];
          const color = config?.color ?? '#2E7D32';
          const emoji = config?.icon ?? '📍';
          const el = document.createElement('div');
          el.className = 'map-view-3d-marker map-view-3d-marker-float';
          el.innerHTML = `
            <span class="map-view-3d-marker-pin" style="background: linear-gradient(180deg, ${color} 0%, ${color}99 100%);"></span>
            <span class="map-view-3d-marker-label">${emoji} ${dest.name}</span>
          `;
          el.style.cursor = 'pointer';
          el.addEventListener('click', () => openStory(dest));
          const marker = new maplibregl.default.Marker({ element: el, anchor: 'bottom' })
            .setLngLat(dest.main_pin_coordinates)
            .addTo(map);
          r.markers.push(marker);
        });
        const markerContainer = map.getContainer().querySelector('.maplibregl-marker-container');
        if (markerContainer instanceof HTMLElement) {
          markerContainer.style.zIndex = '5';
        }
      });
    });
    map.once('error', () => {
      setStyleLoading(false);
    });
  };

  return (
    <>
      <div className="map-view-3d-wrap">
        <div ref={containerRef} className="map-view-3d-container" />

        {ready && (
          <div className="map-view-3d-controls">
            <button
              type="button"
              className="map-view-3d-btn"
              onClick={handleSatellite}
              disabled={styleLoading}
              title={styleLoading ? 'Loading…' : satellite ? 'Switch to street map' : 'Switch to satellite'}
            >
              {styleLoading ? '…' : satellite ? '🗺 Street' : '🛰 Satellite'}
            </button>
          </div>
        )}

        {!ready && (
          <div className="map-view-3d-loading">
            <span className="map-view-3d-spinner" />
            <p className="map-view-3d-loading-text">Loading map…</p>
          </div>
        )}
      </div>
    </>
  );
}
