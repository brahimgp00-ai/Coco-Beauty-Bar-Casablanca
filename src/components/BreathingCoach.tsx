/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BREATH_SETTINGS } from '../data';
import { BreathSetting } from '../types';
import { Wind, Play, Pause, RotateCcw, Sparkles, Volume2, VolumeX } from 'lucide-react';

export default function BreathingCoach() {
  const [selectedId, setSelectedId] = useState<string>('478');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [phase, setPhase] = useState<'idle' | 'inhale' | 'holdIn' | 'exhale' | 'holdOut'>('idle');
  const [secLeft, setSecLeft] = useState<number>(0);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [themeMode, setThemeMode] = useState<'rose' | 'sage' | 'sky'>('rose');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);

  const active = BREATH_SETTINGS.find((s) => s.id === selectedId) || BREATH_SETTINGS[0];
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play a soft synthesizer hum corresponding to inhale/exhale if unmuted
  const playAmbientSound = (type: 'inhale' | 'exhale' | 'hold' | 'stop') => {
    if (isAudioMuted) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Stop previous oscillations if any
      // We will generate a very clean synth hum with GainNodes
      if (type === 'stop') return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'inhale') {
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + active.inhale); // E4 slide
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + active.inhale);
      } else if (type === 'exhale') {
        osc.frequency.setValueAtTime(330, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + active.exhale); // Slide down
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + active.exhale);
      } else {
        // quiet hum
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
      }

      osc.type = 'sine';
      osc.start();
      osc.stop(ctx.currentTime + 1.2); // play small bursts
    } catch (e) {
      console.log('Audio contextual note:', e);
    }
  };

  // Main breathing loop engine
  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase('idle');
      setSecLeft(0);
      return;
    }

    // Set first phase
    if (phase === 'idle') {
      setPhase('inhale');
      setSecLeft(active.inhale);
      playAmbientSound('inhale');
    }

    timerRef.current = setInterval(() => {
      setSecLeft((prev) => {
        if (prev <= 1) {
          // Transition to next phase
          let nextPhase: 'idle' | 'inhale' | 'holdIn' | 'exhale' | 'holdOut' = 'idle';
          let duration = 0;

          if (phase === 'inhale') {
            if (active.holdIn > 0) {
              nextPhase = 'holdIn';
              duration = active.holdIn;
              playAmbientSound('hold');
            } else {
              nextPhase = 'exhale';
              duration = active.exhale;
              playAmbientSound('exhale');
            }
          } else if (phase === 'holdIn') {
            nextPhase = 'exhale';
            duration = active.exhale;
            playAmbientSound('exhale');
          } else if (phase === 'exhale') {
            if (active.holdOut > 0) {
              nextPhase = 'holdOut';
              duration = active.holdOut;
              playAmbientSound('hold');
            } else {
              nextPhase = 'inhale';
              duration = active.inhale;
              setCompletedCycles((c) => c + 1);
              playAmbientSound('inhale');
            }
          } else if (phase === 'holdOut') {
            nextPhase = 'inhale';
            duration = active.inhale;
            setCompletedCycles((c) => c + 1);
            playAmbientSound('inhale');
          }

          setPhase(nextPhase);
          return duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, phase, selectedId]);

  const toggleStart = () => {
    // Try to trigger audio on user action
    if (!isAudioMuted && audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    setIsRunning(!isRunning);
  };

  const resetPractice = () => {
    setIsRunning(false);
    setPhase('idle');
    setSecLeft(0);
    setCompletedCycles(0);
  };

  // Descriptive text for the UI
  const getPhaseInstruction = () => {
    switch (phase) {
      case 'idle':
        return 'Prepare your posture & press start';
      case 'inhale':
        return 'Inhale deeply... Let your lungs expand';
      case 'holdIn':
        return 'Hold the breath in... Rest in center';
      case 'exhale':
        return 'Exhale softly... Release muscle stress';
      case 'holdOut':
        return 'Hold the breath out... Pure stillness';
      default:
        return 'Ready to breathe';
    }
  };

  // Dynamic animation scale for the circle
  const getCircleScale = () => {
    if (!isRunning) return 1.0;
    switch (phase) {
      case 'inhale':
        // Scale up proportionally as time progresses
        const inhaleInPct = (active.inhale - secLeft) / active.inhale;
        return 1.0 + inhaleInPct * 0.7; // Go from 1.0 to 1.7
      case 'holdIn':
        return 1.7; // Keep max scale
      case 'exhale':
        const exhaleOutPct = secLeft / active.exhale; // Starts at 1, goes down to 0
        return 1.0 + exhaleOutPct * 0.7; // Down to 1.0
      case 'holdOut':
        return 1.0; // Keep min scale
      default:
        return 1.0;
    }
  };

  // Color mappings
  const themeStyles = {
    rose: {
      bg: 'bg-rose-50/70',
      border: 'border-rose-100',
      text: 'text-rose-500',
      ring: 'bg-rose-100/35',
      primaryRing: 'bg-brand-primary',
      accent: 'text-rose-600',
      gradient: 'from-rose-200/50 via-teal-100/30 to-brand-primary/10'
    },
    sage: {
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-100',
      text: 'text-emerald-600',
      ring: 'bg-emerald-100/35',
      primaryRing: 'bg-emerald-400',
      accent: 'text-emerald-700',
      gradient: 'from-emerald-100/40 via-amber-50/20 to-emerald-200/10'
    },
    sky: {
      bg: 'bg-sky-50/70',
      border: 'border-sky-100',
      text: 'text-sky-500',
      ring: 'bg-sky-100/35',
      primaryRing: 'bg-sky-400',
      accent: 'text-sky-600',
      gradient: 'from-sky-100/40 via-indigo-50/20 to-sky-200/10'
    }
  };

  const activeTheme = themeStyles[themeMode];

  return (
    <div className="w-full bg-white rounded-3xl border border-border-token/40 shadow-card p-6 md:p-8 flex flex-col md:flex-row gap-8 items-stretch">
      {/* Settings Selector */}
      <div className="w-full md:w-2/5 flex flex-col justify-between gap-6 pointer-events-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-soft text-brand-primary">
              <Wind className="w-4 h-4" />
            </span>
            <h3 className="font-primary text-xl text-text-primary">Daily Breath Reset</h3>
          </div>
          <p className="text-text-secondary text-xs leading-relaxed">
            Cultivate somatic grounding. Pick an ancient sequencing formula to align cardiorespiratory rhythms before your movement classes.
          </p>

          <div className="space-y-3 pt-2">
            {BREATH_SETTINGS.map((setting) => {
              const isSelected = selectedId === setting.id;
              return (
                <button
                  key={setting.id}
                  id={`breath-setting-${setting.id}`}
                  onClick={() => {
                    setSelectedId(setting.id);
                    resetPractice();
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border text-sm transition-all focus:outline-none cursor-pointer ${
                    isSelected
                      ? 'border-brand-primary bg-brand-soft/20 ring-1 ring-brand-primary/20'
                      : 'border-border-token/40 hover:border-text-secondary hover:bg-neutral-background'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-text-primary">{setting.name}</span>
                    <span className="text-[10px] uppercase tracking-wider text-text-secondary bg-white px-2 py-0.5 rounded-md border border-border-token/30">
                      {setting.inhale}-{setting.holdIn}-{setting.exhale}-{setting.holdOut}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {setting.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ambient Settings & Cycles */}
        <div className="pt-4 border-t border-border-token/30 flex flex-wrap gap-4 items-center justify-between text-xs text-text-secondary">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-text-primary">Aura Lighting:</span>
            <div className="flex items-center gap-1.5">
              <button
                id="theme-rose-btn"
                onClick={() => setThemeMode('rose')}
                aria-label="Rose Theme"
                className={`w-4 h-4 rounded-full bg-rose-300 focus:outline-none transition-transform ${
                  themeMode === 'rose' ? 'scale-125 ring-2 ring-rose-500 ring-offset-1' : ''
                }`}
              />
              <button
                id="theme-sage-btn"
                onClick={() => setThemeMode('sage')}
                aria-label="Sage Theme"
                className={`w-4 h-4 rounded-full bg-emerald-300 focus:outline-none transition-transform ${
                  themeMode === 'sage' ? 'scale-125 ring-2 ring-emerald-500 ring-offset-1' : ''
                }`}
              />
              <button
                id="theme-sky-btn"
                onClick={() => setThemeMode('sky')}
                aria-label="Sky Theme"
                className={`w-4 h-4 rounded-full bg-sky-300 focus:outline-none transition-transform ${
                  themeMode === 'sky' ? 'scale-125 ring-2 ring-sky-500 ring-offset-1' : ''
                }`}
              />
            </div>
          </div>

          <div id="sound-btn" className="flex items-center gap-2">
            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="p-1 px-2.5 rounded-lg bg-neutral-background hover:bg-neutral-background/80 flex items-center gap-1.5 text-text-secondary hover:text-text-primary border border-border-token/20 transition-all pointer-events-auto"
            >
              {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-brand-primary" />}
              <span>{isAudioMuted ? 'Unmute Aura' : 'Muted'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Breathing Engine Dynamic Stage */}
      <div className={`flex-1 min-h-[300px] rounded-2xl bg-gradient-to-b ${activeTheme.gradient} border ${activeTheme.border} p-6 flex flex-col justify-between items-center relative overflow-hidden`}>
        {/* Cycle Badge */}
        <div className="z-10 flex w-full items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-text-secondary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Completed Sequences:</span>
          </div>
          <span id="completed-cycles-count" className="font-mono font-medium text-text-primary bg-white px-2.5 py-0.5 rounded-full border border-border-token/30 shadow-sm">
            {completedCycles} Cycles
          </span>
        </div>

        {/* Dynamic Expanding/Contracting Sphere */}
        <div className="relative py-12 flex items-center justify-center">
          {/* Inner pulsating glow helper rings */}
          <AnimatePresence>
            {isRunning && (
              <motion.div
                key="pulse-ring"
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: getCircleScale() * 1.25,
                  opacity: [0.15, 0.45, 0.15]
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className={`absolute w-36 h-36 rounded-full ${activeTheme.ring} pointer-events-none`}
              />
            )}
          </AnimatePresence>

          {/* Core Breathing Mandala */}
          <div
            style={{
              transform: `scale(${getCircleScale()})`,
              transition: isRunning ? 'transform 1s linear' : 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            className={`w-36 h-36 rounded-full ${activeTheme.primaryRing} flex flex-col items-center justify-center shadow-lg relative border-4 border-white`}
          >
            {phase !== 'idle' ? (
              <div className="text-white text-center select-none">
                <div id="countdown-timer" className="font-mono font-bold text-3xl leading-none">
                  {secLeft}
                </div>
                <div className="text-[10px] tracking-widest font-bold uppercase opacity-85 mt-1">
                  SEC
                </div>
              </div>
            ) : (
              <Wind className="w-10 h-10 text-white animate-pulse" />
            )}
          </div>
        </div>

        {/* Phase Prompt Banner */}
        <div className="z-10 text-center space-y-4 w-full">
          <div className="min-h-[48px] px-4 flex flex-col justify-center">
            <span id="phase-label" className={`text-xs uppercase tracking-widest font-bold ${activeTheme.accent} mb-1 transition-all`}>
              {phase === 'idle' ? 'Ready to Ground' : phase.replace('holdIn', 'HOLD').replace('holdOut', 'HOLD').toUpperCase()}
            </span>
            <p id="instruction-label" className="text-sm font-medium text-text-secondary">
              {getPhaseInstruction()}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              id="start-breath-btn"
              onClick={toggleStart}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer pointer-events-auto ${
                isRunning
                  ? 'bg-white hover:bg-neutral-background text-text-primary'
                  : 'bg-brand-primary hover:opacity-90 text-white'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Start practice</span>
                </>
              )}
            </button>

            {(isRunning || phase !== 'idle' || completedCycles > 0) && (
              <button
                id="reset-breath-btn"
                onClick={resetPractice}
                aria-label="Reset Breath Practice"
                className="p-2.5 rounded-full bg-white hover:bg-neutral-background text-text-secondary hover:text-text-primary border border-border-token/20 shadow-sm transition-all cursor-pointer pointer-events-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
