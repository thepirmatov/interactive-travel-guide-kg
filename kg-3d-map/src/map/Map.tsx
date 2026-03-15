import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Protocol } from 'pmtiles';
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  DEFAULT_PITCH,
  MAX_PITCH,
  TERRAIN_EXAGGERATION,
  PMTILES_URL,
} from './config';
import { getBaseStyle } from './style';

/** Key destinations for 3D markers (floating animation) */
export const DESTINATION_MARKERS: Array<{ id: string; name: string; lng: number; lat: number }> = [
  { id: 'issyk-kul', name: 'Issyk-Kul', lng: 77.27, lat: 42.45 },
  { id: 'ala-archa', name: 'Ala-Archa', lng: 74.48, lat: 42.65 },
  { id: 'karakol', name: 'Karakol', lng: 78.39, lat: 42.49 },
];

function registerPmtilesProtocol() {
  const protocol = new Protocol();
  maplibregl.addProtocol('pmtiles', protocol.tile);
  return () => {
    maplibregl.removeProtocol('pmtiles');
  };
}

function createMarkerElement(name: string): HTMLDivElement {
  const el = document.createElement('div');
  el.className = 'kg-marker kg-marker-float';
  el.innerHTML = `
    <span class="kg-marker-pin"></span>
    <span class="kg-marker-label">${name}</span>
  `;
  return el;
}

export default function Map() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [satelliteOn, setSatelliteOn] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(() =>
    typeof sessionStorage !== 'undefined' && sessionStorage.getItem('kg-map-pmtiles-hint-dismissed') === '1'
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const removeProtocol = registerPmtilesProtocol();

    const style = getBaseStyle(true);
    const map = new maplibregl.Map({
      container: containerRef.current,
      style,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      pitch: DEFAULT_PITCH,
      maxPitch: MAX_PITCH,
      hash: true,
      maxZoom: 18,
    });

    mapRef.current = map;

    map.on('load', () => {
      map.setTerrain({
        source: 'terrain',
        exaggeration: TERRAIN_EXAGGERATION,
      });
      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');
      setMapReady(true);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
      removeProtocol();
    };
  }, []);

  // Add 3D markers when map is ready
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    const map = mapRef.current;
    DESTINATION_MARKERS.forEach((dest) => {
      const el = createMarkerElement(dest.name);
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([dest.lng, dest.lat])
        .addTo(map);
      markersRef.current.push(marker);
    });
  }, [mapReady]);

  const toggleSatellite = () => {
    const map = mapRef.current;
    if (!map || !map.getLayer('satellite')) return;
    const next = !satelliteOn;
    map.setLayoutProperty('satellite', 'visibility', next ? 'visible' : 'none');
    map.setLayoutProperty('osm', 'visibility', next ? 'none' : 'visible');
    setSatelliteOn(next);
  };

  const dismissHint = () => {
    setHintDismissed(true);
    try {
      sessionStorage.setItem('kg-map-pmtiles-hint-dismissed', '1');
    } catch {
      // ignore
    }
  };

  return (
    <div className="map-wrap">
      <div ref={containerRef} className="map-container" />
      <div className="map-controls">
        <button
          type="button"
          className="map-control-btn"
          onClick={toggleSatellite}
          title="Toggle satellite layer"
        >
          {satelliteOn ? '🗺️ Map' : '🛰️ Satellite'}
        </button>
      </div>
      {!mapReady && (
        <div className="map-loading">
          <span className="map-loading-spinner" />
          <span>Loading map…</span>
        </div>
      )}
      {mapReady && !PMTILES_URL.startsWith('http') && !hintDismissed && (
        <div className="map-hint">
          <span>
            Add <code>kyrgyzstan.pmtiles</code> to <code>public/</code> for vector styling.{' '}
            <a href="https://github.com/protomaps/basemaps#downloads" target="_blank" rel="noopener noreferrer" className="map-hint-link">See DATA_SOURCING.md</a>.
          </span>
          <button type="button" className="map-hint-dismiss" onClick={dismissHint} aria-label="Dismiss">×</button>
        </div>
      )}
    </div>
  );
}
