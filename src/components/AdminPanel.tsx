'use client';

import React from 'react';
import { Camera, Plus, Play, ChevronDown } from 'lucide-react';
import { useTourStore } from '@/store/useTourStore';
import type { LocationSlideType } from '@/types/story';
import './AdminPanel.css';

const SLIDE_TYPES: LocationSlideType[] = ['info', 'activity', 'housing'];

export default function AdminPanel() {
  const {
    destinations,
    adminDestinationId,
    adminSlides,
    adminActiveSlideIndex,
    setAdminDestination,
    setAdminSlides,
    setAdminActiveSlideIndex,
    addSlide,
    updateSlide,
    removeSlide,
    captureCamera,
    previewSlide,
    updateDestinationSlides,
  } = useTourStore();

  const activeSlide = adminSlides[adminActiveSlideIndex];
  const dest = adminDestinationId ? destinations.find((d) => d.id === adminDestinationId) : null;

  const handleSaveToDestination = () => {
    if (!adminDestinationId) return;
    updateDestinationSlides(adminDestinationId, adminSlides);
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h3 className="admin-panel-title">Creator Mode</h3>
      </div>

      <div className="admin-panel-section">
        <label className="admin-panel-label">Edit destination</label>
        <select
          className="admin-panel-select"
          value={adminDestinationId ?? ''}
          onChange={(e) => setAdminDestination(e.target.value || null)}
        >
          <option value="">Select...</option>
          {destinations.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {dest && (
        <>
          <div className="admin-panel-section admin-panel-actions">
            <button type="button" className="admin-panel-btn admin-panel-btn-primary" onClick={addSlide}>
              <Plus className="w-4 h-4" />
              Add Slide
            </button>
            <button
              type="button"
              className="admin-panel-btn"
              onClick={captureCamera}
              disabled={!activeSlide}
              title="Read current map camera into active slide"
            >
              <Camera className="w-4 h-4" />
              Capture Camera
            </button>
            <button
              type="button"
              className="admin-panel-btn"
              onClick={previewSlide}
              disabled={!activeSlide}
              title="Fly map to active slide camera"
            >
              <Play className="w-4 h-4" />
              Preview
            </button>
          </div>

          {adminSlides.length > 0 && (
            <>
              <div className="admin-panel-section">
                <label className="admin-panel-label">Slides</label>
                <div className="admin-panel-slide-list">
                  {adminSlides.map((sl, i) => (
                    <div
                      key={sl.id}
                      className={`admin-panel-slide-item ${i === adminActiveSlideIndex ? 'active' : ''}`}
                    >
                      <button
                        type="button"
                        className="admin-panel-slide-item-btn"
                        onClick={() => setAdminActiveSlideIndex(i)}
                      >
                        <span className="admin-panel-slide-item-num">{i + 1}</span>
                        <span className="admin-panel-slide-item-title">{sl.title || 'Untitled'}</span>
                        <ChevronDown className="admin-panel-slide-item-chevron w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="admin-panel-slide-item-remove"
                        onClick={() => removeSlide(i)}
                        aria-label="Remove slide"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {activeSlide && (
                <div className="admin-panel-section admin-panel-form">
                  <label className="admin-panel-label">Active slide</label>
                  <input
                    type="text"
                    className="admin-panel-input"
                    placeholder="Title"
                    value={activeSlide.title}
                    onChange={(e) => updateSlide(adminActiveSlideIndex, { title: e.target.value })}
                  />
                  <select
                    className="admin-panel-select"
                    value={activeSlide.type}
                    onChange={(e) => updateSlide(adminActiveSlideIndex, { type: e.target.value as LocationSlideType })}
                  >
                    {SLIDE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className="admin-panel-input"
                    placeholder="Image URL"
                    value={activeSlide.image_url}
                    onChange={(e) => updateSlide(adminActiveSlideIndex, { image_url: e.target.value })}
                  />
                  <textarea
                    className="admin-panel-textarea"
                    placeholder="Description (HTML ok)"
                    value={activeSlide.description}
                    onChange={(e) => updateSlide(adminActiveSlideIndex, { description: e.target.value })}
                    rows={3}
                  />
                  <div className="admin-panel-camera-readout">
                    <span className="admin-panel-label">Camera</span>
                    <pre className="admin-panel-pre">
                      {JSON.stringify(activeSlide.camera, null, 2)}
                    </pre>
                  </div>
                  <button type="button" className="admin-panel-btn admin-panel-btn-save" onClick={handleSaveToDestination}>
                    Save to {dest.name}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
