'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DesktopIcon } from './DesktopIcon';
import { MacOSWindow } from './MacOSWindow';
import { DesktopDock } from './DesktopDock';
import {
  INITIAL_DESKTOP_ICONS,
  WINDOW_Z_INDEX_START,
  calculateIconPositions,
} from './constants';
import { DesktopIconData, OpenWindow } from './types';
import { data as projectsData } from '../Data';
import { NotesContent } from './NotesContent';
import { PhotosContent } from './PhotosContent';
import { useTrashInteraction } from './useTrashInteraction';
import { TrashConfirmModal } from './TrashConfirmModal';
import { TrashErrorScreen } from './TrashErrorScreen';

export function MacOSDesktop() {
  // Icons with responsive positions
  const [icons, setIcons] = useState<DesktopIconData[]>(INITIAL_DESKTOP_ICONS);
  const [viewport, setViewport] = useState({ width: 1200, height: 800 });
  const [isWindowsDevice, setIsWindowsDevice] = useState(false);
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [nextZIndex, setNextZIndex] = useState(WINDOW_Z_INDEX_START);
  const isCompactDesktop =
    isWindowsDevice &&
    (viewport.height <= 840 ||
      (viewport.height <= 900 && viewport.width <= 1440));
  const isTightDesktop =
    isWindowsDevice &&
    (viewport.height <= 760 ||
      (viewport.height <= 820 && viewport.width <= 1366));
  const dockDensity: 'default' | 'compact' | 'tight' = isTightDesktop
    ? 'tight'
    : isCompactDesktop
      ? 'compact'
      : 'default';
  const desktopIconScale = isTightDesktop ? 0.78 : isCompactDesktop ? 0.9 : 1;

  // Trash interaction state machine
  const {
    trashState,
    desktopVisible,
    trashDisabled,
    triggerTrash,
    cancelEmpty,
    confirmEmpty,
    restoreFromConfirm,
    confirmDelete,
  } = useTrashInteraction();

  // Animation variants for Projects title
  const topElementVariants = {
    hidden: { opacity: 0, y: -60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'tween' as const,
        ease: 'easeOut' as const,
        duration: 0.8,
      },
    },
  };

  // Calculate icon positions based on viewport size, handle resize, and quick questions state
  useEffect(() => {
    const updateIconPositions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const windowsDevice = /Windows/i.test(window.navigator.userAgent);
      const compact =
        windowsDevice && (height <= 840 || (height <= 900 && width <= 1440));
      const tight =
        windowsDevice && (height <= 760 || (height <= 820 && width <= 1366));

      setViewport({ width, height });
      setIsWindowsDevice(windowsDevice);
      const newPositions = calculateIconPositions(
        width,
        height
      );
      const maxIconY = height - (tight ? 280 : compact ? 255 : 220);
      const spreadX = tight ? 1.16 : compact ? 1.09 : 1;
      const spreadY = tight ? 1.12 : compact ? 1.06 : 1;
      const centerX = width / 2;
      const topOffset = tight ? 10 : compact ? 6 : 0;
      setIcons(
        newPositions.map((icon) => ({
          ...icon,
          // On compact Windows viewports, gently spread icon centers so
          // spacing matches the larger-screen composition.
          ...(() => {
            const iconWidth = icon.size?.width ?? 80;
            const iconHeight = icon.size?.height ?? 80;
            const maxDimension = Math.max(iconWidth, iconHeight);

            const spreadXPos = centerX + (icon.position.x - centerX) * spreadX;
            const spreadYPos = icon.position.y * spreadY + topOffset;

            const minX = maxDimension / 2 + 8;
            const maxX = width - maxDimension / 2 - 8;
            const minY = maxDimension / 2 + 8;

            return {
              position: {
                x: Math.max(minX, Math.min(spreadXPos, maxX)),
                y: Math.max(minY, Math.min(spreadYPos, maxIconY)),
              },
            };
          })(),
        }))
      );
    };

    // Set initial positions
    updateIconPositions();

    // Add resize listener
    window.addEventListener('resize', updateIconPositions);

    return () => {
      window.removeEventListener('resize', updateIconPositions);
    };
  }, []);

  const handleIconOpen = useCallback(
    (icon: DesktopIconData, position: { x: number; y: number }) => {
      // Check if window is already open
      const existingWindow = openWindows.find((w) => w.id === icon.id);

      if (existingWindow) {
        // Bring to front
        setOpenWindows((prev) =>
          prev.map((w) => (w.id === icon.id ? { ...w, zIndex: nextZIndex } : w))
        );
        setNextZIndex((prev) => prev + 1);
      } else {
        // Open new window at icon position (offset slightly so it's not exactly on top)
        setOpenWindows((prev) => [
          ...prev,
          {
            id: icon.id,
            title: icon.title,
            projectIndex: icon.projectIndex,
            zIndex: nextZIndex,
            position: { x: position.x + 50, y: position.y - 50 }, // Offset from icon
          },
        ]);
        setNextZIndex((prev) => prev + 1);
      }
    },
    [openWindows, nextZIndex]
  );

  const handleWindowClose = useCallback((windowId: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== windowId));
  }, []);

  const handleWindowFocus = useCallback(
    (windowId: string) => {
      setOpenWindows((prev) =>
        prev.map((w) => (w.id === windowId ? { ...w, zIndex: nextZIndex } : w))
      );
      setNextZIndex((prev) => prev + 1);
    },
    [nextZIndex]
  );

  const handleIconPositionChange = useCallback(
    (iconId: string, x: number, y: number) => {
      setIcons((prev) =>
        prev.map((icon) =>
          icon.id === iconId ? { ...icon, position: { x, y } } : icon
        )
      );
    },
    []
  );

  const handleNotesClick = useCallback(() => {
    // Check if Notes window is already open
    const existingWindow = openWindows.find((w) => w.id === 'notes');

    if (existingWindow) {
      // Bring to front
      setOpenWindows((prev) =>
        prev.map((w) => (w.id === 'notes' ? { ...w, zIndex: nextZIndex } : w))
      );
      setNextZIndex((prev) => prev + 1);
    } else {
      // Open new Notes window
      setOpenWindows((prev) => [
        ...prev,
        {
          id: 'notes',
          title: 'Notes',
          projectIndex: -1, // Special value for non-project windows
          zIndex: nextZIndex,
          position: { x: 150, y: 100 },
        },
      ]);
      setNextZIndex((prev) => prev + 1);
    }
  }, [openWindows, nextZIndex]);

  const handlePhotosClick = useCallback(() => {
    // Check if Photos window is already open
    const existingWindow = openWindows.find((w) => w.id === 'photos');

    if (existingWindow) {
      // Bring to front
      setOpenWindows((prev) =>
        prev.map((w) => (w.id === 'photos' ? { ...w, zIndex: nextZIndex } : w))
      );
      setNextZIndex((prev) => prev + 1);
    } else {
      // Open new Photos window
      setOpenWindows((prev) => [
        ...prev,
        {
          id: 'photos',
          title: 'Photos',
          projectIndex: -1, // Special value for non-project windows
          zIndex: nextZIndex,
          position: { x: 200, y: 120 },
        },
      ]);
      setNextZIndex((prev) => prev + 1);
    }
  }, [openWindows, nextZIndex]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-white dark:bg-black">
      {/* Desktop Background */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat dark:opacity-80"
        style={{
          backgroundImage: 'url(/sidewaysBlackWhite.webp)',
          backgroundSize: 'contain',
          backgroundPosition: 'center center',
        }}
      />

      {/* Big blurred vertical text on left wall */}
      <motion.div
        className="pointer-events-none absolute bottom-8 left-4 z-0 overflow-visible"
        variants={topElementVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          animate={{
            opacity: desktopVisible ? 1 : 0,
            scale: desktopVisible ? desktopIconScale : desktopIconScale * 0.8,
            filter: desktopVisible ? 'blur(0px)' : 'blur(4px)',
          }}
          transition={{ duration: 0.4, delay: desktopVisible ? 0.2 : 0.5 }}
        >
          <div
            className="bg-gradient-to-b from-neutral-400/70 via-neutral-400/60 to-neutral-400/50 bg-clip-text text-[8vw] leading-none font-black text-transparent select-none sm:text-[9vw] md:text-[10vw] lg:text-[11vw] xl:text-[12vw] 2xl:text-[13vw] dark:from-neutral-400/10 dark:via-neutral-400/8 dark:to-neutral-400/5"
            style={{
              writingMode: 'vertical-rl',
              WebkitTextStroke: '1px rgba(255, 255, 255, 0.3)',
            }}
          >
            Projects
          </div>
        </motion.div>
      </motion.div>

      {/* Desktop Icons */}
      {icons.map((icon, index) => (
        <motion.div
          key={icon.id}
          animate={{
            opacity: desktopVisible ? 1 : 0,
            scale: desktopVisible ? desktopIconScale : desktopIconScale * 0.8,
            filter: desktopVisible ? 'blur(0px)' : 'blur(4px)',
          }}
          transition={{
            duration: 0.3,
            delay: desktopVisible ? index * 0.06 : index * 0.08,
          }}
          style={{ pointerEvents: desktopVisible ? 'auto' : 'none' }}
        >
          <DesktopIcon
            icon={icon}
            onOpen={(position) => handleIconOpen(icon, position)}
            onPositionChange={handleIconPositionChange}
          />
        </motion.div>
      ))}

      {/* Open Windows */}
      <motion.div
        animate={{
          opacity: desktopVisible ? 1 : 0,
          scale: desktopVisible ? 1 : 0.95,
        }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: desktopVisible ? 'auto' : 'none' }}
      >
        <AnimatePresence>
          {openWindows.map((window) => {
            // Handle special windows (like Notes and Photos)
            if (window.id === 'notes') {
              return (
                <MacOSWindow
                  key={window.id}
                  title={window.title}
                  onClose={() => handleWindowClose(window.id)}
                  onFocus={() => handleWindowFocus(window.id)}
                  zIndex={window.zIndex}
                  initialPosition={window.position}
                >
                  <NotesContent />
                </MacOSWindow>
              );
            }

            if (window.id === 'photos') {
              return (
                <MacOSWindow
                  key={window.id}
                  title={window.title}
                  onClose={() => handleWindowClose(window.id)}
                  onFocus={() => handleWindowFocus(window.id)}
                  zIndex={window.zIndex}
                  initialPosition={window.position}
                >
                  <PhotosContent />
                </MacOSWindow>
              );
            }

            // Handle project windows
            const project = projectsData[window.projectIndex];
            return (
              <MacOSWindow
                key={window.id}
                title={window.title}
                onClose={() => handleWindowClose(window.id)}
                onFocus={() => handleWindowFocus(window.id)}
                zIndex={window.zIndex}
                initialPosition={window.position}
              >
                {/* Project Content - Render the content from Data.tsx */}
                {project.content}
              </MacOSWindow>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Dock */}
      <DesktopDock
        onNotesClick={handleNotesClick}
        onPhotosClick={handlePhotosClick}
        onTrashClick={triggerTrash}
        trashVisible={desktopVisible}
        trashDisabled={trashDisabled}
        density={dockDensity}
      />

      {/* Trash Error Screen (below modals) */}
      <TrashErrorScreen
        visible={trashState === 'confirmDelete' || trashState === 'deletedTemp'}
        fullScreen={trashState === 'deletedTemp'}
      />

      {/* Trash Confirm Modals */}
      <AnimatePresence mode="wait">
        {trashState === 'confirmEmpty' && (
          <TrashConfirmModal
            variant="empty"
            onCancel={cancelEmpty}
            onConfirm={confirmEmpty}
          />
        )}
        {trashState === 'confirmDelete' && (
          <TrashConfirmModal
            variant="delete"
            onCancel={restoreFromConfirm}
            onConfirm={confirmDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
