'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, Users, MessageSquare, ArrowRight, ArrowLeft, Check, Send, MapPin, Loader2 } from 'lucide-react';
import { useJourney } from '@/context/JourneyContext';
import { categoryConfig } from '@/data/locations';

export default function InquiryForm() {
    const { state, setInquiry } = useJourney();
    const { inquiryOpen, selectedLocations } = state;
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        startDate: '',
        endDate: '',
        groupSize: '2',
        notes: '',
    });

    if (!inquiryOpen) return null;

    const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

    const canProceed1 = form.name.trim() && form.email.trim();
    const canProceed2 = form.startDate && form.endDate;

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const payload = {
                ...form,
                locations: selectedLocations.map((l) => ({ id: l.id, name: l.name, category: l.category })),
                submittedAt: new Date().toISOString(),
            };
            const res = await fetch('/api/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setSubmitted(true);
            }
        } catch {
            // Fallback — still show success since it's a mock
            setSubmitted(true);
        }
        setSubmitting(false);
    };

    const handleClose = () => {
        setInquiry(false);
        setStep(1);
        setSubmitted(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={handleClose}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            <div
                className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-forest-700 to-forest-900 p-6 text-white">
                    <h2 className="text-xl font-bold">
                        {submitted ? '🎉 Request Sent!' : 'Plan Your Journey'}
                    </h2>
                    {!submitted && (
                        <p className="text-forest-200 text-sm mt-1">
                            Step {step} of 3 — {step === 1 ? 'Your Details' : step === 2 ? 'Trip Details' : 'Review & Submit'}
                        </p>
                    )}
                    {!submitted && (
                        <div className="flex gap-1.5 mt-3">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-gold-400' : 'bg-white/20'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {submitted ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8 text-forest-600" />
                            </div>
                            <h3 className="text-lg font-bold text-forest-900 mb-2">Thank You!</h3>
                            <p className="text-muted text-sm max-w-xs mx-auto">
                                Your travel inquiry has been received. Our team will craft a personalized itinerary and reach out within 24 hours.
                            </p>
                            <button
                                onClick={handleClose}
                                className="mt-6 px-8 py-2.5 rounded-xl bg-forest-600 text-white font-semibold text-sm hover:bg-forest-500 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    ) : step === 1 ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-forest-800 mb-1.5">Full Name *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => update('name', e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest-200 bg-forest-50/50 text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-forest-800 mb-1.5">Email Address *</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => update('email', e.target.value)}
                                        placeholder="john@example.com"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest-200 bg-forest-50/50 text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-forest-800 mb-1.5">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                    <input
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) => update('phone', e.target.value)}
                                        placeholder="+1 234 567 8900"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest-200 bg-forest-50/50 text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : step === 2 ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-forest-800 mb-1.5">Start Date *</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                        <input
                                            type="date"
                                            value={form.startDate}
                                            onChange={(e) => update('startDate', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest-200 bg-forest-50/50 text-foreground focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-forest-800 mb-1.5">End Date *</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                        <input
                                            type="date"
                                            value={form.endDate}
                                            onChange={(e) => update('endDate', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest-200 bg-forest-50/50 text-foreground focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-forest-800 mb-1.5">Group Size</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                    <select
                                        value={form.groupSize}
                                        onChange={(e) => update('groupSize', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest-200 bg-forest-50/50 text-foreground focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all appearance-none"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, '9+'].map((n) => (
                                            <option key={n} value={n}>
                                                {n} {n === 1 ? 'person' : 'people'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-forest-800 mb-1.5">Additional Notes</label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted" />
                                    <textarea
                                        value={form.notes}
                                        onChange={(e) => update('notes', e.target.value)}
                                        placeholder="Tell us about your interests, dietary requirements, or any special requests..."
                                        rows={3}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest-200 bg-forest-50/50 text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {/* Contact summary */}
                            <div className="p-4 rounded-xl bg-forest-50 border border-forest-100">
                                <h4 className="text-sm font-semibold text-forest-800 mb-2">Contact Details</h4>
                                <div className="space-y-1 text-sm">
                                    <p><span className="text-muted">Name:</span> <span className="font-medium">{form.name}</span></p>
                                    <p><span className="text-muted">Email:</span> <span className="font-medium">{form.email}</span></p>
                                    {form.phone && <p><span className="text-muted">Phone:</span> <span className="font-medium">{form.phone}</span></p>}
                                </div>
                            </div>
                            {/* Trip summary */}
                            <div className="p-4 rounded-xl bg-sky-50 border border-sky-100">
                                <h4 className="text-sm font-semibold text-sky-800 mb-2">Trip Details</h4>
                                <div className="space-y-1 text-sm">
                                    <p><span className="text-muted">Dates:</span> <span className="font-medium">{form.startDate} → {form.endDate}</span></p>
                                    <p><span className="text-muted">Group:</span> <span className="font-medium">{form.groupSize} {Number(form.groupSize) === 1 ? 'person' : 'people'}</span></p>
                                    {form.notes && <p><span className="text-muted">Notes:</span> <span className="font-medium">{form.notes}</span></p>}
                                </div>
                            </div>
                            {/* Selected locations */}
                            <div>
                                <h4 className="text-sm font-semibold text-forest-800 mb-2">
                                    Selected Destinations ({selectedLocations.length})
                                </h4>
                                {selectedLocations.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedLocations.map((loc) => {
                                            const c = categoryConfig[loc.category];
                                            return (
                                                <div key={loc.id} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-forest-100">
                                                    <span className="text-sm">{c.icon}</span>
                                                    <span className="text-sm font-medium text-forest-800">{loc.name}</span>
                                                    <span className="text-xs text-muted ml-auto">{c.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5" />
                                        No destinations selected yet
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer buttons */}
                {!submitted && (
                    <div className="p-4 border-t border-forest-100 flex justify-between">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-forest-800 hover:bg-forest-50 transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </button>
                        ) : (
                            <button
                                onClick={handleClose}
                                className="px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-forest-800 hover:bg-forest-50 transition-all"
                            >
                                Cancel
                            </button>
                        )}

                        {step < 3 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                disabled={step === 1 ? !canProceed1 : !canProceed2}
                                className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-forest-600 to-forest-700 text-white text-sm font-semibold shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                Next
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-forest-600 to-forest-700 text-white text-sm font-semibold shadow-lg hover:shadow-xl disabled:opacity-60 transition-all"
                            >
                                {submitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                                {submitting ? 'Sending...' : 'Submit Inquiry'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
