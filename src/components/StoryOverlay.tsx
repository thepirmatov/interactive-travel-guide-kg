'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, BookOpen } from 'lucide-react';
import { useTourStore } from '@/store/useTourStore';
import type { LocationSlideType } from '@/types/story';
import './StoryOverlay.css';

const SLIDE_TYPE_LABEL: Record<LocationSlideType, string> = {
  activity: 'Activity',
  housing: 'Stay',
  info: 'Info',
};

export default function StoryOverlay() {
  const {
    storyDestination,
    storySlideIndex,
    nextSlide,
    prevSlide,
    closeStory,
    setStorySlideIndex,
    flyToCamera,
    flyToGlobalView,
    mode,
  } = useTourStore();

  const isOpen = mode === 'story' && storyDestination && storyDestination.slides.length > 0;
  const slide = isOpen ? storyDestination!.slides[storySlideIndex] : null;
  const totalSlides = storyDestination?.slides.length ?? 0;
  const canPrev = storySlideIndex > 0;
  const canNext = storySlideIndex < totalSlides - 1;

  // When slide index changes, fly map to this slide's camera
  useEffect(() => {
    if (!isOpen || !slide) return;
    flyToCamera(slide.camera, 2000);
  }, [storySlideIndex, slide?.id, isOpen]);

  const handleClose = () => {
    flyToGlobalView();
    setTimeout(() => closeStory(), 600);
  };

  if (!isOpen || !slide) return null;

  return (
    <div className="story-overlay">
      <div className="story-overlay-backdrop" aria-hidden />
      <div className="story-overlay-card">
        <div className="story-overlay-card-header">
          <span className="story-overlay-badge">{SLIDE_TYPE_LABEL[slide.type]}</span>
          <span className="story-overlay-counter">
            {storySlideIndex + 1} / {totalSlides}
          </span>
          <button
            type="button"
            className="story-overlay-close"
            onClick={handleClose}
            aria-label="Close tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="story-overlay-image-wrap">
          <Image
            src={slide.image_url}
            alt={slide.title}
            fill
            className="object-cover"
            sizes="(max-width: 480px) 100vw, 420px"
          />
        </div>

        <div className="story-overlay-body">
          <h2 className="story-overlay-title">{slide.title}</h2>
          <div
            className="story-overlay-description"
            dangerouslySetInnerHTML={{ __html: slide.description }}
          />

          {slide.type === 'housing' && (
            <a
              href="#inquiry"
              className="story-overlay-book"
            >
              <BookOpen className="w-4 h-4" />
              Book / More Info
            </a>
          )}

          <div className="story-overlay-nav">
            <button
              type="button"
              className="story-overlay-nav-btn"
              onClick={prevSlide}
              disabled={!canPrev}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>
            <div className="story-overlay-dots">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`story-overlay-dot ${i === storySlideIndex ? 'active' : ''}`}
                  onClick={() => setStorySlideIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              className="story-overlay-nav-btn"
              onClick={nextSlide}
              disabled={!canNext}
              aria-label="Next slide"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
