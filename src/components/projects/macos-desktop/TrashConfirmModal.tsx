'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Image from 'next/image';

interface TrashConfirmModalProps {
  variant: 'empty' | 'delete';
  disabled?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function TrashConfirmModal({ variant, disabled, onCancel, onConfirm }: TrashConfirmModalProps) {
  // ESC to cancel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !disabled) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel, disabled]);

  const isDelete = variant === 'delete';

  return (
    <motion.div
      key={variant}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget && !disabled) onCancel();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative bg-white/70 dark:bg-neutral-800/80 backdrop-blur-2xl rounded-2xl border border-white/30 dark:border-neutral-700/40 shadow-2xl w-[280px] overflow-hidden"
      >
        {/* Content */}
        <div className="flex flex-col items-center px-6 pt-6 pb-4">
          {/* Trash icon */}
          <div className="w-16 h-16 mb-3">
            <Image
              src="/Projects/Dock/trashcan.webp"
              alt="Trash"
              width={96}
              height={96}
              quality={100}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Title */}
          <h2 className="text-[15px] font-semibold text-neutral-900 dark:text-white mb-1">
            {isDelete ? 'Delete this page?' : 'Empty Trash?'}
          </h2>

          {/* Description */}
          <p className="text-[12px] text-neutral-500 dark:text-neutral-400 text-center leading-relaxed">
            {isDelete
              ? 'This will temporarily remove the Projects page for 5 seconds.'
              : 'Are you sure you want to empty the trash? This will remove items from view.'}
          </p>
        </div>

        {/* Buttons */}
        <div className="border-t border-neutral-200/60 dark:border-neutral-700/50 flex">
          <button
            onClick={onCancel}
            disabled={disabled}
            className="flex-1 py-2.5 text-[14px] text-blue-500 dark:text-blue-400 font-normal hover:bg-white/40 dark:hover:bg-neutral-700/40 transition-colors disabled:opacity-40 border-r border-neutral-200/60 dark:border-neutral-700/50"
          >
            {isDelete ? 'Restore' : 'Cancel'}
          </button>
          <button
            onClick={onConfirm}
            disabled={disabled}
            className={`flex-1 py-2.5 text-[14px] font-semibold transition-colors disabled:opacity-40 ${
              isDelete
                ? 'text-red-500 dark:text-red-400 hover:bg-red-500/10'
                : 'text-blue-500 dark:text-blue-400 hover:bg-white/40 dark:hover:bg-neutral-700/40'
            }`}
          >
            {isDelete ? 'Delete' : 'Empty Trash'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
