/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Booking } from '../types';
import { Sparkles, Trash2, CalendarHeart, Award } from 'lucide-react';

interface MyReservationsProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
}

export default function MyReservations({ bookings, onCancelBooking }: MyReservationsProps) {
  const getStreakTier = (count: number) => {
    if (count === 0) return { name: 'Grounding Seeker', bonus: '0x', desc: 'Book your first lesson to earn wellness stamps.' };
    if (count <= 2) return { name: 'Serenity Achiever', bonus: '1.2x', desc: 'Consistency looks good on you. Keep flowing!' };
    if (count <= 4) return { name: 'Lotus Practitioner', bonus: '1.5x', desc: 'You are deeply integrated into your mindful path.' };
    return { name: 'Zen Harmony Master', bonus: '2.0x', desc: 'Ultimate mind-body transcendence. You inspire us!' };
  };

  const activeTier = getStreakTier(bookings.length);
  const mindfulnessStamps = bookings.length * 15;

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-border-token/40 shadow-card space-y-6">
      {/* Account Profile context */}
      <div className="flex flex-col sm:flex-row hover:border-brand-primary/20 border border-transparent sm:items-center justify-between gap-5 bg-neutral-background p-5 rounded-2xl transition-all">
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">
            Your Sanctuary Profile
          </span>
          <h4 className="font-primary text-xl font-bold flex items-center gap-1.5 text-text-primary">
            <Award className="w-5 h-5 text-brand-primary" />
            <span>{activeTier.name}</span>
          </h4>
          <p className="text-xs text-text-secondary max-w-sm">
            {activeTier.desc}
          </p>
        </div>

        <div className="flex gap-4 sm:border-l sm:border-border-token/30 sm:pl-6 text-center select-none">
          <div className="bg-white p-3 rounded-xl border border-border-token/20 shadow-xs min-w-[80px]">
            <span className="block text-2xl font-bold font-secondary text-brand-primary">
              {bookings.length}
            </span>
            <span className="text-[9px] uppercase tracking-wider font-semibold text-text-secondary">
              Bookings
            </span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-border-token/20 shadow-xs min-w-[80px]">
            <span className="block text-2xl font-bold font-secondary text-brand-primary">
              {mindfulnessStamps}
            </span>
            <span className="text-[9px] uppercase tracking-wider font-semibold text-text-secondary">
              Zen Points
            </span>
          </div>
        </div>
      </div>

      {/* List Reservations */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
          <CalendarHeart className="w-4 h-4 text-brand-primary" />
          <span>Active Reservations</span>
        </div>

        {bookings.length > 0 ? (
          <div className="divide-y divide-border-token/25 bg-neutral-background/40 border border-border-token/30 rounded-2xl overflow-hidden shadow-xs">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                id={`booking-${booking.id}`}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/55 hover:bg-neutral-background/30 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-primary font-bold text-text-primary">
                      {booking.className}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-brand-primary bg-brand-soft border border-brand-primary/25 px-2 py-0.5 rounded-md">
                      {booking.id}
                    </span>
                  </div>
                  <div className="text-xs text-text-secondary flex flex-wrap gap-x-3 gap-y-1">
                    <span>Day: <strong className="text-text-primary capitalize">{booking.day}</strong></span>
                    <span>•</span>
                    <span>Time: <strong className="text-text-primary">{booking.time}</strong></span>
                    <span>•</span>
                    <span>Owner: <strong className="text-text-primary">{booking.name}</strong></span>
                  </div>
                </div>

                <button
                  id={`cancel-btn-${booking.id}`}
                  onClick={() => {
                    if (window.confirm(`Are you sure you would like to forfeit your reservation spot for ${booking.className}?`)) {
                      onCancelBooking(booking.id);
                    }
                  }}
                  className="self-start sm:self-center p-2.5 rounded-full hover:bg-rose-50 text-text-secondary hover:text-rose-500 transition-colors pointer-events-auto cursor-pointer"
                  title="Cancel Reservation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 border border-dashed border-border-token rounded-2xl text-center space-y-2">
            <Sparkles className="w-5 h-5 text-text-secondary/40 mx-auto" />
            <h5 className="font-primary text-sm text-text-primary font-medium">Your schedule is empty</h5>
            <p className="text-xs text-text-secondary max-w-xs mx-auto">
              Ready to invest in your physical health? Pick a guided flow from our studio options above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
