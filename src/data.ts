/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lesson, BreathSetting, SpaceImage } from './types';

export const INITIAL_LESSONS: Lesson[] = [
  // Monday
  {
    id: 'mon-hatha',
    day: 'Monday',
    time: '09:00 - 10:15',
    classType: 'Mani-Pedi Classic',
    instructor: 'Sofia',
    maxSlots: 6,
    availableSlots: 2,
    difficulty: 'Gentle',
    description: 'A luxurious nail treatment including cuticle grooming, dual hydration, scrub, and premium nail lacquer application.'
  },
  {
    id: 'mon-vinyasa',
    day: 'Monday',
    time: '18:00 - 19:15',
    classType: 'Blowdry Signature',
    instructor: 'Kenza',
    maxSlots: 4,
    availableSlots: 1,
    difficulty: 'Moderate',
    description: 'Expert hair washing, nourishing ritual treatment, and dynamic professional blow-dry for perfect volume and shine.'
  },
  
  // Tuesday
  {
    id: 'tue-yin',
    day: 'Tuesday',
    time: '10:00 - 11:15',
    classType: 'Soin Visage Hydrafacial',
    instructor: 'Leila',
    maxSlots: 3,
    availableSlots: 1,
    difficulty: 'Gentle',
    description: 'A premium deep-cleansing, exfoliating facial using high-potency signature antioxidants and collagen serums.'
  },
  {
    id: 'tue-ashtanga',
    day: 'Tuesday',
    time: '19:00 - 20:15',
    classType: 'Massage Drainant',
    instructor: 'Sofia',
    maxSlots: 2,
    availableSlots: 1,
    difficulty: 'Challenging',
    description: 'An intensive lymphatic wellness massage designed to release deep-seated tension, sculpt curves, and detoxify.'
  },

  // Wednesday
  {
    id: 'wed-hatha',
    day: 'Wednesday',
    time: '09:00 - 10:15',
    classType: 'Mani-Pedi Classic',
    instructor: 'Sofia',
    maxSlots: 6,
    availableSlots: 4,
    difficulty: 'Gentle',
    description: 'Indulge in a dedicated hands/feet renewal, detailed shape detailing, and premium Moroccan Argan oil conditioning.'
  },
  {
    id: 'wed-vinyasa',
    day: 'Wednesday',
    time: '18:00 - 19:15',
    classType: 'Blowdry Signature',
    instructor: 'Kenza',
    maxSlots: 4,
    availableSlots: 3,
    difficulty: 'Moderate',
    description: 'Reinvigorate your hair texture under skilled blowout nozzles. Includes custom protective thermal care.'
  },

  // Thursday
  {
    id: 'thu-yin',
    day: 'Thursday',
    time: '10:00 - 11:15',
    classType: 'Soin Visage Hydrafacial',
    instructor: 'Leila',
    maxSlots: 3,
    availableSlots: 2,
    difficulty: 'Gentle',
    description: 'Advanced micro-exfoliation and deep custom hydrating cabin masks to bring out an instant, youthful skin radiance.'
  },
  {
    id: 'thu-ashtanga',
    day: 'Thursday',
    time: '19:00 - 20:15',
    classType: 'Massage Drainant',
    instructor: 'Sofia',
    maxSlots: 2,
    availableSlots: 0,
    difficulty: 'Challenging',
    description: 'Rhythmic, high-precision manual remodeling moves targeting biological tone and somatic systemic relief.'
  },

  // Friday
  {
    id: 'fri-vinyasa',
    day: 'Friday',
    time: '09:00 - 10:15',
    classType: 'Blowdry Signature',
    instructor: 'Kenza',
    maxSlots: 4,
    availableSlots: 2,
    difficulty: 'Moderate',
    description: 'Elevated styling prep for the weekend. Deep keratin mask enrichment followed by premium texturizing waves.'
  },
  {
    id: 'fri-yin',
    day: 'Friday',
    time: '17:30 - 18:45',
    classType: 'Soin Visage Hydrafacial',
    instructor: 'Leila',
    maxSlots: 3,
    availableSlots: 1,
    difficulty: 'Gentle',
    description: 'Our weekend prep facial. Features sensory cooling ice globes and advanced organic Casablanca rose infusions.'
  },

  // Saturday
  {
    id: 'sat-hatha',
    day: 'Saturday',
    time: '09:30 - 10:45',
    classType: 'Mani-Pedi Classic',
    instructor: 'Sofia',
    maxSlots: 8,
    availableSlots: 6,
    difficulty: 'Gentle',
    description: 'Perfect, flawless manicures and nourishing paraffin pedicures designed to maintain beautiful, healthy hands & feet.'
  },
  {
    id: 'sat-vinyasa',
    day: 'Saturday',
    time: '11:00 - 12:15',
    classType: 'Blowdry Signature',
    instructor: 'Kenza',
    maxSlots: 5,
    availableSlots: 2,
    difficulty: 'Moderate',
    description: 'Flawless styling results from our leading Casablanca hair salon designers. Dynamic texturized waves.'
  },

  // Sunday
  {
    id: 'sun-yin',
    day: 'Sunday',
    time: '10:00 - 11:15',
    classType: 'Soin Visage Hydrafacial',
    instructor: 'Leila',
    maxSlots: 4,
    availableSlots: 3,
    difficulty: 'Gentle',
    description: 'A luxurious, relaxing facial retreat incorporating premium active serums, cooling jade rollers, and head massages.'
  },
  {
    id: 'sun-ashtanga',
    day: 'Sunday',
    time: '16:00 - 17:15',
    classType: 'Massage Drainant',
    instructor: 'Sofia',
    maxSlots: 3,
    availableSlots: 1,
    difficulty: 'Challenging',
    description: 'Deep tissue therapy to fully reset bodily balance, relax the neck and shoulders, and end the weekend refreshed.'
  }
];

export const BREATH_SETTINGS: BreathSetting[] = [
  {
    id: '478',
    name: 'Soothing Cabin Breath',
    description: 'A natural tranquilizer for the nervous system. Calms the senses deeply before a luxury facial or massage.',
    inhale: 4,
    holdIn: 7,
    exhale: 8,
    holdOut: 0
  },
  {
    id: 'box',
    name: 'Senses Balance',
    description: 'Establishes total serenity, focus, and body awareness. Highly recommended before your hair or manicures design.',
    inhale: 4,
    holdIn: 4,
    exhale: 4,
    holdOut: 4
  },
  {
    id: 'coherent',
    name: 'Aroma Coherent Breath',
    description: 'Equal, flowing breathing loops. Deeply relaxing breathing aligned with our ambient orange blossom oil mist.',
    inhale: 5,
    holdIn: 0,
    exhale: 5,
    holdOut: 0
  }
];

export const SPACE_IMAGES: SpaceImage[] = [
  {
    id: 'space-1',
    url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&h=450&q=80',
    title: 'Salon Coiffure & Blowdry Suite',
    description: 'A beautifully lit styling suite featuring elite golden-framed mirrors, premium hair-care products, and plush leather stations.'
  },
  {
    id: 'space-2',
    url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&h=450&q=80',
    title: 'The Nail & Mani-Pedi Bar',
    description: 'A modern, comfortable station with hundreds of luxury lacquer shades, matching professional spa bowls, and soft lighting.'
  },
  {
    id: 'space-3',
    url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&h=450&q=80',
    title: 'The Hydrafacial Cabin',
    description: 'A peaceful, private room optimized for advanced skin therapies, deep hydration, and peaceful face relaxation rituals.'
  },
  {
    id: 'space-4',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&h=450&q=80',
    title: 'The Massage Sanctuary',
    description: 'Indulge in pure wellness under dim candle-light with heated beds, aromatherapy essences, and total silence.'
  },
  {
    id: 'space-5',
    url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&h=450&q=80',
    title: 'The Coco Luxury Lounge',
    description: 'Unwind pre- or post-treatment in our comfortable reception. Enjoy signature Moroccan herbal teas and fresh water daily.'
  }
];
