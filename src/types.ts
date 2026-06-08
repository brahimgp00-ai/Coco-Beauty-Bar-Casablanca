/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Difficulty = 'Gentle' | 'Moderate' | 'Challenging';

export interface Lesson {
  id: string;
  day: string; // 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  time: string; // e.g. '08:30 - 09:45'
  classType: string; // e.g. 'Hatha Flow', 'Vinyasa Energy', 'Restorative Yin', 'Power Ashtanga'
  instructor: string; // e.g. 'Elena', 'Amara', 'Rohan'
  maxSlots: number;
  availableSlots: number;
  difficulty: Difficulty;
  description: string;
}

export interface Booking {
  id: string;
  lessonId: string;
  className: string;
  day: string;
  time: string;
  name: string;
  email: string;
  phone?: string;
  interest?: string;
  message?: string;
  timestamp: number;
}

export interface BreathSetting {
  id: string;
  name: string;
  description: string;
  inhale: number; // in seconds
  holdIn: number;
  exhale: number;
  holdOut: number;
}

export interface SpaceImage {
  id: string;
  url: string;
  title: string;
  description: string;
}
