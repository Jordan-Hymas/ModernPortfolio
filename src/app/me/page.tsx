'use client';

import { ProfileSidebar } from '@/components/profile-sidebar';
import { ProfileCardMobile } from '@/components/profile-card-mobile';
import { Milestones } from '@/components/milestones';
import { StrategicPathway } from '@/components/strategic-pathway';
import { SiriBorderCard } from '@/components/siri-border-card';
import { MobileMeLayout } from '@/components/me/mobile-me-layout';
import { Download } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { useWindowsViewportDensity } from '@/hooks/useWindowsViewportDensity';

export default function MePage() {
  const { setTheme } = useTheme();
  const hasAppliedDefaultThemeRef = useRef(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isCompact, isTight } = useWindowsViewportDensity();
  const pagePaddingClass = isTight ? 'pt-20 pb-6' : isCompact ? 'pt-20 pb-7' : 'pt-20 pb-8';
  const contentGapClass = isTight ? 'gap-6' : 'gap-8';

  useEffect(() => {
    if (hasAppliedDefaultThemeRef.current) return;
    hasAppliedDefaultThemeRef.current = true;
    setTheme('dark');
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

    // Scroll to top immediately
    window.scrollTo(0, 0);

    // Also scroll to top after a brief delay to override any auto-focus scrolling
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-950" />;
  }

  if (!isDesktop) {
    return <MobileMeLayout />;
  }

  return (
    <div className={`relative min-h-screen bg-gradient-to-b from-white to-neutral-50 px-4 dark:from-neutral-950 dark:to-neutral-950 lg:px-8 ${pagePaddingClass}`}>
      <div className={`mx-auto flex w-full max-w-7xl pb-8 ${contentGapClass}`}>
        {/* Left Sidebar - Hidden on mobile, shown on larger screens */}
        <aside className="hidden w-80 shrink-0 lg:block">
          <ProfileSidebar />
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1 space-y-8">
          {/* Mobile Profile Card */}
          <ProfileCardMobile />

          {/* About Me Section */}
          <SiriBorderCard>
            <section className="rounded-3xl border border-neutral-200 bg-gradient-to-b from-white to-neutral-50 p-8 shadow-lg dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-950 dark:shadow-none">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">About Me</h1>
                <div className="mt-2 h-1 w-16 rounded-full bg-cyan-500" />
              </div>
              <div className="space-y-4 text-neutral-700 dark:text-neutral-300">
                <p className="leading-relaxed">
                  I&apos;m a full-stack developer and IT technician with experience building web apps, mobile apps, automation tools, and backend systems. I combine software engineering, cybersecurity fundamentals, and hands-on IT work to create fast, reliable, and practical solutions.
                </p>
                <p className="leading-relaxed">
                  From building local AI assistants to designing modern websites and deploying infrastructure for real clients, I love turning ideas into working systems.
                </p>
              </div>

              {/* Download Resume Button */}
              <div className="mt-6 flex justify-start">
                <a
                  href="/resume.pdf"
                  download
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-200/50 bg-white/30 px-6 py-2.5 text-sm font-semibold text-neutral-800 shadow-lg backdrop-blur-lg transition-all hover:border-neutral-300/50 hover:bg-white/40 hover:shadow-xl active:scale-95 dark:border-neutral-700/50 dark:bg-neutral-800/30 dark:text-neutral-100 dark:hover:border-neutral-600/50 dark:hover:bg-neutral-700/40"
                >
                  <Download size={18} />
                  Download Resume
                </a>
              </div>
            </section>
          </SiriBorderCard>

          {/* Milestones & Achievements */}
          <Milestones />

          {/* Strategic Implementation Pathway */}
          <StrategicPathway />
        </main>
      </div>
    </div>
  );
}
