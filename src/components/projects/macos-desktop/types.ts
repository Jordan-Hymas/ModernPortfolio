export interface Position {
  x: number;
  y: number;
}

export interface DesktopIconData {
  id: string;
  title: string;
  icon: string;
  position: Position;
  projectIndex: number;
  size?: { width: number; height: number };
}

export interface OpenWindow {
  id: string;
  title: string;
  projectIndex: number;
  zIndex: number;
  position?: Position;
}

export interface DockIcon {
  id: string;
  icon: string;
  label: string;
  href?: string;
  separator?: boolean; // If true, add a divider before this icon
}
