'use client';

import { X, Trash2, MapPin, ArrowRight, Sparkles, Compass } from 'lucide-react';
import { useJourney } from '@/context/JourneyContext';
import { useTourStore } from '@/store/useTourStore';
import { categoryConfig } from '@/data/locations';

export default function JourneySidebar() {
    const { state, removeLocation, clearJourney, setSidebar, setInquiry } = useJourney();
    const { selectedLocations, sidebarOpen } = state;
    const { openStory, destinations } = useTourStore();

    if (!sidebarOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fade-in"
                onClick={() => setSidebar(false)}
            />

            {/* Sidebar */}
            <div className="fixed top-0 right-0 bottom-0 w-full max-w-md z-50 animate-slide-in-right">
                <div className="h-full bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-forest-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-forest-900">My Journey</h2>
                                <p className="text-sm text-muted">
                                    {selectedLocations.length} {selectedLocations.length === 1 ? 'destination' : 'destinations'} selected
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSidebar(false)}
                            className="w-8 h-8 rounded-lg hover:bg-forest-50 flex items-center justify-center transition-colors"
                        >
                            <X className="w-5 h-5 text-muted" />
                        </button>
                    </div>

                    {/* Location list */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {selectedLocations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                <div className="w-20 h-20 rounded-full bg-forest-50 flex items-center justify-center mb-4">
                                    <MapPin className="w-8 h-8 text-forest-300" />
                                </div>
                                <h3 className="text-lg font-semibold text-forest-800 mb-2">No destinations yet</h3>
                                <p className="text-sm text-muted max-w-xs">
                                    Click on map markers and tap &quot;Add to My Journey&quot; to start building your dream trip.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3 stagger-children">
                                {selectedLocations.map((location, idx) => {
                                    const cat = categoryConfig[location.category];
                                    return (
                                        <div
                                            key={location.id}
                                            className="group flex items-center gap-3 p-3 rounded-xl bg-white border border-forest-100 hover:border-forest-300 hover:shadow-md transition-all duration-200"
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold text-white bg-gradient-to-br from-forest-500 to-forest-700 shrink-0">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-forest-900 text-sm truncate">{location.name}</h4>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="text-xs">{cat.icon}</span>
                                                    <span className="text-xs text-muted">{cat.label}</span>
                                                    {location.elevation && (
                                                        <>
                                                            <span className="text-xs text-muted">·</span>
                                                            <span className="text-xs text-muted">{location.elevation}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => {
                                                        const dest = destinations.find((d) => d.id === location.id);
                                                        if (dest) {
                                                            setSidebar(false);
                                                            openStory(dest);
                                                        }
                                                    }}
                                                    className="w-7 h-7 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-sky-50 flex items-center justify-center transition-all"
                                                    title="View 3D Tour"
                                                >
                                                    <Compass className="w-3.5 h-3.5 text-sky-600" />
                                                </button>
                                                <button
                                                    onClick={() => removeLocation(location.id)}
                                                    className="w-7 h-7 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 flex items-center justify-center transition-all"
                                                    title="Remove"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>


                    {/* Footer */}
                    {selectedLocations.length > 0 && (
                        <div className="p-4 border-t border-forest-100 space-y-3">
                            <button
                                onClick={() => {
                                    setSidebar(false);
                                    setInquiry(true);
                                }}
                                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-forest-600 to-forest-700 text-white font-semibold shadow-lg hover:shadow-xl hover:from-forest-500 hover:to-forest-600 transition-all duration-200 transform hover:-translate-y-0.5"
                            >
                                <Sparkles className="w-4 h-4" />
                                Plan My Trip
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={clearJourney}
                                className="w-full text-sm text-muted hover:text-red-500 transition-colors py-1"
                            >
                                Clear all destinations
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
