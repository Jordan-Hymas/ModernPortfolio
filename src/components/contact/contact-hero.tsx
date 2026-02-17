'use client';

import type { WindowsViewportDensity } from '@/hooks/useWindowsViewportDensity';

interface ContactHeroProps {
  density?: WindowsViewportDensity;
}

export function ContactHero({ density = 'default' }: ContactHeroProps) {
  const isCompactDensity = density === 'compact' || density === 'tight';
  const isTightDensity = density === 'tight';
  const wrapperClass = isTightDensity
    ? 'relative pt-2 animate-fade-in-down'
    : isCompactDensity
      ? 'relative pt-4 animate-fade-in-down'
      : 'relative pt-8 animate-fade-in-down';
  const titleClass = isTightDensity
    ? 'whitespace-nowrap bg-gradient-to-b from-neutral-400/70 via-neutral-400/55 to-neutral-400/0 bg-clip-text text-[8.8vw] leading-none font-black text-transparent select-none sm:text-[10vw] md:text-[11vw] lg:text-[12vw] xl:text-[13vw] 2xl:text-[14vw] dark:from-neutral-400/10 dark:via-neutral-400/8 dark:to-neutral-400/0'
    : isCompactDensity
      ? 'whitespace-nowrap bg-gradient-to-b from-neutral-400/70 via-neutral-400/55 to-neutral-400/0 bg-clip-text text-[9.4vw] leading-none font-black text-transparent select-none sm:text-[10.5vw] md:text-[11.5vw] lg:text-[12.5vw] xl:text-[13.5vw] 2xl:text-[14.5vw] dark:from-neutral-400/10 dark:via-neutral-400/8 dark:to-neutral-400/0'
      : 'whitespace-nowrap bg-gradient-to-b from-neutral-400/70 via-neutral-400/55 to-neutral-400/0 bg-clip-text text-[10vw] leading-none font-black text-transparent select-none sm:text-[11vw] md:text-[12vw] lg:text-[13vw] xl:text-[14vw] 2xl:text-[15vw] dark:from-neutral-400/10 dark:via-neutral-400/8 dark:to-neutral-400/0';

  return (
    <div className={wrapperClass}>
      {/* Big blurred background text at top */}
      <div className="pointer-events-none flex justify-center overflow-visible">
        <div
          className={titleClass}
          style={{
            WebkitTextStroke: '1px rgba(255, 255, 255, 0.3)',
          }}
        >
          Get In Touch
        </div>
      </div>
    </div>
  );
}
