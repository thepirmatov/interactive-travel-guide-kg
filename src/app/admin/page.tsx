'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useTourStore } from '@/store/useTourStore';
import MapView from '@/components/MapView';
import AdminPanel from '@/components/AdminPanel';
import { ArrowLeft } from 'lucide-react';

export default function AdminPage() {
  const setMode = useTourStore((s) => s.setMode);

  useEffect(() => {
    setMode('admin');
    return () => setMode('map');
  }, [setMode]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur border-b border-forest-100">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-forest-700 hover:text-forest-900 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to site
        </Link>
        <span className="text-sm font-semibold text-forest-600 uppercase tracking-wider">
          Creator Mode
        </span>
      </header>
      <main className="flex-1 relative">
        <div className="absolute inset-0">
          <MapView />
        </div>
        <AdminPanel />
      </main>
    </div>
  );
}
