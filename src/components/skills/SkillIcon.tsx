'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { WindowsViewportDensity } from '@/hooks/useWindowsViewportDensity';

interface SkillIconProps {
  name: string;
  icon?: string;
  fallbackColor: string;
  index: number;
  density?: WindowsViewportDensity;
  rippleCenterIndex?: number | null;
  rippleWaveId?: number;
  rippleColumns?: number;
  onTriggerRipple?: () => void;
}

const SkillIcon = ({
  name,
  icon,
  fallbackColor,
  index,
  density = 'default',
  rippleCenterIndex = null,
  rippleWaveId = 0,
  rippleColumns = 4,
  onTriggerRipple,
}: SkillIconProps) => {
  const [imageError, setImageError] = useState(false);
  const [tapGlowActive, setTapGlowActive] = useState(false);
  const glowStartTimeoutRef = useRef<number | null>(null);
  const glowEndTimeoutRef = useRef<number | null>(null);
  const isCompactDensity = density === 'compact' || density === 'tight';
  const isTightDensity = density === 'tight';
  const iconContainerClass = isTightDensity
    ? 'relative h-12 w-12 max-sm:h-14 max-sm:w-14 sm:h-16 sm:w-16 md:h-20 md:w-20'
    : isCompactDensity
      ? 'relative h-12 w-12 max-sm:h-14 max-sm:w-14 sm:h-[72px] sm:w-[72px] md:h-[88px] md:w-[88px]'
      : 'relative h-14 w-14 max-sm:h-[60px] max-sm:w-[60px] sm:h-20 sm:w-20 md:h-24 md:w-24';
  const iconImagePaddingClass = isTightDensity
    ? 'relative h-full w-full p-2.5 sm:p-3 flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900'
    : isCompactDensity
      ? 'relative h-full w-full p-2.5 sm:p-3.5 flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900'
      : 'relative h-full w-full p-3 sm:p-4 flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900';
  const labelClass = isTightDensity
    ? 'w-12 sm:w-16 md:w-20 text-center text-[9px] sm:text-[10px] md:text-[11px] font-medium text-neutral-900 dark:text-neutral-100 line-clamp-2 leading-tight drop-shadow-sm'
    : isCompactDensity
      ? 'w-12 sm:w-[72px] md:w-[88px] text-center text-[10px] sm:text-[11px] md:text-xs font-medium text-neutral-900 dark:text-neutral-100 line-clamp-2 leading-tight drop-shadow-sm'
      : 'w-14 sm:w-20 md:w-24 text-center text-[10px] sm:text-[11px] md:text-xs font-medium text-neutral-900 dark:text-neutral-100 line-clamp-2 leading-tight drop-shadow-sm';
  const hoverScale = isTightDensity ? 1.04 : isCompactDensity ? 1.06 : 1.08;
  const hoverLift = isTightDensity ? -4 : isCompactDensity ? -5 : -6;
  const mobileIconSizeFixClass = name === 'C++' ? 'max-sm:scale-[0.84]' : '';
  const outerGlowClass = tapGlowActive ? 'opacity-25' : 'opacity-0';
  const midGlowClass = tapGlowActive ? 'opacity-40' : 'opacity-0';
  const sharpGlowClass = tapGlowActive ? 'opacity-70' : 'opacity-0';

  const clearGlowTimers = useCallback(() => {
    if (glowStartTimeoutRef.current !== null) {
      window.clearTimeout(glowStartTimeoutRef.current);
      glowStartTimeoutRef.current = null;
    }
    if (glowEndTimeoutRef.current !== null) {
      window.clearTimeout(glowEndTimeoutRef.current);
      glowEndTimeoutRef.current = null;
    }
  }, []);

  const startGlowPulse = useCallback((delayMs: number, durationMs: number) => {
    clearGlowTimers();
    glowStartTimeoutRef.current = window.setTimeout(() => {
      setTapGlowActive(true);
      glowStartTimeoutRef.current = null;
      glowEndTimeoutRef.current = window.setTimeout(() => {
        setTapGlowActive(false);
        glowEndTimeoutRef.current = null;
      }, durationMs);
    }, delayMs);
  }, [clearGlowTimers]);

  useEffect(() => {
    return () => {
      clearGlowTimers();
    };
  }, [clearGlowTimers]);

  const handleTapStart = () => {
    if (onTriggerRipple) {
      onTriggerRipple();
      return;
    }
    startGlowPulse(0, 220);
  };

  useEffect(() => {
    if (rippleCenterIndex === null || rippleWaveId === 0) {
      return;
    }

    const cols = Math.max(1, rippleColumns);
    const row = Math.floor(index / cols);
    const col = index % cols;
    const centerRow = Math.floor(rippleCenterIndex / cols);
    const centerCol = rippleCenterIndex % cols;
    const distance = Math.hypot(row - centerRow, col - centerCol);
    const rippleDelayMs = Math.round(distance * 150);

    startGlowPulse(rippleDelayMs, 420);
  }, [index, rippleCenterIndex, rippleWaveId, rippleColumns, startGlowPulse]);

  // Get initials from skill name (first 2 letters or first letter of first 2 words)
  const getInitials = (text: string): string => {
    const words = text.split(' ').filter(w => w.length > 0);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return text.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(name);

  // Random entrance animation
  const randomDelay = Math.random() * 0.6; // Random delay between 0 and 0.6 seconds
  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: randomDelay,
        duration: 0.4,
        ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.div
      custom={index}
      variants={iconVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: hoverScale, y: hoverLift }}
      whileTap={{ scale: 0.95 }}
      onTapStart={handleTapStart}
      className="group flex flex-col items-center gap-2 cursor-default"
    >
      {/* macOS-style App Icon Container */}
      <div className={iconContainerClass}>
        {/* Outer glow - light shining out */}
        <div
          className={`pointer-events-none absolute -inset-[4px] rounded-[22%] blur-lg transition-opacity duration-500 group-hover:opacity-25 ${outerGlowClass}`}
          style={{
            background: `linear-gradient(
              90deg,
              #6366f1,
              #a855f7,
              #ec4899,
              #f97316,
              #eab308,
              #22c55e,
              #06b6d4,
              #6366f1
            )`,
            backgroundSize: '400% 100%',
            animation: 'liquid-border 3s linear infinite',
          }}
        />

        {/* Mid glow layer */}
        <div
          className={`pointer-events-none absolute -inset-[2px] rounded-[22%] blur-sm transition-opacity duration-500 group-hover:opacity-40 ${midGlowClass}`}
          style={{
            background: `linear-gradient(
              90deg,
              #6366f1,
              #a855f7,
              #ec4899,
              #f97316,
              #eab308,
              #22c55e,
              #06b6d4,
              #6366f1
            )`,
            backgroundSize: '400% 100%',
            animation: 'liquid-border 3s linear infinite',
          }}
        />

        {/* Sharp border line */}
        <div
          className={`pointer-events-none absolute -inset-[1px] rounded-[22%] transition-opacity duration-500 group-hover:opacity-70 ${sharpGlowClass}`}
          style={{
            padding: '1px',
            background: `linear-gradient(
              90deg,
              #6366f1,
              #a855f7,
              #ec4899,
              #f97316,
              #eab308,
              #22c55e,
              #06b6d4,
              #6366f1
            )`,
            backgroundSize: '400% 100%',
            animation: 'liquid-border 3s linear infinite',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
          }}
        />

        {/* Outer shadow layer (macOS-style depth) */}
        <div className="absolute inset-0 rounded-[22%] bg-gradient-to-b from-black/10 to-black/30 blur-md transform translate-y-1" />

        {/* Icon background container */}
        <div className="relative h-full w-full rounded-[22%] overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-lg">
          {icon && !imageError ? (
            <div className={iconImagePaddingClass}>
              <Image
                src={icon}
                alt={name}
                fill
                sizes="(max-width: 640px) 72px, 80px"
                className={`object-contain p-2 max-sm:p-1.5 drop-shadow-sm transition-all group-hover:drop-shadow-md ${mobileIconSizeFixClass}`}
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-xl sm:text-2xl font-bold text-white"
              style={{
                background: `linear-gradient(135deg, ${fallbackColor} 0%, ${adjustBrightness(fallbackColor, -20)} 100%)`,
              }}
            >
              {initials}
            </div>
          )}
        </div>

        {/* Glossy overlay effect (macOS shine) */}
        <div className="absolute inset-0 rounded-[22%] bg-gradient-to-b from-white/40 via-white/10 to-transparent opacity-60 pointer-events-none" />
      </div>

      {/* App Label (macOS style) */}
      <span className={labelClass}>
        {name}
      </span>

      <style jsx>{`
        @keyframes liquid-border {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </motion.div>
  );
};

// Helper function to adjust color brightness
function adjustBrightness(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`;
}

export default SkillIcon;
