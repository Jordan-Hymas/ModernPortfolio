import { DockIcon, DesktopIconData } from './types';

// Icon data with metadata - positions will be calculated relative to viewport center
interface IconConfig {
  id: string;
  title: string;
  projectIndex: number;
  icon: string;
  size: { width: number; height: number };
  // Offset from center of viewport (these stay constant)
  offsetFromCenter: { x: number; y: number };
}

// Reference viewport size used for the design (based on your screenshot)
const REFERENCE_WIDTH = 1200;
const REFERENCE_HEIGHT = 800;
const REFERENCE_CENTER_X = REFERENCE_WIDTH / 2;
const REFERENCE_CENTER_Y = REFERENCE_HEIGHT / 2;

// Icon configurations with offsets from center
// These offsets are calculated from the original fixed positions, adjusted upward for dock spacing
const VERTICAL_ADJUSTMENT = -220; // Move all icons up by 220px
const SPACING_MULTIPLIER = 1.2; // Increase spacing between icons by 20%

export const ICON_CONFIGS: IconConfig[] = [
  { id: 'synto', title: 'Synto', projectIndex: 0, icon: '/syntopreview.png', size: { width: 85, height: 85 }, offsetFromCenter: { x: (360 - REFERENCE_CENTER_X) * SPACING_MULTIPLIER, y: (340 - REFERENCE_CENTER_Y) * SPACING_MULTIPLIER + VERTICAL_ADJUSTMENT } },
  { id: 'rrate', title: 'Rrate', projectIndex: 1, icon: '/ratepreview.png', size: { width: 70, height: 90 }, offsetFromCenter: { x: (530 - REFERENCE_CENTER_X) * SPACING_MULTIPLIER, y: (500 - REFERENCE_CENTER_Y) * SPACING_MULTIPLIER + VERTICAL_ADJUSTMENT } },
  { id: 'defai', title: 'Defai', projectIndex: 2, icon: '/defaipreview.png', size: { width: 75, height: 75 }, offsetFromCenter: { x: (600 - REFERENCE_CENTER_X) * SPACING_MULTIPLIER, y: (240 - REFERENCE_CENTER_Y) * SPACING_MULTIPLIER + VERTICAL_ADJUSTMENT } },
  { id: 'fitgear', title: 'Frigear', projectIndex: 3, icon: '/fitgearpreview.png', size: { width: 95, height: 70 }, offsetFromCenter: { x: (755 - REFERENCE_CENTER_X) * SPACING_MULTIPLIER, y: (460 - REFERENCE_CENTER_Y) * SPACING_MULTIPLIER + VERTICAL_ADJUSTMENT } },
  { id: 'datai', title: 'Datai', projectIndex: 4, icon: '/dataipreview.png', size: { width: 80, height: 95 }, offsetFromCenter: { x: (880 - REFERENCE_CENTER_X) * SPACING_MULTIPLIER, y: (280 - REFERENCE_CENTER_Y) * SPACING_MULTIPLIER + VERTICAL_ADJUSTMENT } },
  { id: '3dpong', title: '3D Pong', projectIndex: 5, icon: '/transcendancepreview.png', size: { width: 65, height: 65 }, offsetFromCenter: { x: (315 - REFERENCE_CENTER_X) * SPACING_MULTIPLIER, y: (600 - REFERENCE_CENTER_Y) * SPACING_MULTIPLIER + VERTICAL_ADJUSTMENT } },
  { id: 'minishell', title: 'Minishell', projectIndex: 6, icon: '/minishellpreview.png', size: { width: 90, height: 75 }, offsetFromCenter: { x: (555 - REFERENCE_CENTER_X) * SPACING_MULTIPLIER, y: (700 - REFERENCE_CENTER_Y) * SPACING_MULTIPLIER + VERTICAL_ADJUSTMENT } },
  { id: 'youbot', title: 'YouBot', projectIndex: 7, icon: '/youbotpreview.png', size: { width: 70, height: 85 }, offsetFromCenter: { x: (950 - REFERENCE_CENTER_X) * SPACING_MULTIPLIER, y: (545 - REFERENCE_CENTER_Y) * SPACING_MULTIPLIER + VERTICAL_ADJUSTMENT } },
  { id: 'oldportfolio', title: 'Old Portfo...', projectIndex: 8, icon: '/oldportfoliopreview.png', size: { width: 80, height: 80 }, offsetFromCenter: { x: (815 - REFERENCE_CENTER_X) * SPACING_MULTIPLIER, y: (700 - REFERENCE_CENTER_Y) * SPACING_MULTIPLIER + VERTICAL_ADJUSTMENT } },
];

// Helper function to calculate icon positions based on current viewport
export const calculateIconPositions = (viewportWidth: number, viewportHeight: number): DesktopIconData[] => {
  const centerX = viewportWidth / 2;
  const centerY = viewportHeight / 2;

  return ICON_CONFIGS.map((config) => ({
    id: config.id,
    title: config.title,
    projectIndex: config.projectIndex,
    icon: config.icon,
    size: config.size,
    position: {
      x: centerX + config.offsetFromCenter.x,
      y: centerY + config.offsetFromCenter.y,
    },
  }));
};

// Initial positions (fallback for SSR)
export const INITIAL_DESKTOP_ICONS: DesktopIconData[] = calculateIconPositions(REFERENCE_WIDTH, REFERENCE_HEIGHT);

// Legacy fallback (kept for backwards compatibility)
export const DEFAULT_ICON_POSITIONS: DesktopIconData[] = INITIAL_DESKTOP_ICONS;

// Dock icons configuration
export const DOCK_ICONS: DockIcon[] = [
  { id: 'github', icon: '', label: 'GitHub', href: '#' },
  { id: 'tiktok', icon: '', label: 'TikTok', href: '#' },
  { id: 'instagram', icon: '', label: 'Instagram', href: '#' },
  { id: 'notes', icon: '', label: 'Notes', href: '#', separator: true },
  { id: 'photos', icon: '', label: 'Photos', href: '#' },
  { id: 'email', icon: '', label: 'Mail', href: '#' },
  { id: 'trash', icon: '🗑️', label: 'Trash', href: '#', separator: true },
];

export const WINDOW_INITIAL_POSITION = { x: 100, y: 50 };
export const WINDOW_Z_INDEX_START = 10;
