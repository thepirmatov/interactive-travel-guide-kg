'use client';

import Link from 'next/link';
import { MapPin, Compass } from 'lucide-react';
import { useJourney } from '@/context/JourneyContext';

export default function Navbar() {
    const { state, toggleSidebar, setInquiry } = useJourney();
    const count = state.selectedLocations.length;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <a href="#" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-forest-600 to-forest-800 flex items-center justify-center shadow-lg group-hover:shadow-forest-500/30 transition-shadow">
                            <Compass className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-forest-900 leading-tight tracking-tight">
                                Kyrgyzstan
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-forest-600 font-medium -mt-0.5">
                                Travel Guide
                            </span>
                        </div>
                    </a>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {/* Journey button */}
                        <button
                            onClick={toggleSidebar}
                            className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 font-medium transition-all duration-200 hover:shadow-md"
                        >
                            <MapPin className="w-4 h-4" />
                            <span className="hidden sm:inline text-sm">My Journey</span>
                            {count > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-white text-[11px] font-bold flex items-center justify-center shadow-lg animate-pulse-glow">
                                    {count}
                                </span>
                            )}
                        </button>

                        {/* CTA */}
                        <Link
                            href="/admin"
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-forest-500 hover:text-forest-700"
                        >
                            Creator
                        </Link>
                        <button
                            onClick={() => setInquiry(true)}
                            className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-forest-600 to-forest-700 text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:from-forest-500 hover:to-forest-600 transition-all duration-200 transform hover:-translate-y-0.5"
                        >
                            Plan My Trip
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
