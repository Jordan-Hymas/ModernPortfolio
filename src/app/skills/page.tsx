'use client';

import NavigationPrompt from '@/components/navigation-prompt';
import Skills from '@/components/skills';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SkillsPage() {
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);

  const topElementVariants = {
    hidden: { opacity: 0, y: -60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'tween' as const, ease: 'easeOut' as const, duration: 0.8 },
    },
  };

  return (
    <div className="relative flex h-screen flex-col bg-gradient-to-b from-white to-neutral-50 px-4 dark:from-neutral-900 dark:to-neutral-950 overflow-hidden">
      {/* Big blurred vertical text on left wall */}
      <motion.div
        className="pointer-events-none absolute left-4 top-0 bottom-0 z-0 flex items-center overflow-visible"
        variants={topElementVariants}
        initial="hidden"
        animate="visible"
      >
        <div
          className="bg-gradient-to-b from-neutral-400/70 via-neutral-400/60 to-neutral-400/50 bg-clip-text text-[8vw] leading-none font-black text-transparent select-none sm:text-[9vw] md:text-[10vw] lg:text-[11vw] xl:text-[12vw] 2xl:text-[13vw] dark:from-neutral-400/10 dark:via-neutral-400/8 dark:to-neutral-400/5"
          style={{
            writingMode: 'vertical-rl',
            WebkitTextStroke: '1px rgba(255, 255, 255, 0.3)',
          }}
        >
          Skills
        </div>
      </motion.div>

      {/* Skills Icons - vertically centered */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center">
        <Skills />
      </div>

      {/* Navigation - pinned to bottom */}
      <div className="relative z-10 mx-auto w-full max-w-6xl shrink-0 pb-3 sm:pb-5">
        <NavigationPrompt
          showQuick={showQuickQuestions}
          onToggleQuick={() => setShowQuickQuestions(prev => !prev)}
        />
      </div>
    </div>
  );
}
