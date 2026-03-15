'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { categoryConfig } from '@/data/locations';
import type { LocationCategory } from '@/data/locations';
import { useTourStore } from '@/store/useTourStore';
import {
  MAX_PITCH,
  TERRAIN_EXAGGERATION,
  USE_PMTILES,
  FLYTO_CENTER,
  FLYTO_ZOOM,
  FLYTO_PITCH,
  FLYTO_BEARING,
  FLYTO_START_ZOOM,
  FLYTO_START_PITCH,
  FLYTO_DELAY_MS,
  FLYTO_DURATION_MS,
} from '@/lib/map/config';
import { getBaseStyle } from '@/lib/map/style';
import { getWorldMinusKyrgyzstanGeoJSON } from '@/lib/map/kyrgyzstanMask';
import 'maplibre-gl/dist/maplibre-gl.css';
import './MapView.css';

export default function MapView() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const { destinations, openStory, setMap } = useTourStore();
  const [satelliteOn, setSatelliteOn] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<{ map: import('maplibre-gl').Map; markers: import('maplibre-gl').Marker[] } | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    Promise.all([import('maplibre-gl'), import('pmtiles')]).then(([maplibregl, { Protocol }]) => {
      const protocol = new Protocol();
      maplibregl.default.addProtocol('pmtiles', protocol.tile);
      cleanupRef.current = () => maplibregl.default.removeProtocol('pmtiles');

      const style = getBaseStyle(USE_PMTILES);
      const map = new maplibregl.default.Map({
        container: containerRef.current!,
        style,
        center: FLYTO_CENTER,
        zoom: FLYTO_START_ZOOM,
        pitch: FLYTO_START_PITCH,
        bearing: FLYTO_BEARING,
        maxPitch: MAX_PITCH,
        hash: true,
        maxZoom: 18,
      });

      map.on('load', () => {
        map.setTerrain({ source: 'terrain', exaggeration: TERRAIN_EXAGGERATION });

        // Spotlight: inverted polygon — dim everything outside Kyrgyzstan (0.7 opacity)
        map.addSource('spotlight-mask', {
          type: 'geojson',
          data: getWorldMinusKyrgyzstanGeoJSON(),
        });
        map.addLayer({
          id: 'spotlight-mask',
          type: 'fill',
          source: 'spotlight-mask',
          paint: {
            'fill-color': '#000000',
            'fill-opacity': 0.7,
          },
        });

        // Sky + fog: deep blue zenith, whitish horizon (MapLibre uses setSky, not setFog)
        map.setSky({
          'sky-color': '#245cdf',
          'horizon-color': '#b8d4e8',
          'sky-horizon-blend': 0.2,
          'fog-color': '#ffffff',
          'fog-ground-blend': 0.1,
          'horizon-fog-blend': 0.1,
        });

        // Light: viewport-relative for consistent shadows on terrain
        map.setLight({
          anchor: 'viewport',
          color: 'white',
          intensity: 0.4,
        });

        map.addControl(new maplibregl.default.NavigationControl({ visualizePitch: true }), 'bottom-right');
        mapRef.current = { map, markers: [] };
        setMap(map);
        setMapReady(true);

        // Cinematic intro only when on main page (not admin)
        const isAdmin = pathname === '/admin';
        if (!isAdmin) {
          setTimeout(() => {
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
      if (mapRef.current) {
        mapRef.current.markers.forEach((m) => m.remove());
        mapRef.current.map.remove();
        mapRef.current = null;
      }
      setMap(null);
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, []);

  // Add markers when map is ready (use destinations from store)
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    Promise.all([import('maplibre-gl'), import('pmtiles')]).then(([maplibregl]) => {
      const ref = mapRef.current!;
      const { map } = ref;
      // Clear existing markers so we don't duplicate when destinations change (e.g. after admin save)
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
    });
  }, [mapReady, destinations, openStory]);

  const toggleSatellite = () => {
    const ref = mapRef.current;
    if (!ref?.map?.getLayer('satellite')) return;
    const next = !satelliteOn;
    ref.map.setLayoutProperty('satellite', 'visibility', next ? 'visible' : 'none');
    ref.map.setLayoutProperty('osm', 'visibility', next ? 'none' : 'visible');
    setSatelliteOn(next);
  };

  return (
    <>
      <div className="map-view-3d-wrap">
        <div ref={containerRef} className="map-view-3d-container" />
        <div className="map-view-3d-controls">
          <button
            type="button"
            className="map-view-3d-btn"
            onClick={toggleSatellite}
            title="Toggle satellite layer"
          >
            {satelliteOn ? '🗺️ Map' : '🛰️ Satellite'}
          </button>
        </div>
        {!mapReady && (
          <div className="map-view-3d-loading">
            <span className="map-view-3d-spinner" />
            <p className="text-forest-600 font-medium">Loading map…</p>
          </div>
        )}
      </div>
    </>
  );
}
