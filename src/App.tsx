/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Users,
  Compass,
  Heart,
  Moon,
  Zap,
  Flame,
  UserCheck,
  MapPin,
  Clock,
  Phone,
  Mail,
  Send,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  User,
  ShoppingBag,
  Info,
  CheckCircle
} from 'lucide-react';

import { Lesson, Booking } from './types';
import { INITIAL_LESSONS, SPACE_IMAGES } from './data';
import BreathingCoach from './components/BreathingCoach';
import InteractiveSchedule from './components/InteractiveSchedule';
import BookingModal from './components/BookingModal';
import MyReservations from './components/MyReservations';
import GalleryCarousel from './components/GalleryCarousel';

export default function App() {
  // Sync state with local storage
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem('anahata_lessons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_LESSONS;
      }
    }
    return INITIAL_LESSONS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('anahata_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Selected lesson for active booking
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Active FAQ index (0 by default)
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Floating Reservations Dashboard Toggle
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);

  // Mobile navigation drawer toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Header shrinking state on scroll
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // General contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactInterest, setContactInterest] = useState('Hatha Flow');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // Toast confirmation alerts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Monitor scrolling to shrink header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Persist lessons & bookings to localStorage
  useEffect(() => {
    localStorage.setItem('anahata_lessons', JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem('anahata_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Handle successful reservation creation
  const handleBookingSuccess = (name: string, email: string, phone: string, comments: string) => {
    if (!selectedLesson) return;

    const newBooking: Booking = {
      id: 'ANH-' + Math.floor(100000 + Math.random() * 900000),
      lessonId: selectedLesson.id,
      className: selectedLesson.classType,
      day: selectedLesson.day,
      time: selectedLesson.time,
      name,
      email,
      phone,
      message: comments,
      timestamp: Date.now()
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Decrement available slots in lessons State
    setLessons((prevLessons) =>
      prevLessons.map((l) => {
        if (l.id === selectedLesson.id) {
          return { ...l, availableSlots: Math.max(0, l.availableSlots - 1) };
        }
        return l;
      })
    );

    triggerToast(`Spot successfully locked for ${selectedLesson.classType}!`);
  };

  // Handle cancelling reservation spot
  const handleCancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    // Filter out booking
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));

    // Increment available spots on matching lesson
    setLessons((prevLessons) =>
      prevLessons.map((l) => {
        if (l.id === booking.lessonId) {
          return { ...l, availableSlots: Math.min(l.maxSlots, l.availableSlots + 1) };
        }
        return l;
      })
    );

    triggerToast(`Forfeited spot for ${booking.className}. Slot is now open.`);
  };

  // Form submit helper (Contact card)
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    setTimeout(() => {
      setContactSubmitting(false);
      setContactSuccess(true);
      triggerToast("Enquiry dispatched to Elena! We'll reply within 24 hours.");
      setTimeout(() => {
        setContactName('');
        setContactEmail('');
        setContactMessage('');
        setContactSuccess(false);
      }, 5000);
    }, 1500);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Preset selectors for quick booking scrolls
  const handlePresetSelect = (classTypeName: string) => {
    // Scroll down to the Schedule
    const schedSec = document.getElementById('classes');
    if (schedSec) {
      schedSec.scrollIntoView({ behavior: 'smooth' });
    }
    // Filter to that class is managed if we wanted to inside scheduling, but showing the schedule is brilliant.
    triggerToast(`Filtering classes by ${classTypeName}. Choose your day below!`);
  };

  return (
    <div className="font-secondary bg-neutral-background min-h-screen flex flex-col w-full relative overflow-x-hidden pt-24">
      {/* Dynamic alert toaster */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-text-primary text-white text-xs px-6 py-3.5 rounded-full shadow-2xl border border-white/10 flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-brand-primary animate-ping" />
            <span className="font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bookings Sanctuary Command Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          id="bookings-fab"
          onClick={() => setIsDashboardOpen(true)}
          className="relative bg-brand-primary hover:bg-rose-400 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 group transition-all duration-300 pointer-events-auto cursor-pointer"
        >
          <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out text-xs font-bold uppercase tracking-wider block whitespace-nowrap">
            My Sanctuary ({bookings.length})
          </span>
          {bookings.length > 0 && (
            <span id="bookings-indicator" className="absolute -top-1 -right-1 bg-text-primary w-5.5 h-5.5 text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              {bookings.length}
            </span>
          )}
        </button>
      </div>

      {/* Top Header Navigation */}
      <header className="fixed top-4 left-0 right-0 z-40 flex justify-center px-4 transition-all duration-500">
        <nav className="bg-white/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-border-token/20 shadow-lg flex items-center gap-6 max-w-max pointer-events-auto">
          {/* Mobile logo view / mini-brand */}
          <a href="#" className="flex lg:hidden items-center gap-2 group">
            <div className="w-[18px] h-[18px] bg-brand-primary rounded-sm transition-transform group-hover:rotate-12" />
            <span className="font-primary font-bold text-sm [letter-spacing:-0.03em] text-text-primary">Coco Beauty Bar</span>
          </a>

          {/* Desktop Centered Compact Pill Links (No logo on desktop for perfect balance) */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="#services" className="text-xs uppercase tracking-wider font-bold text-text-secondary hover:text-brand-primary transition-colors">Services</a>
            <a href="#gallery" className="text-xs uppercase tracking-wider font-bold text-text-secondary hover:text-brand-primary transition-colors">Gallery</a>
            <a href="#testimonials" className="text-xs uppercase tracking-wider font-bold text-text-secondary hover:text-brand-primary transition-colors">Reviews</a>
            <a href="#services" className="text-xs uppercase tracking-wider font-bold text-brand-primary hover:text-rose-400 transition-colors">Book Now</a>
          </div>

          <div className="flex items-center gap-2 lg:gap-0">
            {/* Mobile Toggle burger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-nav-toggle"
              aria-label="Toggle Mobile Navigation"
              className="lg:hidden p-1.5 text-text-secondary hover:text-text-primary transition-colors cursor-pointer pointer-events-auto"
            >
              <Users className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white p-8 flex flex-col justify-between"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <span className="font-primary font-bold text-lg text-text-primary">Coco Beauty Bar</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close Mobile Nav"
                    className="p-2 text-text-secondary hover:text-text-primary pointer-events-auto cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col gap-6 text-sm font-semibold text-text-secondary">
                  <a
                    href="#services"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-brand-primary transition-colors py-1"
                  >
                    Services & Reservations
                  </a>
                  <a
                    href="#about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-brand-primary transition-colors py-1"
                  >
                    Sofia (Our Expert)
                  </a>
                  <a
                    href="#breathing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-brand-primary transition-colors py-1"
                  >
                    Senses Relaxation Ritual
                  </a>
                  <a
                    href="#gallery"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-brand-primary transition-colors py-1"
                  >
                    The Beauty Bar Tour
                  </a>
                  <a
                    href="#testimonials"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-brand-primary transition-colors py-1"
                  >
                    Reviews & Feedback
                  </a>
                  <a
                    href="#faq"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-brand-primary transition-colors py-1"
                  >
                    Frequently Asked Questions
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsDashboardOpen(true);
                  }}
                  className="w-full bg-neutral-background text-text-primary font-bold py-3.5 rounded-full hover:bg-neutral-background/70 border border-border-token text-xs uppercase tracking-wider block"
                >
                  My Cabin Wallet ({bookings.length})
                </button>
                <a
                  href="#services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-brand-primary text-white text-center font-bold py-3.5 rounded-full hover:bg-neutral-background/70 text-xs uppercase tracking-wider block"
                >
                  Book Treatment Now
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Reservations Drawer Slider Panel */}
      <AnimatePresence>
        {isDashboardOpen && (
          <div className="fixed inset-0 z-50">
            {/* Dim Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDashboardOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-[500px] bg-neutral-background shadow-2xl p-6 md:p-8 overflow-y-auto flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-border-token/20 pb-4">
                  <div className="space-y-1">
                    <h3 className="font-primary text-xl font-bold text-text-primary">My Coco Cabin Wallet</h3>
                    <p className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">
                      Your active treatments & reservations
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDashboardOpen(false)}
                    id="close-cabin"
                    aria-label="Close Cabin Panel"
                    className="p-2 hover:bg-white border border-border-token/15 text-text-secondary hover:text-text-primary rounded-full transition-all cursor-pointer pointer-events-auto"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <MyReservations bookings={bookings} onCancelBooking={handleCancelBooking} />
              </div>

              <div className="pt-6 border-t border-border-token/20 text-center space-y-3">
                <p className="text-[10px] text-text-secondary leading-relaxed">
                  Need assistance with group bookings or custom treatments? Standard open hours are daily until 20:00.
                </p>
                <a
                  href="#contact"
                  onClick={() => setIsDashboardOpen(false)}
                  className="inline-block text-xs text-brand-primary font-bold border-b border-brand-primary/40 hover:border-brand-primary pb-0.5"
                >
                  Contact Sofia directly
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative w-full h-[88vh] min-h-[640px] flex items-center justify-center px-4 lg:px-8 mt-2 lg:mt-4">
          <div className="relative w-full h-full max-w-6xl rounded-3xl overflow-hidden flex items-center justify-center">
            {/* Ambient Image Backdrop with soft tint overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-100 hover:scale-105"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80')" }}
            >
              <div className="absolute inset-0 bg-black/15" />
            </div>

            <div className="relative z-10 text-center max-w-2xl px-6 space-y-8 select-none">
              <h1 className="font-primary text-white text-4xl sm:text-6xl lg:text-[70px] leading-[1.1] mb-4 [letter-spacing:-0.03em] drop-shadow-sm font-bold">
                Elegance, style, & <br /> ultimate self-care.
              </h1>
              <p className="font-secondary text-white/90 text-sm sm:text-base lg:text-lg max-w-lg mx-auto leading-relaxed">
                Indulge in an exquisite beauty experience at Coco Beauty Bar Casablanca. From signature blowdries and flawless manicures to hydrating facials, we empower your natural elegance.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center items-center pointer-events-auto">
                <a
                  href="#services"
                  className="bg-brand-primary text-white font-bold px-8 py-3.5 rounded-full border border-white/20 hover:bg-rose-400 transition-all text-xs uppercase tracking-wider block shadow-2xl"
                >
                  Book Salon Treatment
                </a>
                <a
                  href="#breathing"
                  className="bg-white/10 backdrop-blur-md text-white font-bold px-8 py-3.5 rounded-full border border-white/30 hover:bg-white/20 transition-all text-xs uppercase tracking-wider block"
                >
                  Relaxing Senses Air
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* INTRODUCTION SECTION WITH DECK-OF-CARDS ANIMATION */}
        <section id="introduction" className="py-24 max-w-6xl mx-auto px-6 text-center">
          <div className="flex flex-col items-center gap-12">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-token text-[10px] font-bold text-text-secondary uppercase tracking-widest bg-white">
                Introduction
              </div>
              <h2 className="font-primary text-4xl lg:text-[45px] font-bold text-text-primary tracking-tight leading-tight">
                A luxurious haven for premium beauty, coiffure & nails
              </h2>
              <p className="text-text-secondary text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                We provide bespoke beauty services and specialized coiffure artistry in Casablanca to cultivate your natural charisma, grace, and physical elegance under guidance you can trust.
              </p>
            </div>

            {/* Tilted deck cards interactive widget */}
            <div className="relative w-full h-[360px] md:h-[420px] flex justify-center items-center py-6">
              {/* Left card */}
              <motion.div
                initial={{ transform: 'translateX(-40px) rotate(0deg)', opacity: 0.8 }}
                whileInView={{ transform: 'translateX(-220px) translateY(20px) rotate(-8deg)', opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.1 }}
                whileHover={{ scale: 1.05, zIndex: 30, rotate: -4 }}
                className="absolute w-36 h-52 md:w-44 md:h-64 rounded-2xl overflow-hidden shadow-xl z-10 border-2 border-white cursor-grab hidden sm:block"
                style={{ originX: 0.5, originY: 0.5 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1604654894610-df4906b197ae?auto=format&fit=crop&w=400&h=600&q=80"
                  alt="Nail art and premium manicures"
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Right card */}
              <motion.div
                initial={{ transform: 'translateX(40px) rotate(0deg)', opacity: 0.8 }}
                whileInView={{ transform: 'translateX(220px) translateY(20px) rotate(8deg)', opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.2 }}
                whileHover={{ scale: 1.05, zIndex: 30, rotate: 4 }}
                className="absolute w-36 h-52 md:w-44 md:h-64 rounded-2xl overflow-hidden shadow-xl z-10 border-2 border-white cursor-grab hidden sm:block"
                style={{ originX: 0.5, originY: 0.5 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=400&h=600&q=80"
                  alt="Professional blowout at salon"
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Center card */}
              <motion.div
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                whileInView={{ scale: 1.0, y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', damping: 22, stiffness: 120 }}
                whileHover={{ scale: 1.04 }}
                className="relative w-52 h-72 md:w-64 md:h-88 rounded-2xl overflow-hidden shadow-2xl z-20 border-4 border-white cursor-grab"
              >
                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&h=800&q=80"
                  alt="Elegant beauty client"
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>

            {/* Static support benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 w-full pt-6 text-left">
              <div className="space-y-3 p-2 border-l-2 border-brand-primary pl-5">
                <h3 className="font-semibold text-lg text-text-primary">Bespoke Beauty Styling</h3>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Customized coiffure volumes and nail colors designed to harmonize beautifully with your unique look and personal aesthetic style.
                </p>
              </div>
              <div className="space-y-3 p-2 border-l-2 border-brand-primary pl-5">
                <h3 className="font-semibold text-lg text-text-primary">Expert Care Materials</h3>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Utilizing elite, professional beauty formulas and dermatologically approved nail lacquers to preserve hair luster and biological skin moisture.
                </p>
              </div>
              <div className="space-y-3 p-2 border-l-2 border-brand-primary pl-5">
                <h3 className="font-semibold text-lg text-text-primary">Intimate Lounge Atmosphere</h3>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Indulge in Casablanca's finest relaxing salon comfort, complete with organic Moroccan argan oil treatments and warming herbal teas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CLASSES & MAIN SCHEDULE SECTION */}
        <section id="services" className="py-24 bg-white rounded-[32px] mx-4 lg:mx-8 shadow-xs">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-14 space-y-4">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-token text-[10px] font-bold text-text-secondary uppercase tracking-widest bg-neutral-background">
                Weekly Treatments & Booking
              </div>
              <h2 className="font-primary text-4xl lg:text-[45px] font-bold text-text-primary tracking-tight leading-tight">
                Discover the right beauty treatment for you
              </h2>
              <p className="text-text-secondary text-sm sm:text-base max-w-xl">
                Select any of our customized blowdries, nail restorations, skincare facials, and lymphatic drainages. Book your cabin slot online to ensure personal priority.
              </p>
            </div>

            <InteractiveSchedule lessons={lessons} onSelectLesson={(l) => setSelectedLesson(l)} />
          </div>
        </section>

        {/* MINDFULNESS / DYNAMIC AURA BREATHING SECTION */}
        <section id="breathing" className="py-24 max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-token text-[10px] font-bold text-text-secondary uppercase tracking-widest bg-white">
              Senses & Relaxation Ritual
            </div>
            <h2 className="font-primary text-4xl lg:text-[45px] font-bold tracking-tight text-text-primary leading-tight">
              Calm the mind, before the treatment
            </h2>
            <p className="text-text-secondary text-sm sm:text-base max-w-md mx-auto">
              Our interactive breath pacing tool targets muscle relaxation and heartbeat cohesion. Sync your breathing to maximize relaxation before your coiffure or massage.
            </p>
          </div>

          <BreathingCoach />
        </section>

        {/* GALLERIES / SPACE TOUR SECTION */}
        <section id="gallery" className="py-24 bg-white rounded-[32px] mx-4 lg:mx-8 shadow-xs overflow-hidden">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-14 space-y-4">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-token text-[10px] font-bold text-text-secondary uppercase tracking-widest bg-neutral-background">
                Inside Coco Beauty Bar
              </div>
              <h2 className="font-primary text-4xl lg:text-[45px] font-bold text-text-primary tracking-tight leading-tight">
                A sanctuary designed for beauty & peace
              </h2>
              <p className="text-text-secondary text-sm sm:text-base max-w-xl">
                Take a quick visual journey through our sensory-optimized design. Soft orange blossom scent mists, premium styling chairs, and traditional Moroccan refreshments.
              </p>
            </div>

            <GalleryCarousel images={SPACE_IMAGES} />
          </div>
        </section>

        {/* YOUR GUIDE SECTION (SOFIA PROFILE) */}
        <section id="about" className="py-24 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white">
            <img
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&h=1000&fit=crop&q=80"
              alt="Sofia - Coco Beauty Bar Casablanca Founder"
              className="w-full h-full object-cover select-none"
              referrerPolicy="no-referrer"
            />
            {/* Minimal tag */}
            <div className="absolute bottom-5 left-5 bg-white/70 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-2 border border-white/10 shadow-lg text-xs font-semibold text-text-primary font-secondary">
              <UserCheck className="w-4 h-4 text-brand-primary" />
              <span>Co-Founder & Master Stylist</span>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-token text-[10px] font-bold text-text-secondary uppercase tracking-widest bg-white">
                Our Founder
              </div>
              <h2 className="font-primary text-4.5xl lg:text-[45px] font-bold leading-tight text-text-primary tracking-tight">
                I'm Sofia, dedicated to your style & radiance
              </h2>
              <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                With over a decade of high-end coiffure experience and advanced skincare coaching, I opened Coco Beauty Bar Casablanca. My aim is to establish a premium, cozy cocoon where women in Casablanca can unlock their ultimate glow and relax peacefully.
              </p>
            </div>

            <div className="space-y-4 border-t border-border-token/20 pt-6">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-brand-primary" />
                <p className="text-xs font-semibold text-text-primary">State-certified cosmetologists & hair design engineers</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-brand-primary" />
                <p className="text-xs font-semibold text-text-primary">Signature premium organic Moroccan argan oil treatments</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-brand-primary" />
                <p className="text-xs font-semibold text-text-primary">Located en face de la clinique BADR in Casablanca</p>
              </div>
            </div>

            <div className="pt-2 pointer-events-auto">
              <a
                href="#services"
                className="inline-block bg-brand-primary hover:bg-rose-400 text-white font-bold px-8 py-3.5 rounded-full hover:opacity-95 shadow-lg text-xs uppercase tracking-wider transition-all"
              >
                Book with Sofia
              </a>
            </div>
          </div>
        </section>

        {/* VOICE / REVIEWS REVIEWS SECTION */}
        <section id="testimonials" className="py-24 bg-brand-soft/30 rounded-[32px] mx-4 lg:mx-8">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-14">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-token text-[10px] font-bold text-text-secondary uppercase tracking-widest bg-white">
                  Reviews
                </div>
                <h2 className="font-primary text-4xl lg:text-[45px] font-bold text-text-primary tracking-tight leading-tight">
                  Voices of our community
                </h2>
                <p className="text-text-secondary text-sm sm:text-base">
                  Bespoke opinions from clients who have integrated our Casablanca salon into their lifestyle.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
              {/* Review 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-border-token/20 flex flex-col justify-between h-[340px]">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80"
                      alt="Keltoum Alami profile"
                      className="w-10 h-10 rounded-full object-cover border"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-text-primary font-secondary">Keltoum Alami</h4>
                      <p className="text-[10px] text-text-secondary">Casablanca Resident</p>
                    </div>
                  </div>
                  <p className="text-text-secondary italic leading-relaxed text-xs">
                    "The blowdry and nail grooming at Coco are absolutely elite. Sofia and her team understand hair texture perfectly and the salon atmosphere is incredibly relaxing."
                  </p>
                </div>
                <div className="font-accent text-2xl text-brand-primary">Keltoum Alami</div>
              </div>

              {/* Review 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-border-token/20 flex flex-col justify-between h-[340px]">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                      alt="Zineb Benjelloun profile"
                      className="w-10 h-10 rounded-full object-cover border"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-text-primary font-secondary">Zineb Benjelloun</h4>
                      <p className="text-[10px] text-text-secondary">Beauty Blogger</p>
                    </div>
                  </div>
                  <p className="text-text-secondary italic leading-relaxed text-xs">
                    "Best Hydrafacial in Casablanca! The cabin room is highly hygienic and peaceful. My skin always walks out glowing and radiant. Coco is 4.7 stars for a reason!"
                  </p>
                </div>
                <div className="font-accent text-2xl text-brand-primary">Zineb Benjelloun</div>
              </div>

              {/* Review 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-border-token/20 flex flex-col justify-between h-[340px]">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=100&h=100&q=80"
                      alt="Camila Dupont profile"
                      className="w-10 h-10 rounded-full object-cover border"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-text-primary font-secondary">Camila Dupont</h4>
                      <p className="text-[10px] text-text-secondary">Casablanca Expat</p>
                    </div>
                  </div>
                  <p className="text-text-secondary italic leading-relaxed text-xs">
                    "I've tried many luxury slots in Maroc, but the hospitality and precision at Coco Beauty Bar are unmatched. Conveniently located en face de la clinique BADR."
                  </p>
                </div>
                <div className="font-accent text-2xl text-brand-primary">Camila Dupont</div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING & MEMBERSHIPS SECTION */}
        <section className="py-24 max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-token text-[10px] font-bold text-text-secondary uppercase tracking-widest bg-white">
              Salon Offers
            </div>
            <h2 className="font-primary text-4xl lg:text-[45px] font-bold tracking-tight text-text-primary">
              Exclusive Packages for Your Beauty
            </h2>
            <p className="text-text-secondary text-sm sm:text-base max-w-md mx-auto">
              Premium selections for blowdries, manicures, and complete facial styling. Special Casablanca rates with tax included.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Tier 1 */}
            <div className="bg-white p-8 rounded-2xl border border-border-token/40 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-6">
                <h4 className="text-xs uppercase tracking-wider font-bold text-text-secondary">
                  Mani-Pedi Classic
                </h4>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold font-secondary text-text-primary">350 DH</span>
                  <span className="text-text-secondary text-xs">/session</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Ideal for standard nail shaping, luxury hydration creams and classic coat modeling.
                </p>
                <ul className="space-y-3 pt-2 text-xs text-text-secondary">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                    <span>Classic manicure and pedicure session</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                    <span>Gentle gommage with organic Moroccan salts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                    <span>Fragrant tea service in our peaceful lounge</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8 pointer-events-auto">
                <button
                  id="pricing-tier-1"
                  onClick={() => handlePresetSelect('Mani-Pedi Classic')}
                  className="w-full text-center py-3 rounded-full border border-brand-primary text-brand-primary text-xs font-bold uppercase tracking-wider hover:bg-brand-primary hover:text-white transition-all cursor-pointer"
                >
                  Book Classic Mani-Pedi
                </button>
              </div>
            </div>

            {/* Tier 2 */}
            <div className="bg-white p-8 rounded-2xl border-2 border-brand-primary shadow-xl flex flex-col justify-between relative md:scale-105 z-10">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-brand-primary text-white text-[9px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-white">
                Most popular choice
              </div>
              <div className="space-y-6">
                <h4 className="text-xs uppercase tracking-wider font-bold text-brand-primary">
                  Signature Blowdry & Mani
                </h4>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold font-secondary text-text-primary">600 DH</span>
                  <span className="text-text-secondary text-xs">/session</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Our celebrated compléto. Personalized hair diagnosis, rinse, signature blowout and classic manicure.
                </p>
                <ul className="space-y-3 pt-2 text-xs text-text-secondary">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                    <span>Signature blowout & customized hair volume lift</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                    <span>Premium organic Moroccan argan oil wash</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                    <span>Long-lasting professional nail lacquer application</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                    <span>10% off custom facial treatment bookings</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8 pointer-events-auto">
                <button
                  id="pricing-tier-2"
                  onClick={() => handlePresetSelect('Blowdry Signature')}
                  className="w-full text-center py-3 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-rose-400 transition-all shadow-md cursor-pointer"
                >
                  Book Blowdry Signature
                </button>
              </div>
            </div>

            {/* Tier 3 */}
            <div className="bg-white p-8 rounded-2xl border border-border-token/40 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-6">
                <h4 className="text-xs uppercase tracking-wider font-bold text-text-secondary">
                  Royal Day Cocoon
                </h4>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold font-secondary text-text-primary">1,200 DH</span>
                  <span className="text-text-secondary text-xs">/session</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  The ultimate luxury self-care sequence. Complete coiffure, full nails, and revitalizing facial soin.
                </p>
                <ul className="space-y-3 pt-2 text-xs text-text-secondary">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                    <span>Royal blowout, customized waves or volume lift</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                    <span>Soin Visage Hydrafacial & customized skin lifting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                    <span>Priority cabin VIP slot booking with Sofia</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8 pointer-events-auto">
                <button
                  id="pricing-tier-3"
                  onClick={() => handlePresetSelect('Royal Day Cocoon')}
                  className="w-full text-center py-3 rounded-full border border-brand-primary text-brand-primary text-xs font-bold uppercase tracking-wider hover:bg-brand-primary hover:text-white transition-all cursor-pointer"
                >
                  Book Royal Cocoon Day
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION SECTION */}
        <section id="faq" className="py-24 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="space-y-5">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-token text-[10px] font-bold text-text-secondary uppercase tracking-widest bg-white">
              Questions & Answers
            </div>
            <h2 className="font-primary text-4xl font-bold tracking-tight text-text-primary leading-tight">
              General FAQ
            </h2>
            <p className="text-text-secondary text-sm sm:text-base max-w-sm">
              Answers and guides to prepare for your premium booking at Coco Beauty Bar Casablanca.
            </p>
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3 text-xs text-amber-800 leading-relaxed max-w-sm">
              <Info className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <strong className="block font-semibold mb-0.5">Salon Booking Reminder</strong>
                Treatments begin exactly on schedule to respect other salon bookings. Please arrive 10 minutes prior to enjoy a warm glass of Moroccan mint tea.
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* FAQ Item 1 */}
            <div className="bg-white rounded-2xl border border-border-token/40 overflow-hidden shadow-xs">
              <button
                onClick={() => setActiveFaq(activeFaq === 0 ? null : 0)}
                id="faq-header-0"
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:ring-1 focus:ring-brand-primary transition-colors cursor-pointer pointer-events-auto"
              >
                <span className="font-medium text-sm text-text-primary">Do I need to book in advance?</span>
                {activeFaq === 0 ? <ChevronUp className="w-4 h-4 text-text-secondary" /> : <ChevronDown className="w-4 h-4 text-text-secondary" />}
              </button>
              <AnimatePresence initial={false}>
                {activeFaq === 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-5 text-xs text-text-secondary leading-relaxed border-t border-border-token/10 pt-3">
                      To ensure a fully personalized experience and access to your favorite cabin services, we highly recommend booking 24 hours in advance. Walk-ins are accepted based on master stylist availability.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-white rounded-2xl border border-border-token/40 overflow-hidden shadow-xs">
              <button
                onClick={() => setActiveFaq(activeFaq === 1 ? null : 1)}
                id="faq-header-1"
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:ring-1 focus:ring-brand-primary transition-colors cursor-pointer pointer-events-auto"
              >
                <span className="font-medium text-sm text-text-primary">What products do you use for coiffure & nails?</span>
                {activeFaq === 1 ? <ChevronUp className="w-4 h-4 text-text-secondary" /> : <ChevronDown className="w-4 h-4 text-text-secondary" />}
              </button>
              <AnimatePresence initial={false}>
                {activeFaq === 1 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-5 text-xs text-text-secondary leading-relaxed border-t border-border-token/10 pt-3">
                      We use only professional-grade, dermatologically approved formulas. Our hair rituals feature organic Moroccan argan oil washes, premium diagnostics, and safe, lasting nail lacquers.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-white rounded-2xl border border-border-token/40 overflow-hidden shadow-xs">
              <button
                onClick={() => setActiveFaq(activeFaq === 2 ? null : 2)}
                id="faq-header-2"
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:ring-1 focus:ring-brand-primary transition-colors cursor-pointer pointer-events-auto"
              >
                <span className="font-medium text-sm text-text-primary">Where is the salon located in Casablanca?</span>
                {activeFaq === 2 ? <ChevronUp className="w-4 h-4 text-text-secondary" /> : <ChevronDown className="w-4 h-4 text-text-secondary" />}
              </button>
              <AnimatePresence initial={false}>
                {activeFaq === 2 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-5 text-xs text-text-secondary leading-relaxed border-t border-border-token/10 pt-3">
                      We are situated right in the heart of Casablanca, conveniently en face de la clinique BADR (26 Rue de l' Imam El Aloussi, Casablanca 20000).
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-white rounded-2xl border border-border-token/40 overflow-hidden shadow-xs">
              <button
                onClick={() => setActiveFaq(activeFaq === 3 ? null : 3)}
                id="faq-header-3"
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:ring-1 focus:ring-brand-primary transition-colors cursor-pointer pointer-events-auto"
              >
                <span className="font-medium text-sm text-text-primary">Can I reschedule or cancel my treatment?</span>
                {activeFaq === 3 ? <ChevronUp className="w-4 h-4 text-text-secondary" /> : <ChevronDown className="w-4 h-4 text-text-secondary" />}
              </button>
              <AnimatePresence initial={false}>
                {activeFaq === 3 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-5 text-xs text-text-secondary leading-relaxed border-t border-border-token/10 pt-3">
                      Yes! Respecting other clients' scheduling is key. You can instantly cancel or reschedule your reserved treatment up to 2 hours before the start of the appointment using your Coco Cabin Wallet panel on this website.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* CONTACT & DIRECT ENQUIRY SECTION */}
        <section id="contact" className="py-24 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          <div className="flex flex-col justify-between space-y-12">
            <div className="space-y-5">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-border-token text-[10px] font-bold text-text-secondary uppercase tracking-widest bg-white">
                Contact Us
              </div>
              <h2 className="font-primary text-4xl lg:text-[45px] font-bold tracking-tight text-text-primary leading-tight">
                Let's discuss your beauty
              </h2>
              <p className="text-text-secondary text-sm sm:text-base max-w-sm">
                Have specific beauty goals, hair textures, or skin inquiries? Reach out to Sofia directly.
              </p>
            </div>

            {/* Direct coordinate tags */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="p-3.5 bg-white border border-border-token/15 rounded-full text-brand-primary">
                  <Mail className="w-5 h-5" />
                </span>
                <div>
                  <h5 className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">
                    Email our salon
                  </h5>
                  <p className="text-sm font-semibold text-text-primary">contact@cocobeautybarcasablanca.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="p-3.5 bg-white border border-border-token/15 rounded-full text-brand-primary">
                  <Phone className="w-5 h-5" />
                </span>
                <div>
                  <h5 className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">
                    Call the reception
                  </h5>
                  <p className="text-sm font-semibold text-text-primary">+212 5 22 20 89 51</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="p-3.5 bg-white border border-border-token/15 rounded-full text-brand-primary">
                  <MapPin className="w-5 h-5" />
                </span>
                <div>
                  <h5 className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">
                    Boutique Coordinates
                  </h5>
                  <p className="text-sm font-semibold text-text-primary">en face de la clinique BADR, 26 Rue de l' Imam El Aloussi, Casablanca 20000</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl border border-border-token/40 shadow-xl flex flex-col justify-center">
            {contactSuccess ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-14 h-14 bg-brand-soft text-brand-primary rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-primary text-xl font-bold text-text-primary">Message Dispatched!</h4>
                <p className="text-xs text-text-secondary px-6 leading-relaxed">
                  We have lodged your enquiry. Sofia or one of our master designers will review your details and write back.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-bold text-text-secondary block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-neutral-background border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-bold text-text-secondary block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full bg-neutral-background border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-brand-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-bold text-text-secondary block">
                    Service Interest
                  </label>
                  <select
                    value={contactInterest}
                    onChange={(e) => setContactInterest(e.target.value)}
                    className="w-full bg-neutral-background border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-brand-primary outline-none transition-all appearance-none cursor-pointer flex justify-between pointer-events-auto"
                  >
                    <option>Mani-Pedi Classic</option>
                    <option>Blowdry Signature</option>
                    <option>Facial Soin Hydrafacial</option>
                    <option>Royal Day Cocoon</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-bold text-text-secondary block">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe your beauty goals, hair or skin preferences, or special cabin requests..."
                    className="w-full bg-neutral-background border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-brand-primary outline-none transition-all resize-none font-secondary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={contactSubmitting}
                  className="w-full bg-brand-primary text-white font-bold py-3.5 rounded-full hover:bg-rose-400 disabled:opacity-50 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 cursor-pointer pointer-events-auto"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{contactSubmitting ? 'Dispatching...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white py-16 border-t border-border-token/40 mt-16 text-sm">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Col 1 */}
          <div className="space-y-5">
            <a href="#" className="flex items-center gap-2.5">
              <div className="w-[18px] h-[18px] bg-brand-primary rounded-sm" />
              <span className="font-primary font-bold text-lg text-text-primary">Coco Beauty Bar</span>
            </a>
            <p className="text-text-secondary text-xs leading-relaxed max-w-xs">
              A premium beauty salon and spa sanctuary in Casablanca designed to illuminate your self-confidence, coiffure lustre, and somatic relaxation.
            </p>
            <div className="text-[10px] text-text-secondary/80">
              Created with love for Casablanca's exquisite community.
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-5">
            <h4 className="font-bold text-text-primary text-xs uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-3.5 text-xs text-text-secondary">
              <li><a href="#services" className="hover:text-brand-primary transition-colors">Our Services</a></li>
              <li><a href="#about" className="hover:text-brand-primary transition-colors">Our Founders</a></li>
              <li><a href="#breathing" className="hover:text-brand-primary transition-colors">Relaxation Ritual</a></li>
              <li><a href="#gallery" className="hover:text-brand-primary transition-colors">The Salon Tour</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-5">
            <h4 className="font-bold text-text-primary text-xs uppercase tracking-wider">Support</h4>
            <ul className="space-y-3.5 text-xs text-text-secondary">
              <li><a href="#services" className="hover:text-brand-primary transition-colors">Exclusive Packages</a></li>
              <li><a href="#faq" className="hover:text-brand-primary transition-colors">General FAQ</a></li>
              <li><a href="#contact" className="hover:text-brand-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-5">
            <h4 className="font-bold text-text-primary text-xs uppercase tracking-wider">Connect</h4>
            <ul className="space-y-3.5 text-xs text-text-secondary">
              <li><a href="#" className="hover:text-brand-primary transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Pinterest boards</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 mt-16 pt-8 border-t border-border-token text-center text-xs text-text-secondary">
          © {new Date().getFullYear()} Coco Beauty Bar Casablanca. All rights reserved. en face de la clinique BADR, 26 Rue de l' Imam El Aloussi, Casablanca.
        </div>
      </footer>

      {/* Main Reservation Component */}
      <BookingModal
        isOpen={selectedLesson !== null}
        onClose={() => setSelectedLesson(null)}
        lesson={selectedLesson}
        onBookSuccess={handleBookingSuccess}
      />
    </div>
  );
}
