'use client';

import { motion, useDragControls } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface MacOSWindowProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  onFocus: () => void;
  zIndex: number;
  initialPosition?: { x: number; y: number };
}

export function MacOSWindow({
  title,
  children,
  onClose,
  onFocus,
  zIndex,
  initialPosition = { x: 100, y: 50 },
}: MacOSWindowProps) {
  const dragConstraintsRef = useRef(null);
  const dragControls = useDragControls();

  return (
    <>
      {/* Drag constraints container (invisible, full screen) */}
      <div ref={dragConstraintsRef} className="fixed inset-0 pointer-events-none" />

      <motion.div
        drag
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={dragConstraintsRef}
        dragElastic={0}
        dragMomentum={false}
        initial={{ x: initialPosition.x, y: initialPosition.y, opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        onMouseDown={onFocus}
        className="fixed overflow-hidden rounded-lg border border-black/45 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-white/20"
        style={{
          zIndex,
          width: '900px',
          maxWidth: '90vw',
          height: '700px',
          maxHeight: '85vh',
        }}
      >
        {/* Title Bar */}
        <div
          className="h-10 bg-white dark:bg-neutral-800 flex items-center px-4 cursor-grab active:cursor-grabbing select-none border-b border-neutral-300 dark:border-neutral-700"
          onPointerDown={(e) => dragControls.start(e)}
        >
          {/* Window Control Buttons and Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0">
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="flex h-5 w-5 items-center justify-center rounded-full"
                aria-label="Close"
              >
                <span className="h-3 w-3 rounded-full bg-[#FF5F56] transition-colors hover:bg-[#FF3B30]" />
              </button>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                className="flex h-5 w-5 items-center justify-center rounded-full"
                aria-label="Minimize"
              >
                <span className="h-3 w-3 rounded-full bg-[#FFBD2E] transition-colors hover:bg-[#FFB000]" />
              </button>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                className="flex h-5 w-5 items-center justify-center rounded-full"
                aria-label="Maximize"
              >
                <span className="h-3 w-3 rounded-full bg-[#27C93F] transition-colors hover:bg-[#00D600]" />
              </button>
            </div>

            {/* Window Title */}
            <div className="text-neutral-700 dark:text-neutral-200 text-sm font-medium">
              {title}
            </div>
          </div>
        </div>

        {/* Window Content */}
        <div className="h-[calc(100%-2.5rem)] overflow-hidden">
          {children}
        </div>
      </motion.div>
    </>
  );
}
