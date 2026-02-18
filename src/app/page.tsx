'use client';

import FluidCursor from '@/components/FluidCursor';
import { MobileScrollLayout } from '@/components/home/mobile-scroll-layout';
import { motion } from 'framer-motion';
import { Anton, Sora } from 'next/font/google';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useState, type CSSProperties } from 'react';

const chromeFont = Anton({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const bodyFont = Sora({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

const desktopNavLinks = [
  { label: 'HOME', href: '/' },
  { label: 'ME', href: '/me' },
  { label: 'PROJECTS', href: '/projects' },
  { label: 'MORE', href: '/more' },
  { label: 'SKILLS', href: '/skills' },
  { label: 'CONTACT', href: '/contact' },
] as const;
const DESKTOP_LINE_POSITIONS = [20, 40, 60, 80] as const;

export default function Home() {
  const { setTheme } = useTheme();
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme');
    if (!storedTheme) {
      setTheme('dark');
    }
  }, [setTheme]);

  useEffect(() => {
    setMounted(true);

    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreenSize();

    let resizeTimeout: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkScreenSize, 120);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#f1f0eb] dark:bg-[#030303]" />;
  }

  if (!isDesktop) {
    return <MobileScrollLayout />;
  }

  return <DesktopHomeReference />;
}

function DesktopHomeReference() {
  const lineBursts = useMemo(
    () =>
      DESKTOP_LINE_POSITIONS.map((_, lineIndex) =>
        Array.from({ length: 1 }, (_, burstIndex) => ({
          id: `${lineIndex}-${burstIndex}`,
          duration: 8.2 + Math.random() * 4.4,
          delay: Math.random() * 5.6 + lineIndex * 0.9 + burstIndex * 2.6,
          opacity: 0.42 + Math.random() * 0.24,
          height: 30 + Math.random() * 44,
          blur: 0.35 + Math.random() * 1.1,
        }))
      ),
    []
  );

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-[#f1efe8]">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.85]">
        <FluidCursor />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/82 via-black/54 to-black/15" />
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[56vh] bg-gradient-to-t from-[#ff5a00]/92 via-[#db0000]/72 to-transparent"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
        />
        <motion.div
          className="absolute -bottom-[20vh] left-[-12vw] h-[52vh] w-[44vw] rounded-full bg-[#ff2f00]/72 blur-[120px]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 1.25, ease: [0.2, 0.8, 0.2, 1] }}
        />
        <motion.div
          className="absolute -bottom-[24vh] right-[-8vw] h-[56vh] w-[48vw] rounded-full bg-[#ff7b00]/84 blur-[130px]"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1.25, ease: [0.2, 0.8, 0.2, 1] }}
        />

        {DESKTOP_LINE_POSITIONS.map((left, index) => (
          <div key={left} className="absolute bottom-0 top-[76px] w-px" style={{ left: `${left}%` }}>
            <span className="absolute inset-0 bg-white/25" />
            <span className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-white/14 blur-[2px]" />
            <span className="absolute bottom-0 left-0 right-0 h-[56%] bg-gradient-to-b from-white/0 via-white/12 to-white/24" />
            {lineBursts[index].map((burst) => (
              <span
                key={burst.id}
                className="desktop-fiber-burst absolute left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.98)_52%,rgba(255,255,255,0)_100%)]"
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

      <div className="desktop-no-ibeam relative z-20 flex h-full flex-col border-t border-white/12">
        <motion.div
          className={`${chromeFont.className} grid grid-cols-6 items-center px-6 pt-6 text-[clamp(17px,1.05vw,24px)] uppercase tracking-[0.055em] text-[#e6e4dc]`}
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {desktopNavLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="desktop-nav-link pointer-events-auto justify-self-center rounded-md px-3 py-1.5 transition-transform duration-200 ease-out hover:scale-125 hover:text-white"
            >
              {`[ ${item.label} ]`}
            </Link>
          ))}
        </motion.div>

        <motion.h1
          className={`${chromeFont.className} pointer-events-none w-full select-none px-[0.35vw] pt-10 text-[13.85vw] leading-[0.84] tracking-[-0.025em] text-[#f4f3ef] uppercase whitespace-nowrap`}
          initial={{ opacity: 0, y: -36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.75, ease: [0.2, 0.8, 0.2, 1] }}
        >
          Jordan Hymas
        </motion.h1>

        <motion.div
          className={`${bodyFont.className} mt-auto w-full px-[0.35vw] pb-12`}
          initial={{ opacity: 0, y: 46 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.85, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="max-w-[min(68vw,44rem)]">
            <h2 className="max-w-[39rem] text-[clamp(56px,4.6vw,90px)] leading-[1.02] font-bold tracking-[-0.02em] text-[#f3f1eb]">
              Building Secure
              <br />
              Digital Systems
            </h2>
            <p className="mt-4 max-w-[40rem] text-[clamp(24px,1.5vw,33px)] leading-[1.12] font-semibold tracking-[-0.008em] text-white/92">
              From Cybersecurity, IT, to Networking and Full-stack development.
            </p>
          </div>

          <div className="mt-9 grid w-full grid-cols-[auto_1fr_auto_1fr_auto] items-center text-[clamp(13px,0.74vw,16px)] font-semibold uppercase tracking-[0.07em] text-[#d6d3ca]">
            <span className="col-[1] justify-self-start">©2026</span>
            <span className="col-[3] justify-self-center">Based in US</span>
            <span className="col-[5] justify-self-end">Developer</span>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .desktop-no-ibeam,
        .desktop-no-ibeam * {
          user-select: none;
          cursor: default;
        }

        .desktop-no-ibeam .desktop-nav-link {
          cursor: pointer;
        }

        .desktop-fiber-burst {
          top: 0;
          opacity: 0;
          animation-name: desktopFiberDown;
          animation-timing-function: cubic-bezier(0.28, 0.08, 0.26, 1);
          animation-iteration-count: infinite;
        }

        @keyframes desktopFiberDown {
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
