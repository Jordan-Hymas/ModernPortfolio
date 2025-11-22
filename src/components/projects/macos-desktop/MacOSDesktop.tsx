'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { DesktopIcon } from './DesktopIcon';
import { MacOSWindow } from './MacOSWindow';
import { DesktopDock } from './DesktopDock';
import { INITIAL_DESKTOP_ICONS, WINDOW_Z_INDEX_START, calculateIconPositions } from './constants';
import { DesktopIconData, OpenWindow } from './types';
import { data as projectsData } from '../Data';
import NavigationPrompt from '@/components/navigation-prompt';

export function MacOSDesktop() {
  // Icons with responsive positions
  const [icons, setIcons] = useState<DesktopIconData[]>(INITIAL_DESKTOP_ICONS);
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [nextZIndex, setNextZIndex] = useState(WINDOW_Z_INDEX_START);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);

  // Calculate icon positions based on viewport size and handle resize
  useEffect(() => {
    const updateIconPositions = () => {
      const newPositions = calculateIconPositions(window.innerWidth, window.innerHeight);
      setIcons(newPositions);
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
          prev.map((w) =>
            w.id === icon.id ? { ...w, zIndex: nextZIndex } : w
          )
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

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Desktop Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/templateMe.avif)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Desktop Icons */}
      {icons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          icon={icon}
          onOpen={(position) => handleIconOpen(icon, position)}
          onPositionChange={handleIconPositionChange}
        />
      ))}

      {/* Open Windows */}
      <AnimatePresence>
        {openWindows.map((window) => {
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

      {/* Dock */}
      <DesktopDock showQuickQuestions={showQuickQuestions} />

      {/* Navigation Section - Positioned below dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-6">
        <div className="mx-auto w-full max-w-6xl">
          <NavigationPrompt
            showQuick={showQuickQuestions}
            onToggleQuick={() => setShowQuickQuestions(prev => !prev)}
          />
        </div>
      </div>
    </div>
  );
}
