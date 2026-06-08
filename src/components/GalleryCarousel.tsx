/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SpaceImage } from '../types';
import { ChevronLeft, ChevronRight, X, Maximize2, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GalleryProps {
  images: SpaceImage[];
}

export default function GalleryCarousel({ images }: GalleryProps) {
  const [selectedImg, setSelectedImg] = useState<number | null>(null);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImg === null) return;
    setSelectedImg((selectedImg + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImg === null) return;
    setSelectedImg((selectedImg - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-6">
      {/* Scrollable grid container with custom hover details */}
      <div className="relative w-full overflow-hidden py-4 pointer-events-auto">
        <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-none snap-x pointer-events-auto">
          {images.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => setSelectedImg(idx)}
              className="flex-none w-[300px] md:w-[350px] snap-center group relative h-64 rounded-2xl overflow-hidden shadow-md border border-border-token/10 cursor-pointer pointer-events-auto"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Fade Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white" />

              <div className="absolute inset-x-0 bottom-0 p-5 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-3 group-hover:translate-y-0 flex justify-between items-end">
                <div className="space-y-1">
                  <h4 className="font-primary text-base font-bold leading-tight">{img.title}</h4>
                  <p className="text-[10px] text-white/85 line-clamp-2 leading-relaxed font-light font-secondary">{img.description}</p>
                </div>
                <span className="p-2 bg-brand-primary rounded-full text-white transform scale-90 hover:scale-100 transition-transform">
                  <Maximize2 className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center font-secondary">
        <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary bg-white px-3.5 py-1 rounded-full border border-border-token/30 shadow-xs">
          <Compass className="w-3.5 h-3.5 text-brand-primary" />
          <span>Click any workspace area to inspect virtual features & props.</span>
        </span>
      </div>

      {/* Full screen Lightbox */}
      <AnimatePresence>
        {selectedImg !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Soft dimming overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImg(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-xs cursor-pointer"
            />

            {/* Stage content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-10 grid grid-cols-1 md:grid-cols-5"
            >
              <button
                onClick={() => setSelectedImg(null)}
                id="close-lightbox"
                aria-label="Close Gallery Image Lightbox"
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-20 pointer-events-auto cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Slider Image frame */}
              <div className="relative md:col-span-3 aspect-video md:aspect-auto h-64 md:h-[450px] bg-black group">
                <img
                  src={images[selectedImg].url}
                  alt={images[selectedImg].title}
                  className="w-full h-full object-cover"
                />

                {/* Left controls */}
                <button
                  onClick={handlePrev}
                  id="prev-slide"
                  aria-label="Previous Slide"
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-opacity duration-300 focus:outline-none cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Right controls */}
                <button
                  onClick={handleNext}
                  id="next-slide"
                  aria-label="Next Slide"
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-opacity duration-300 focus:outline-none cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Descriptions Sidebar */}
              <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-between space-y-8 bg-neutral-background">
                <div className="space-y-4">
                  <div className="inline-block text-[10px] uppercase tracking-widest font-bold text-brand-primary bg-brand-soft px-3 py-1 rounded-full">
                    Studio Tour
                  </div>
                  <h3 className="font-primary text-2xl lg:text-3xl font-bold text-text-primary leading-tight">
                    {images[selectedImg].title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {images[selectedImg].description}
                  </p>
                </div>

                <div className="text-xs text-text-secondary pt-4 border-t border-border-token/25 flex justify-between items-center font-mono">
                  <span>Image {selectedImg + 1} of {images.length}</span>
                  <div className="flex gap-2.5">
                    <button
                      onClick={handlePrev}
                      className="px-3 py-1 bg-white hover:bg-neutral-background border border-border-token/25 rounded-md cursor-pointer pointer-events-auto"
                    >
                      Prev
                    </button>
                    <button
                      onClick={handleNext}
                      className="px-3 py-1 bg-white hover:bg-neutral-background border border-border-token/25 rounded-md cursor-pointer pointer-events-auto"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
