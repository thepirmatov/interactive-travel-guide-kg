'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Plus, Check, Mountain, Droplets, Clock, MapPin } from 'lucide-react';
import { Location, categoryConfig } from '@/data/locations';
import { useJourney } from '@/context/JourneyContext';

interface LocationModalProps {
    location: Location | null;
    onClose: () => void;
}

export default function LocationModal({ location, onClose }: LocationModalProps) {
    const [currentImage, setCurrentImage] = useState(0);
    const { addLocation, isSelected } = useJourney();

    if (!location) return null;

    const cat = categoryConfig[location.category];
    const selected = isSelected(location.id);

    const nextImage = () => setCurrentImage((p) => (p + 1) % location.images.length);
    const prevImage = () => setCurrentImage((p) => (p - 1 + location.images.length) % location.images.length);

    // Generate gradient colors based on category
    const gradients: Record<string, string> = {
        lake: 'from-sky-400 to-sky-600',
        mountain: 'from-gray-500 to-gray-700',
        historical: 'from-gold-400 to-gold-600',
        city: 'from-forest-500 to-forest-700',
        nature: 'from-orange-400 to-orange-600',
        forest: 'from-green-500 to-green-700',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Image gallery section */}
                <div className="relative h-64 sm:h-72 shrink-0">
                    {/* Placeholder image with gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradients[location.category] || 'from-forest-500 to-forest-700'}`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-8xl opacity-30">{cat.icon}</span>
                        </div>
                    </div>

                    {/* Navigation arrows */}
                    <button
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center transition-all"
                    >
                        <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center transition-all"
                    >
                        <ChevronRight className="w-5 h-5 text-white" />
                    </button>

                    {/* Image dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {location.images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentImage(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentImage ? 'w-6 bg-white' : 'bg-white/50 hover:bg-white/70'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>

                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-black/30 backdrop-blur-sm">
                            <span>{cat.icon}</span>
                            {cat.label}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Title */}
                    <h2 className="text-2xl font-bold text-forest-900 mb-1">{location.name}</h2>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted mb-4">
                        {location.elevation && (
                            <span className="flex items-center gap-1">
                                <Mountain className="w-3.5 h-3.5" />
                                {location.elevation}
                            </span>
                        )}
                        {location.bestSeason && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {location.bestSeason}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {location.coordinates[0].toFixed(2)}°N, {location.coordinates[1].toFixed(2)}°E
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-foreground/80 leading-relaxed mb-5">{location.description}</p>

                    {/* Highlights */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-forest-800 uppercase tracking-wider mb-2">Highlights</h3>
                        <div className="flex flex-wrap gap-2">
                            {location.highlights.map((h) => (
                                <span
                                    key={h}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-forest-50 text-forest-700 border border-forest-100"
                                >
                                    <Droplets className="w-3 h-3" />
                                    {h}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Add to journey button */}
                    <button
                        onClick={() => !selected && addLocation(location)}
                        disabled={selected}
                        className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${selected
                                ? 'bg-forest-50 text-forest-600 border-2 border-forest-200 cursor-default'
                                : 'bg-gradient-to-r from-forest-600 to-forest-700 text-white shadow-lg hover:shadow-xl hover:from-forest-500 hover:to-forest-600 transform hover:-translate-y-0.5'
                            }`}
                    >
                        {selected ? (
                            <>
                                <Check className="w-4 h-4" />
                                Added to My Journey
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                Add to My Journey
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
