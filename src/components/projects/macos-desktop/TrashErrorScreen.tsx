'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface TrashErrorScreenProps {
  visible: boolean;
  fullScreen: boolean;
}

export function TrashErrorScreen({ visible, fullScreen }: TrashErrorScreenProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[190] flex flex-col items-center justify-center bg-black"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold text-red-500/80 mb-4"
          >
            404
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="font-mono text-lg sm:text-xl text-red-500/60 mb-6"
          >
            Page Not Found
          </motion.div>

          {fullScreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="font-mono text-sm text-neutral-500"
            >
              Temporarily removed. Restoring shortly&hellip;
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
