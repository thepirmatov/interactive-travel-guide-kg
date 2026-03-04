'use client';

import React, { useState, useEffect } from 'react';
import { Location, locations, categoryConfig } from '@/data/locations';
import LocationModal from './LocationModal';

// We need to dynamically import react-leaflet to avoid SSR issues
let MapContainer: React.ComponentType<Record<string, unknown>>;
let TileLayer: React.ComponentType<Record<string, unknown>>;
let Marker: React.ComponentType<Record<string, unknown>>;
let Popup: React.ComponentType<Record<string, unknown>>;
let L: typeof import('leaflet');

export default function MapView() {
    const [mounted, setMounted] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
        // Dynamically import Leaflet and react-leaflet on client side
        Promise.all([
            import('leaflet'),
            import('react-leaflet'),
        ]).then(([leaflet, rl]) => {
            L = leaflet.default || leaflet;
            MapContainer = rl.MapContainer;
            TileLayer = rl.TileLayer;
            Marker = rl.Marker;
            Popup = rl.Popup;

            // Fix default icon issue
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete (L.Icon.Default.prototype as any)._getIconUrl;

            setMounted(true);
        });
    }, []);

    if (!mounted) {
        return (
            <div className="w-full h-[600px] rounded-2xl bg-forest-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-3 border-forest-300 border-t-forest-600 rounded-full animate-spin" />
                    <p className="text-forest-600 font-medium">Loading map...</p>
                </div>
            </div>
        );
    }

    const createCategoryIcon = (category: string) => {
        const config = categoryConfig[category as keyof typeof categoryConfig];
        const color = config?.color || '#2E7D32';
        const emoji = config?.icon || '📍';

        return L.divIcon({
            className: 'custom-marker',
            html: `
        <div style="
          position: relative;
          width: 44px;
          height: 52px;
          cursor: pointer;
        ">
          <svg width="44" height="52" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 51C22 51 42 33.5 42 20C42 9.507 33.046 1 22 1C10.954 1 2 9.507 2 20C2 33.5 22 51 22 51Z" fill="${color}" stroke="white" stroke-width="2"/>
          </svg>
          <div style="
            position: absolute;
            top: 6px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 18px;
            line-height: 1;
            text-align: center;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            filter: drop-shadow(0 1px 1px rgba(0,0,0,0.2));
          ">${emoji}</div>
        </div>
      `,
            iconSize: [44, 52],
            iconAnchor: [22, 52],
            popupAnchor: [0, -52],
        });
    };

    return (
        <>
            <MapContainer
                center={[41.5, 75.5]}
                zoom={7}
                style={{ height: '600px', width: '100%', borderRadius: '16px' }}
                scrollWheelZoom={true}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...({ whenReady: () => setMapReady(true) } as any)}
            >
                <TileLayer
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    {...({
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
                        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
                    } as any)}
                />
                {mapReady && locations.map((location) => (
                    <Marker
                        key={location.id}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        {...({
                            position: location.coordinates,
                            icon: createCategoryIcon(location.category),
                            eventHandlers: {
                                click: () => setSelectedLocation(location),
                            },
                        } as any)}
                    >
                        <Popup>
                            <div
                                className="cursor-pointer"
                                onClick={() => setSelectedLocation(location)}
                            >
                                <div className={`h-24 rounded-t-lg bg-gradient-to-br ${location.category === 'lake' ? 'from-sky-400 to-sky-600' :
                                        location.category === 'mountain' ? 'from-gray-500 to-gray-700' :
                                            location.category === 'historical' ? 'from-amber-400 to-amber-600' :
                                                location.category === 'city' ? 'from-emerald-500 to-emerald-700' :
                                                    location.category === 'nature' ? 'from-orange-400 to-orange-600' :
                                                        'from-green-500 to-green-700'
                                    } flex items-center justify-center`}>
                                    <span className="text-4xl">{categoryConfig[location.category].icon}</span>
                                </div>
                                <div className="p-3">
                                    <h3 className="font-bold text-forest-900 text-sm mb-1">{location.name}</h3>
                                    <p className="text-xs text-muted leading-relaxed line-clamp-2">{location.shortDescription}</p>
                                    <div className="mt-2 text-xs font-semibold text-forest-600 flex items-center gap-1">
                                        Click for details →
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <LocationModal location={selectedLocation} onClose={() => setSelectedLocation(null)} />
        </>
    );
}
