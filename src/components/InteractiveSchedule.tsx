/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lesson, Difficulty } from '../types';
import { Calendar, Users, ArrowUpRight, Flame, Heart, Moon, Zap, RefreshCw } from 'lucide-react';

interface InteractiveScheduleProps {
  lessons: Lesson[];
  onSelectLesson: (lesson: Lesson) => void;
}

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export default function InteractiveSchedule({ lessons, onSelectLesson }: InteractiveScheduleProps) {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [selectedStyle, setSelectedStyle] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Filter lessons based on day, style, and level
  const filteredLessons = lessons.filter((lesson) => {
    const matchesDay = lesson.day === selectedDay;
    const matchesStyle = selectedStyle === 'All' || lesson.classType === selectedStyle;
    const matchesDiff = selectedDifficulty === 'All' || lesson.difficulty === selectedDifficulty;
    return matchesDay && matchesStyle && matchesDiff;
  });

  const getStyleIcon = (style: string) => {
    switch (style) {
      case 'Mani-Pedi Classic':
        return <Heart className="w-4 h-4 text-rose-400" />;
      case 'Blowdry Signature':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'Soin Visage Hydrafacial':
        return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'Massage Drainant':
        return <Zap className="w-4 h-4 text-amber-400" />;
      default:
        return <Calendar className="w-4 h-4 text-brand-primary" />;
    }
  };

  const getDifficultyBadge = (level: Difficulty) => {
    switch (level) {
      case 'Gentle':
        return (
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            Gentle
          </span>
        );
      case 'Moderate':
        return (
          <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
            Moderate
          </span>
        );
      case 'Challenging':
        return (
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
            Challenging
          </span>
        );
    }
  };

  const clearFilters = () => {
    setSelectedStyle('All');
    setSelectedDifficulty('All');
  };

  return (
    <div className="space-y-8">
      {/* Day Selector Ribbon */}
      <div className="flex overflow-x-auto pb-2 -mx-6 px-6 sm:mx-0 sm:px-0 gap-2 scrollbar-none snap-x pointer-events-auto">
        {DAYS_OF_WEEK.map((day) => {
          const isActive = selectedDay === day;
          return (
            <button
              key={day}
              id={`day-${day.toLowerCase()}`}
              onClick={() => setSelectedDay(day)}
              className={`flex-none snap-start px-5 mt-1 sm:px-6 py-3 rounded-full text-sm font-medium transition-all focus:outline-none cursor-pointer ${
                isActive
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'bg-white text-text-secondary border border-border-token/40 hover:border-text-secondary'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Grid Filter Options */}
      <div className="bg-white p-5 rounded-2xl border border-border-token/40 flex flex-col md:flex-row gap-5 items-stretch md:items-center justify-between text-sm">
        <div className="flex flex-wrap items-center gap-4">
          {/* Class Style Quick Filters */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-text-secondary block">
              Soin / Service
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['All', 'Mani-Pedi Classic', 'Blowdry Signature', 'Soin Visage Hydrafacial', 'Massage Drainant'].map((style) => (
                <button
                  key={style}
                  id={`style-filter-${style.replace(' ', '-').toLowerCase()}`}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold focus:outline-none transition-all cursor-pointer pointer-events-auto ${
                    selectedStyle === style
                      ? 'bg-brand-soft border-brand-primary text-brand-primary'
                      : 'bg-neutral-background border-border-token/30 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Level Filters */}
        <div className="flex flex-wrap items-end gap-3.5">
          <div className="space-y-1 w-full sm:w-auto">
            <span className="text-[10px] uppercase font-bold tracking-widest text-text-secondary block">
              Intensity
            </span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full sm:w-40 bg-neutral-background border border-border-token/40 rounded-xl px-3.5 py-1.5 text-xs text-text-primary outline-none focus:border-brand-primary cursor-pointer appearance-none pointer-events-auto"
            >
              <option value="All">All Levels</option>
              <option value="Gentle">Gentle</option>
              <option value="Moderate">Moderate</option>
              <option value="Challenging">Challenging</option>
            </select>
          </div>

          {(selectedStyle !== 'All' || selectedDifficulty !== 'All') && (
            <button
              id="clear-filters-btn"
              onClick={clearFilters}
              className="px-3.5 py-2 text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 bg-rose-50 hover:bg-rose-100/55 rounded-xl transition-all cursor-pointer pointer-events-auto"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid Lists */}
      <div id="schedule-lessons-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLessons.length > 0 ? (
          filteredLessons.map((lesson) => {
            const isFull = lesson.availableSlots === 0;
            const isCritical = lesson.availableSlots > 0 && lesson.availableSlots <= 3;

            return (
              <div
                key={lesson.id}
                id={`lesson-${lesson.id}`}
                className="group bg-white rounded-2xl border border-border-token/50 hover:border-brand-primary/20 shadow-sm p-6 hover:shadow-md transition-all flex flex-col justify-between items-stretch gap-6"
              >
                {/* Meta details */}
                <div className="space-y-3.5">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-mono text-sm leading-none font-bold text-text-primary bg-neutral-background px-3 py-1.5 rounded-lg border border-border-token/20">
                      {lesson.time}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {getDifficultyBadge(lesson.difficulty)}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-primary text-xl font-bold flex items-center gap-2">
                      <span>{getStyleIcon(lesson.classType)}</span>
                      <span className="text-text-primary">{lesson.classType}</span>
                    </h4>
                    <p className="text-xs text-text-secondary flex items-center gap-1.5">
                      <span>Guided by:</span>
                      <span className="font-semibold text-text-primary">{lesson.instructor}</span>
                    </p>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                    {lesson.description}
                  </p>
                </div>

                {/* Booking status & Actions */}
                <div className="border-t border-border-token/20 pt-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-text-secondary" />
                    <div className="text-xs text-text-secondary">
                      {isFull ? (
                        <span className="text-rose-500 font-bold">Fully Booked</span>
                      ) : (
                        <span>
                          <strong className="text-text-primary">{lesson.availableSlots}</strong> of {lesson.maxSlots} spots left
                        </span>
                      )}
                      {isCritical && !isFull && (
                        <span className="block text-[10px] text-amber-600 font-bold animate-pulse mt-0.5">
                          Only {lesson.availableSlots} left!
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    id={`book-btn-${lesson.id}`}
                    disabled={isFull}
                    onClick={() => onSelectLesson(lesson)}
                    className={`px-4.5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer pointer-events-auto ${
                      isFull
                        ? 'bg-neutral-background text-text-secondary border border-border-token/40 cursor-not-allowed'
                        : 'bg-brand-primary text-white hover:opacity-95 shadow-xs'
                    }`}
                  >
                    <span>{isFull ? 'Sold Out' : 'Book Session'}</span>
                    {!isFull && <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-1 md:col-span-2 bg-white/70 backdrop-blur-xs p-16 rounded-2xl border border-dashed border-border-token text-center space-y-3">
            <Calendar className="w-8 h-8 text-text-secondary/50 mx-auto" />
            <h4 className="font-primary text-lg text-text-primary">No sessions scheduled</h4>
            <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
              We don't have any classes matching these exact filters for <span className="font-semibold">{selectedDay}</span>. Try adjusting your preferences.
            </p>
            <button
              id="empty-clear-btn"
              onClick={clearFilters}
              className="text-xs text-brand-primary font-bold border-b border-brand-primary cursor-pointer pointer-events-auto"
            >
              Clear Preferences
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
