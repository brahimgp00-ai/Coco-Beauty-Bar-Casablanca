/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, User, Sparkles, CheckCircle, Smartphone } from 'lucide-react';
import { Lesson } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson | null;
  onBookSuccess: (name: string, email: string, phone: string, comments: string) => void;
}

export default function BookingModal({ isOpen, onClose, lesson, onBookSuccess }: BookingModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');

  if (!lesson) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      const generatedId = 'ANH-' + Math.floor(100000 + Math.random() * 900000);
      setTicketId(generatedId);
      setIsSubmitting(false);
      setSuccess(true);
      onBookSuccess(name, email, phone, comments);
    }, 1200);
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setComments('');
      setSuccess(false);
      setTicketId('');
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-black/45 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg bg-white rounded-3xl border border-border-token shadow-2xl p-6 md:p-8 overflow-hidden z-10"
          >
            {/* Close Button */}
            <button
              onClick={resetAndClose}
              id="close-booking-modal"
              aria-label="Close Booking Modal"
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-background text-text-secondary hover:text-text-primary transition-colors cursor-pointer pointer-events-auto"
            >
              <X className="w-5 h-5" />
            </button>

            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary uppercase tracking-widest bg-brand-soft px-3 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    <span>Booking Reservation</span>
                  </div>
                  <h3 className="font-primary text-2xl lg:text-3xl text-text-primary">
                    Book {lesson.classType}
                  </h3>
                  <p className="text-text-secondary text-xs">
                    Please provide your contact descriptors to hold your spot. Classes are kept intimate.
                  </p>
                </div>

                {/* Lesson Context Quick Peek */}
                <div className="bg-neutral-background p-4 rounded-2xl space-y-3.5 border border-border-token/20">
                  <div className="grid grid-cols-2 gap-3 text-xs text-text-secondary">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand-primary" />
                      <span className="font-medium text-text-primary">{lesson.day}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-brand-primary" />
                      <span className="font-medium text-text-primary">{lesson.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-brand-primary" />
                      <div>
                        Instructor: <span className="font-medium text-text-primary">{lesson.instructor}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-primary" />
                      <div>
                        Level: <span className="font-medium text-text-primary">{lesson.difficulty}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary italic leading-relaxed border-t border-border-token/30 pt-2">
                    "{lesson.description}"
                  </p>
                </div>

                {/* Fields */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider font-bold text-text-secondary flex justify-between">
                      <span>Full Name</span>
                      <span className="text-rose-400 font-normal">Required</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-neutral-background rounded-xl border border-border-token/40 px-4 py-3 text-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider font-bold text-text-secondary flex justify-between">
                      <span>Email Address</span>
                      <span className="text-rose-400 font-normal">Required</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full bg-neutral-background rounded-xl border border-border-token/40 px-4 py-3 text-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider font-bold text-text-secondary">
                      <span>Phone Number (Optional)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-text-secondary">
                        <Smartphone className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+44 7123 456789"
                        className="w-full bg-neutral-background rounded-xl border border-border-token/20 pl-10 pr-4 py-3 text-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider font-bold text-text-secondary">
                      <span>Health Notes or Special Requests (Optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="e.g. recovering from wrist injury, need pregnancy alignment variations"
                      className="w-full bg-neutral-background rounded-xl border border-border-token/20 px-4 py-3 text-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  id="confirm-booking-btn"
                  disabled={isSubmitting}
                  className="w-full bg-brand-primary text-white font-bold py-3.5 rounded-full shadow-lg hover:opacity-90 disabled:opacity-50 transition-all uppercase tracking-widest text-xs pointer-events-auto cursor-pointer"
                >
                  {isSubmitting ? 'Securing reservation...' : 'Confirm Reservation'}
                </button>
              </form>
            ) : (
              /* Success Stage */
              <div className="text-center py-6 space-y-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-primary text-2xl text-text-primary">Spot Reserved!</h3>
                  <p className="text-text-secondary text-sm px-4 leading-relaxed">
                    We have successfully added you to the session. A confirmation email has been dispatched to <span className="font-semibold text-text-primary text-xs">{email}</span>.
                  </p>
                </div>

                {/* Reservation Pass */}
                <div className="relative bg-dashed-border bg-emerald-50/50 p-5 rounded-2xl border-2 border-emerald-100/50 text-left space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-emerald-700 font-bold uppercase tracking-widest">Pass Code</span>
                    <span id="ticket-id" className="font-mono font-bold text-emerald-800 bg-white px-2.5 py-0.5 rounded border border-emerald-200">
                      {ticketId}
                    </span>
                  </div>

                  <div className="border-t border-emerald-200/40 pt-3 space-y-1">
                    <div className="text-xs font-semibold text-text-primary flex justify-between">
                      <span>Session:</span>
                      <span className="font-bold text-brand-primary">{lesson.classType}</span>
                    </div>
                    <div className="text-xs text-text-secondary flex justify-between">
                      <span>Day / Time:</span>
                      <span>{lesson.day}, {lesson.time}</span>
                    </div>
                    <div className="text-xs text-text-secondary flex justify-between">
                      <span>Instructor:</span>
                      <span>{lesson.instructor}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-center text-emerald-700/80 italic font-medium">
                    Please arrive 10 minutes beforehand. Mats and props are provided.
                  </div>
                </div>

                <button
                  onClick={resetAndClose}
                  id="success-dismiss-btn"
                  className="w-full bg-text-primary text-white font-bold py-3.5 rounded-full hover:opacity-90 transition-all uppercase tracking-widest text-xs pointer-events-auto cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
