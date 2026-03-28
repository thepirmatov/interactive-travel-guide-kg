'use client';

import React from 'react';
import { useJourney } from '@/context/JourneyContext';
import { MessageSquare } from 'lucide-react';

export default function InquirySection() {
  const { setInquiry } = useJourney();

  return (
    <section id="inquiry" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="rounded-2xl bg-gradient-to-br from-forest-50 to-sky-50 border border-forest-100 p-8 sm:p-10 text-center">
        <MessageSquare className="w-12 h-12 text-forest-600 mx-auto mb-4" />
        <h2 className="text-2xl sm:text-3xl font-bold text-forest-900 mb-2">Plan Your Journey</h2>
        <p className="text-muted max-w-xl mx-auto mb-6">
          Get a personalized itinerary and travel advice. Tell us your dates, group size, and interests.
        </p>
        <button
          type="button"
          onClick={() => setInquiry(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-forest-600 to-forest-700 text-white font-semibold shadow-lg hover:shadow-xl hover:from-forest-500 hover:to-forest-600 transition-all"
        >
          <MessageSquare className="w-4 h-4" />
          Request a custom itinerary
        </button>
      </div>
    </section>
  );
}
