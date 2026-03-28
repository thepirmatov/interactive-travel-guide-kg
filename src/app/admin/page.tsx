'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useTourStore } from '@/store/useTourStore';
import MapView from '@/components/MapView';
import AdminPanel from '@/components/AdminPanel';
import { ArrowLeft, Save, MapPin, ChevronDown } from 'lucide-react';
import './admin.css';

export default function AdminPage() {
  const {
    setMode,
    adminDestinationId,
    destinations,
    adminSlides,
    updateDestinationSlides,
  } = useTourStore();

  useEffect(() => {
    setMode('admin');
    return () => setMode('map');
  }, [setMode]);

  const dest = adminDestinationId
    ? destinations.find((d) => d.id === adminDestinationId)
    : null;

  const isDirty = dest
    ? JSON.stringify(dest.slides) !== JSON.stringify(adminSlides)
    : false;

  const handleSave = () => {
    if (!adminDestinationId) return;
    updateDestinationSlides(adminDestinationId, adminSlides);
  };

  return (
    <div className="adm-layout">
      {/* ── Top bar ── */}
      <header className="adm-topbar">
        <Link href="/" className="adm-back">
          <ArrowLeft size={14} />
          Back to site
        </Link>

        <div className="adm-divider" />
        <span className="adm-title">Creator mode</span>
        {isDirty && <span className="adm-unsaved">Unsaved</span>}

        <div className="adm-spacer" />

        <DestinationSelector />

        <button
          className="adm-save"
          onClick={handleSave}
          disabled={!adminDestinationId}
        >
          <Save size={13} />
          Save destination
        </button>
      </header>

      {/* ── Body: map left, panel right ── */}
      <div className="adm-body">
        <div className="adm-map">
          <MapView />
        </div>
        <AdminPanel />
      </div>
    </div>
  );
}

function DestinationSelector() {
  const { destinations, adminDestinationId, setAdminDestination } = useTourStore();

  return (
    <div className="adm-dest-wrap">
      <MapPin size={13} className="adm-dest-icon" />
      <select
        className="adm-dest-select"
        value={adminDestinationId ?? ''}
        onChange={(e) => setAdminDestination(e.target.value || null)}
      >
        <option value="">Select destination…</option>
        {destinations.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>
      <ChevronDown size={13} className="adm-dest-chevron" />
    </div>
  );
}