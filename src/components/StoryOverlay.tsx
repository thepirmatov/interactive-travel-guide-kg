'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, BookOpen, MapPin, Check } from 'lucide-react';
import { useTourStore } from '@/store/useTourStore';
import { useJourney } from '@/context/JourneyContext';
import { locations } from '@/data/locations';
import type { LocationSlideType } from '@/types/story';
import './StoryOverlay.css';

const SLIDE_TYPE_LABEL: Record<LocationSlideType, string> = {
  activity: 'Activity',
  housing: 'Stay',
  info: 'Info',
};

const SWIPE_THRESHOLD_PX = 50;

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
  const { addLocation, isSelected } = useJourney();

  const location = storyDestination ? locations.find((l) => l.id === storyDestination.id) : null;
  const inJourney = storyDestination ? isSelected(storyDestination.id) : false;

  const touchStartX = useRef<number | null>(null);

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

  const handleClose = useCallback(() => {
    flyToGlobalView();
    setTimeout(() => closeStory(), 600);
  }, [flyToGlobalView, closeStory]);

  // Keyboard: ← / → navigate slides, Escape closes
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
        return;
      }
      if (e.key === 'ArrowLeft' && canPrev) prevSlide();
      if (e.key === 'ArrowRight' && canNext) nextSlide();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, canPrev, canNext, handleClose, prevSlide, nextSlide]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const endX = e.changedTouches[0].clientX;
      const delta = endX - touchStartX.current;
      touchStartX.current = null;
      if (delta > SWIPE_THRESHOLD_PX && canPrev) prevSlide();
      if (delta < -SWIPE_THRESHOLD_PX && canNext) nextSlide();
    },
    [canPrev, canNext, prevSlide, nextSlide]
  );

  if (!isOpen || !slide) return null;

  return (
    <div className="story-overlay">
      <div className="story-overlay-backdrop" aria-hidden />
      <div
        className="story-overlay-card"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
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

          <div className="story-overlay-actions">
            {location && (
              <button
                type="button"
                onClick={() => addLocation(location)}
                disabled={inJourney}
                className={`story-overlay-add-journey ${inJourney ? 'added' : ''}`}
                aria-label={inJourney ? 'Already in your journey' : 'Add to journey'}
              >
                {inJourney ? (
                  <>
                    <Check className="w-4 h-4" />
                    In your journey
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    Add to journey
                  </>
                )}
              </button>
            )}
            {slide.type === 'housing' && (
              <a href="#inquiry" className="story-overlay-book">
                <BookOpen className="w-4 h-4" />
                Book / More Info
              </a>
            )}
          </div>

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
