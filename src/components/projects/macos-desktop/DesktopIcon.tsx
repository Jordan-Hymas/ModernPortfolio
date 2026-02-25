'use client';

import { motion, useMotionValue } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { DesktopIconData } from './types';

interface DesktopIconProps {
  icon: DesktopIconData;
  onOpen: () => void;
  onPositionChange?: (id: string, x: number, y: number) => void;
}

export function DesktopIcon({ icon, onOpen, onPositionChange }: DesktopIconProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartTime = useRef(0);

  // Default size if not specified
  const iconSize = icon.size || { width: 80, height: 80 };
  const maxDimension = Math.max(iconSize.width, iconSize.height);
  const x = useMotionValue(icon.position.x - maxDimension / 2);
  const y = useMotionValue(icon.position.y - maxDimension / 2);

  useEffect(() => {
    x.set(icon.position.x - maxDimension / 2);
    y.set(icon.position.y - maxDimension / 2);
  }, [icon.position.x, icon.position.y, maxDimension, x, y]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => {
        setIsDragging(true);
        dragStartTime.current = Date.now();
      }}
      onDragEnd={(_, info) => {
        const dragDistance = Math.hypot(info.offset.x, info.offset.y);
        const dragDuration = Date.now() - dragStartTime.current;

        const finalPos = {
          x: x.get() + maxDimension / 2,
          y: y.get() + maxDimension / 2,
        };
        onPositionChange?.(icon.id, finalPos.x, finalPos.y);

        // Only open if it was a very short click-like action (not a real drag)
        if (dragDuration < 200 && dragDistance < 5) {
          onOpen();
        }

        // Small delay before allowing clicks again
        setTimeout(() => setIsDragging(false), 100);
      }}
      onClick={(e) => {
        // Single click to open (only if not dragging)
        if (!isDragging) {
          e.stopPropagation();
          onOpen();
        }
      }}
      style={{
        position: 'absolute',
        zIndex: 3,
        width: `${maxDimension}px`,
        x,
        y,
      }}
      whileHover={{ scale: 1.05 }}
      whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
      className="flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing select-none"
    >
      {/* Icon Image */}
      <div
        className="overflow-hidden shadow-lg border-2 border-white/20 pointer-events-none"
        style={{ width: `${iconSize.width}px`, height: `${iconSize.height}px` }}
      >
        <Image
          src={icon.icon}
          alt={icon.title}
          width={iconSize.width}
          height={iconSize.height}
          sizes="80px"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Icon Label */}
      <span
        className="text-xs text-black dark:text-white font-medium text-center px-1 py-0.5 rounded break-words pointer-events-none leading-tight"
        style={{ maxWidth: `${Math.max(maxDimension + 20, 120)}px` }}
      >
        {icon.title}
      </span>
    </motion.div>
  );
}
