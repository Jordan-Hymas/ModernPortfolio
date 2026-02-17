'use client';

import { useEffect, useState } from 'react';

export type WindowsViewportDensity = 'default' | 'compact' | 'tight';

interface ViewportState {
  width: number;
  height: number;
  isWindows: boolean;
}

const DEFAULT_VIEWPORT: ViewportState = {
  width: 0,
  height: 0,
  isWindows: false,
};

const getDensity = ({ width, height, isWindows }: ViewportState): WindowsViewportDensity => {
  if (!isWindows || width === 0 || height === 0) {
    return 'default';
  }

  if (height <= 760 || (height <= 820 && width <= 1366)) {
    return 'tight';
  }

  if (height <= 840 || (height <= 900 && width <= 1440)) {
    return 'compact';
  }

  return 'default';
};

export function useWindowsViewportDensity() {
  const [viewport, setViewport] = useState<ViewportState>(DEFAULT_VIEWPORT);

  useEffect(() => {
    const update = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        isWindows: /Windows/i.test(window.navigator.userAgent),
      });
    };

    update();
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('resize', update);
    };
  }, []);

  const density = getDensity(viewport);

  return {
    density,
    isWindows: viewport.isWindows,
    isCompact: density === 'compact' || density === 'tight',
    isTight: density === 'tight',
    width: viewport.width,
    height: viewport.height,
  };
}
