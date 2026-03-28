'use client';

import React, { useState } from 'react';
import { Camera, Play, Plus, Trash2, ChevronRight } from 'lucide-react';
import { useTourStore } from '@/store/useTourStore';
import type { LocationSlideType } from '@/types/story';
import './AdminPanel.css';

type PanelTab = 'slides' | 'settings' | 'preview';

const SLIDE_TYPE_OPTIONS: LocationSlideType[] = ['info', 'activity', 'housing'];

const SLIDE_TYPE_COLORS: Record<LocationSlideType, string> = {
  info: 'admin-badge--info',
  activity: 'admin-badge--activity',
  housing: 'admin-badge--housing',
};

const SLIDE_TYPE_EMOJI: Record<LocationSlideType, string> = {
  info: '📋',
  activity: '🏃',
  housing: '🏕️',
};

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<PanelTab>('slides');

  const {
    destinations,
    adminDestinationId,
    adminSlides,
    adminActiveSlideIndex,
    setAdminActiveSlideIndex,
    addSlide,
    updateSlide,
    removeSlide,
    captureCamera,
    previewSlide,
  } = useTourStore();

  const dest = adminDestinationId
    ? destinations.find((d) => d.id === adminDestinationId)
    : null;

  const activeSlide = adminSlides[adminActiveSlideIndex] ?? null;
  const hasCamera =
    activeSlide &&
    (activeSlide.camera.zoom !== 6 ||
      activeSlide.camera.pitch !== 65 ||
      activeSlide.camera.bearing !== -15);

  return (
    <aside className="admin-panel">
      {/* ── Tabs ── */}
      <div className="admin-tabs">
        {(['slides', 'settings', 'preview'] as PanelTab[]).map((tab) => (
          <button
            key={tab}
            className={`admin-tab${activeTab === tab ? ' admin-tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'slides' && (
        <>
          {/* ── Destination info strip ── */}
          {dest ? (
            <div className="admin-dest-strip">
              <div className="admin-dest-avatar">{getCategoryEmoji(dest.icon_type)}</div>
              <div className="admin-dest-info">
                <div className="admin-dest-name">{dest.name}</div>
                <div className="admin-dest-meta">
                  {capitalise(dest.icon_type)} · {adminSlides.length}{' '}
                  {adminSlides.length === 1 ? 'slide' : 'slides'}
                </div>
              </div>
            </div>
          ) : (
            <div className="admin-empty-strip">
              Select a destination in the top bar to start editing slides.
            </div>
          )}

          {/* ── Slide list ── */}
          <div className="admin-slide-list">
            {adminSlides.length === 0 && dest && (
              <div className="admin-slide-empty">
                No slides yet. Press "Add slide" to create the first one.
              </div>
            )}

            {adminSlides.map((slide, i) => (
              <div
                key={slide.id}
                className={`admin-slide-item${i === adminActiveSlideIndex ? ' admin-slide-item--active' : ''}`}
                onClick={() => setAdminActiveSlideIndex(i)}
              >
                <div className="admin-slide-num">{i + 1}</div>

                <div
                  className="admin-slide-thumb"
                  style={{ background: getThumbGradient(slide.type) }}
                >
                  {SLIDE_TYPE_EMOJI[slide.type]}
                </div>

                <div className="admin-slide-meta">
                  <div className="admin-slide-title">{slide.title || 'Untitled'}</div>
                  <span className={`admin-badge ${SLIDE_TYPE_COLORS[slide.type]}`}>
                    {capitalise(slide.type)}
                  </span>
                </div>

                <button
                  className="admin-slide-remove"
                  aria-label="Remove slide"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSlide(i);
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* ── Add slide ── */}
          <button
            className="admin-add-slide"
            onClick={addSlide}
            disabled={!adminDestinationId}
          >
            <Plus size={14} />
            Add slide
          </button>

          {/* ── Slide edit form ── */}
          {activeSlide && (
            <div className="admin-form">
              <div className="admin-form-header">
                <span>Slide {adminActiveSlideIndex + 1} — editing</span>
                <span className={`admin-camera-status ${hasCamera ? 'admin-camera-status--set' : ''}`}>
                  {hasCamera ? '● Camera set' : '○ No camera'}
                </span>
              </div>

              {/* Title */}
              <div className="admin-field">
                <input
                  className="admin-input"
                  type="text"
                  placeholder="Slide title"
                  value={activeSlide.title}
                  onChange={(e) =>
                    updateSlide(adminActiveSlideIndex, { title: e.target.value })
                  }
                />
              </div>

              {/* Type + Image URL */}
              <div className="admin-field-row">
                <select
                  className="admin-input"
                  value={activeSlide.type}
                  onChange={(e) =>
                    updateSlide(adminActiveSlideIndex, {
                      type: e.target.value as LocationSlideType,
                    })
                  }
                >
                  {SLIDE_TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {capitalise(t)}
                    </option>
                  ))}
                </select>
                <input
                  className="admin-input"
                  type="text"
                  placeholder="Image URL"
                  value={activeSlide.image_url}
                  onChange={(e) =>
                    updateSlide(adminActiveSlideIndex, { image_url: e.target.value })
                  }
                />
              </div>

              {/* Description */}
              <div className="admin-field">
                <textarea
                  className="admin-input admin-textarea"
                  placeholder="Description (HTML supported)"
                  value={activeSlide.description}
                  rows={2}
                  onChange={(e) =>
                    updateSlide(adminActiveSlideIndex, { description: e.target.value })
                  }
                />
              </div>

              {/* Camera readout */}
              <div className="admin-camera-readout">
                <span className="admin-camera-coords">
                  {activeSlide.camera.center[0].toFixed(2)}°E,{' '}
                  {activeSlide.camera.center[1].toFixed(2)}°N · zoom{' '}
                  {activeSlide.camera.zoom.toFixed(1)} · {Math.round(activeSlide.camera.pitch)}° pitch
                </span>
                <button
                  className="admin-camera-capture-inline"
                  onClick={captureCamera}
                  title="Read current map position into this slide"
                >
                  Capture ↗
                </button>
              </div>

              {/* Actions */}
              <div className="admin-action-row">
                <button
                  className="admin-action-btn"
                  onClick={previewSlide}
                  title="Fly map to this slide's camera"
                >
                  <Play size={13} />
                  Preview flyTo
                </button>
                <button
                  className="admin-action-btn admin-action-btn--primary"
                  onClick={captureCamera}
                  title="Capture current map camera into this slide"
                >
                  <Camera size={13} />
                  Capture camera
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'settings' && (
        <div className="admin-tab-placeholder">
          <ChevronRight size={16} />
          Destination metadata settings coming soon.
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="admin-tab-placeholder">
          <ChevronRight size={16} />
          Story preview panel coming soon.
        </div>
      )}
    </aside>
  );
}

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getCategoryEmoji(type: string): string {
  const map: Record<string, string> = {
    lake: '💧',
    mountain: '⛰️',
    historical: '🏛️',
    city: '🏙️',
    nature: '🌿',
    forest: '🌲',
  };
  return map[type] ?? '📍';
}

function getThumbGradient(type: LocationSlideType): string {
  const map: Record<LocationSlideType, string> = {
    info: 'linear-gradient(135deg, #bae6fd, #0ea5e9)',
    activity: 'linear-gradient(135deg, #bbf7d0, #22c55e)',
    housing: 'linear-gradient(135deg, #bae6fd, #0369a1)',
  };
  return map[type];
}