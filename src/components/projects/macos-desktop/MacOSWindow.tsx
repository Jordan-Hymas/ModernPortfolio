'use client';

import { motion } from 'framer-motion';
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

  return (
    <>
      {/* Drag constraints container (invisible, full screen) */}
      <div ref={dragConstraintsRef} className="fixed inset-0 pointer-events-none" />

      <motion.div
        drag
        dragConstraints={dragConstraintsRef}
        dragElastic={0}
        dragMomentum={false}
        initial={{ x: initialPosition.x, y: initialPosition.y, opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        onMouseDown={onFocus}
        className="fixed bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl overflow-hidden"
        style={{
          zIndex,
          width: '900px',
          maxWidth: '90vw',
          height: '700px',
          maxHeight: '85vh',
        }}
      >
        {/* Title Bar */}
        <div className="h-12 bg-[#303030] flex items-center justify-between px-4 cursor-grab active:cursor-grabbing select-none">
          {/* Window Control Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-3 h-3 rounded-full bg-[#FF5F56] hover:bg-[#FF3B30] transition-colors"
              aria-label="Close"
            />
            <button
              className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:bg-[#FFB000] transition-colors"
              aria-label="Minimize"
            />
            <button
              className="w-3 h-3 rounded-full bg-[#27C93F] hover:bg-[#00D600] transition-colors"
              aria-label="Maximize"
            />
          </div>

          {/* Window Title */}
          <div className="absolute left-1/2 -translate-x-1/2 text-white text-sm font-medium">
            {title}
          </div>

          <div /> {/* Spacer for flexbox */}
        </div>

        {/* Window Content */}
        <div className="h-[calc(100%-3rem)] overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
          {children}
        </div>
      </motion.div>
    </>
  );
}
