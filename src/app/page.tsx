'use client';

import React from 'react';
import Image from 'next/image';
import { JourneyProvider } from '@/context/JourneyContext';
import Navbar from '@/components/Navbar';
import MapView from '@/components/MapView';
import StoryOverlay from '@/components/StoryOverlay';
import JourneySidebar from '@/components/JourneySidebar';
import InquiryForm from '@/components/InquiryForm';
import { locations, categoryConfig, LocationCategory } from '@/data/locations';
import { useJourney } from '@/context/JourneyContext';
import {
  MapPin,
  Mountain,
  Compass,
  ArrowDown,
  Star,
  Globe,
  Tent,
  ChevronRight,
} from 'lucide-react';

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/hero.png"
          alt="Kyrgyzstan landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/60 via-forest-900/30 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6 animate-fade-in">
          <Globe className="w-4 h-4" />
          Central Asia&apos;s Hidden Gem
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight animate-slide-up">
          Discover the
          <span className="block bg-gradient-to-r from-sky-300 to-gold-400 bg-clip-text text-transparent">
            Heart of Kyrgyzstan
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: '0.15s' }}>
          From crystal alpine lakes to ancient Silk Road trails — explore 10 breathtaking
          destinations and craft your perfect nomadic adventure.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <a
            href="#map"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-forest-500 to-forest-700 text-white font-semibold shadow-xl hover:shadow-2xl hover:from-forest-400 hover:to-forest-600 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <Compass className="w-5 h-5" />
            Explore the Map
          </a>
          <a
            href="#destinations"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold hover:bg-white/20 transition-all duration-200"
          >
            View Destinations
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 sm:gap-12 mt-16 animate-slide-up" style={{ animationDelay: '0.45s' }}>
          {[
            { icon: Mountain, label: 'Peaks over 7,000m', value: '7' },
            { icon: Star, label: 'UNESCO Sites', value: '3' },
            { icon: Tent, label: 'Unique stays', value: '100+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="w-5 h-5 text-gold-400 mx-auto mb-1" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <ArrowDown className="w-6 h-6 text-white/60" />
      </div>
    </section>
  );
}

function DestinationsGrid() {
  const { addLocation, isSelected } = useJourney();

  const categories = Object.entries(categoryConfig) as [LocationCategory, typeof categoryConfig[LocationCategory]][];

  return (
    <section id="destinations" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-600 uppercase tracking-wider mb-3">
          <MapPin className="w-4 h-4" />
          Featured Destinations
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-forest-900 mb-4">
          10 Must-Visit Places in Kyrgyzstan
        </h2>
        <p className="text-muted max-w-2xl mx-auto">
          Each destination offers a unique window into Kyrgyzstan&apos;s natural beauty, rich history, and vibrant nomadic culture.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {categories.map(([key, cat]) => {
          const count = locations.filter((l) => l.category === key).length;
          return (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-forest-100 text-forest-700 shadow-sm"
            >
              <span>{cat.icon}</span>
              {cat.label}
              <span className="text-muted">({count})</span>
            </span>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
        {locations.map((location) => {
          const cat = categoryConfig[location.category];
          const selected = isSelected(location.id);
          const gradient =
            location.category === 'lake' ? 'from-sky-400 to-sky-600' :
              location.category === 'mountain' ? 'from-gray-500 to-gray-700' :
                location.category === 'historical' ? 'from-amber-400 to-amber-600' :
                  location.category === 'city' ? 'from-emerald-500 to-emerald-700' :
                    location.category === 'nature' ? 'from-orange-400 to-orange-600' :
                      'from-green-500 to-green-700';

          return (
            <div
              key={location.id}
              className="group bg-white rounded-2xl overflow-hidden border border-forest-100 hover:border-forest-300 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Card image */}
              <div className={`relative h-44 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                <span className="text-6xl opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-300">
                  {cat.icon}
                </span>
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-white bg-black/25 backdrop-blur-sm">
                    {cat.icon} {cat.label}
                  </span>
                </div>
                {location.elevation && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium text-white bg-black/25 backdrop-blur-sm">
                      <Mountain className="w-3 h-3" />
                      {location.elevation}
                    </span>
                  </div>
                )}
              </div>

              {/* Card body */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-forest-900 mb-1.5">{location.name}</h3>
                <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2">{location.shortDescription}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {location.highlights.slice(0, 3).map((h) => (
                    <span key={h} className="text-[11px] px-2 py-0.5 rounded-full bg-forest-50 text-forest-600 font-medium">
                      {h}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => !selected && addLocation(location)}
                  className={`w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${selected
                      ? 'bg-forest-50 text-forest-600 border border-forest-200'
                      : 'bg-gradient-to-r from-forest-600 to-forest-700 text-white shadow-md hover:shadow-lg hover:from-forest-500 hover:to-forest-600'
                    }`}
                >
                  {selected ? '✓ In My Journey' : '+ Add to Journey'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MapSection() {
  return (
    <section id="map" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 uppercase tracking-wider mb-3">
          <Compass className="w-4 h-4" />
          Interactive Map
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-forest-900 mb-4">
          Explore Kyrgyzstan
        </h2>
        <p className="text-muted max-w-2xl mx-auto">
          Click on any marker to learn more about the destination and add it to your journey.
        </p>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-2xl border border-forest-100 relative">
        <MapView />
        <StoryOverlay />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-forest-900 text-white py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg">Kyrgyzstan Travel Guide</div>
              <div className="text-forest-300 text-sm">Discover Central Asia&apos;s hidden gem</div>
            </div>
          </div>
          <div className="text-forest-400 text-sm text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} Kyrgyzstan Travel Guide. All rights reserved.</p>
            <p className="mt-1">Built with ❤️ for adventurous souls</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <JourneyProvider>
      <Navbar />
      <main>
        <HeroSection />
        <MapSection />
        <DestinationsGrid />
      </main>
      <Footer />
      <JourneySidebar />
      <InquiryForm />
    </JourneyProvider>
  );
}
