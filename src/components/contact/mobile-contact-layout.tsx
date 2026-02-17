'use client';

import { Anton } from 'next/font/google';
import { useMemo, type CSSProperties } from 'react';

const menuTitleFont = Anton({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const email = 'jordanhymas24@gmail.com';

const socialLinks = [
  { label: 'GitHub', url: 'https://github.com/Jhymas20' },
  { label: 'TikTok', url: 'https://www.tiktok.com/@node.io' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/jordan-hymas/' },
  { label: 'Instagram', url: 'https://www.instagram.com/jordan.hymas/' },
];

const LINE_POSITIONS = [19, 39, 59, 79] as const;

export function MobileContactLayout() {
  const lineBursts = useMemo(
    () =>
      LINE_POSITIONS.map((_, lineIndex) =>
        Array.from({ length: 2 }, (_, burstIndex) => ({
          id: `${lineIndex}-${burstIndex}`,
          duration: 9 + Math.random() * 4.5,
          delay: Math.random() * 7 + lineIndex * 0.8 + burstIndex * 3.2,
          opacity: 0.34 + Math.random() * 0.26,
          height: 30 + Math.random() * 28,
          blur: 0.2 + Math.random() * 0.8,
        }))
      ),
    []
  );

  return (
    <div className="relative h-[100dvh] overflow-hidden text-white dark:text-[#f6f3ec]">
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          background:
            'radial-gradient(120% 65% at 85% 58%, rgba(255, 205, 155, 0.72) 0%, rgba(255, 205, 155, 0) 58%), linear-gradient(180deg, #9f1200 0%, #f54800 27%, #ff6a00 47%, #6d2300 76%, #000000 100%)',
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background:
            'radial-gradient(110% 62% at 82% 54%, rgba(255, 145, 75, 0.3) 0%, rgba(255, 145, 75, 0) 58%), linear-gradient(180deg, #4a0900 0%, #812100 28%, #8d2a00 46%, #230d00 72%, #000000 100%)',
        }}
      />

      <div className="pointer-events-none absolute inset-0">
        {LINE_POSITIONS.map((left, index) => (
          <div key={left} className="absolute bottom-0 top-0 w-px" style={{ left: `${left}%` }}>
            <span className="absolute inset-0 bg-white/30 dark:bg-white/22" />
            {lineBursts[index].map((burst) => (
              <span
                key={burst.id}
                className="contact-fiber-burst absolute left-1/2 w-[2.6px] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.94)_52%,rgba(255,255,255,0)_100%)]"
                style={
                  {
                    height: `${burst.height}px`,
                    animationDuration: `${burst.duration}s`,
                    animationDelay: `${burst.delay}s`,
                    filter: `blur(${burst.blur}px)`,
                    '--burst-opacity': `${burst.opacity}`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        ))}
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-md flex-col px-3 pb-4 pt-20">
        <header className="shrink-0 text-center">
          <h1 className={`${menuTitleFont.className} text-[76px] leading-[0.85] tracking-tight text-white dark:text-[#f6f3ec]`}>
            Get in Touch
          </h1>

          <div className="mt-2.5 grid grid-cols-4 gap-1.5">
            {Array.from({ length: 4 }).map((_, index) => (
              <p
                key={index}
                className="text-center font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-white dark:text-white/90"
              >
                LET&apos;S CHAT
              </p>
            ))}
          </div>
        </header>

        <div className="mt-8 rounded-[32px] border border-white/35 bg-white/10 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]">
          <a
            href={`mailto:${email}`}
            className="flex flex-col items-center rounded-[24px] border border-black/65 bg-[#ecebe7] px-4 py-4 text-center text-black shadow-[0_7px_0_rgba(0,0,0,0.28)]"
            aria-label="Send email"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/70">PRIMARY</p>
            <p className={`${menuTitleFont.className} mt-1 text-[34px] leading-[0.88] text-black`}>
              [ EMAIL ]
            </p>
            <p className="mt-1.5 break-all font-mono text-[12px] leading-tight text-black/88">{email}</p>
          </a>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[74px] items-center justify-center rounded-[14px] border border-black/65 bg-[#f5f4f0] px-3 text-center text-black shadow-[0_5px_0_rgba(0,0,0,0.24)]"
              aria-label={social.label}
            >
              <span className="font-mono text-[15px] font-bold uppercase tracking-[0.08em]">[ {social.label} ]</span>
            </a>
          ))}
        </div>

        <p className="mt-auto px-1 pt-3 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-white/82 dark:text-white/78">
          Tap any widget to connect
        </p>
      </div>

      <style jsx>{`
        .contact-fiber-burst {
          top: 0;
          opacity: 0;
          animation-name: contactFiberDown;
          animation-timing-function: cubic-bezier(0.28, 0.08, 0.26, 1);
          animation-iteration-count: infinite;
        }

        @keyframes contactFiberDown {
          0% {
            transform: translate(-50%, -8vh);
            opacity: 0;
          }
          8% {
            opacity: var(--burst-opacity);
          }
          78% {
            opacity: var(--burst-opacity);
          }
          100% {
            transform: translate(-50%, 104vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
