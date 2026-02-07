import { ClassType } from '../../../types';
import { TILE_SIZE } from '../../../constants';
import { createOffscreenCanvas } from '../shared';

type Direction = 'up' | 'down' | 'left' | 'right';

interface Palette {
  body: string;
  bodyShade: string;
  accent: string;
  accentShade: string;
}

const PALETTES: Record<ClassType, Palette> = {
  [ClassType.WARRIOR]: { body: '#ef4444', bodyShade: '#991b1b', accent: '#94a3b8', accentShade: '#475569' },
  [ClassType.MAGE]: { body: '#4c1d95', bodyShade: '#312e81', accent: '#7c3aed', accentShade: '#5b21b6' },
  [ClassType.ELF]: { body: '#064e3b', bodyShade: '#065f46', accent: '#fde68a', accentShade: '#f59e0b' },
};

function drawHead(ctx: CanvasRenderingContext2D, direction: Direction, bounce: number) {
  const skin = '#ffdbac';
  const outline = '#0f172a';

  // Head base
  ctx.fillStyle = outline;
  ctx.fillRect(10, 4 + bounce, 12, 12);
  ctx.fillStyle = skin;
  ctx.fillRect(11, 5 + bounce, 10, 10);

  if (direction === 'down') {
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(12, 9 + bounce, 2, 2);
    ctx.fillRect(18, 9 + bounce, 2, 2);
    ctx.fillRect(15, 12 + bounce, 2, 1);
  } else if (direction === 'left' || direction === 'right') {
    const eyeX = direction === 'left' ? 12 : 18;
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(eyeX, 9 + bounce, 2, 2);
    ctx.fillRect(eyeX + (direction === 'left' ? -1 : 1), 12 + bounce, 1, 1);
  }
}

function drawBody(ctx: CanvasRenderingContext2D, direction: Direction, bounce: number, palette: Palette) {
  const outline = '#0f172a';
  const bodyY = 14 + bounce;

  // Torso
  ctx.fillStyle = outline;
  ctx.fillRect(8, bodyY, 16, 14);
  ctx.fillStyle = palette.body;
  ctx.fillRect(9, bodyY + 1, 14, 12);
  ctx.fillStyle = palette.bodyShade;
  ctx.fillRect(10, bodyY + 2, 4, 4);
  ctx.fillRect(18, bodyY + 2, 3, 8);

  // Belt / accent
  ctx.fillStyle = palette.accent;
  ctx.fillRect(10, bodyY + 7, 12, 2);
  ctx.fillStyle = palette.accentShade;
  ctx.fillRect(12, bodyY + 8, 8, 1);

  // Arms (no weapons)
  if (direction === 'down') {
    ctx.fillStyle = palette.bodyShade;
    ctx.fillRect(7, bodyY + 3, 2, 7);
    ctx.fillRect(23, bodyY + 3, 2, 7);
  } else if (direction === 'up') {
    ctx.fillStyle = palette.bodyShade;
    ctx.fillRect(7, bodyY + 2, 2, 6);
    ctx.fillRect(23, bodyY + 2, 2, 6);
  } else {
    const armX = direction === 'left' ? 7 : 23;
    ctx.fillStyle = palette.bodyShade;
    ctx.fillRect(armX, bodyY + 4, 2, 7);
  }
}

function drawLegs(ctx: CanvasRenderingContext2D, direction: Direction, bounce: number, palette: Palette, frame: number) {
  const outline = '#0f172a';
  const legY = 24 + bounce;
  const step = frame === 1 ? 1 : 0;

  ctx.fillStyle = outline;
  ctx.fillRect(10, legY, 4, 6);
  ctx.fillRect(18, legY, 4, 6);

  ctx.fillStyle = palette.accentShade;
  ctx.fillRect(11, legY + 1 + step, 2, 4);
  ctx.fillRect(19, legY + 1 + (frame === 1 ? 0 : 1), 2, 4);

  if (direction === 'left') {
    ctx.fillRect(10, legY + 5, 4, 1);
  } else if (direction === 'right') {
    ctx.fillRect(18, legY + 5, 4, 1);
  }
}

export function getPlayerSprite(classType: ClassType, direction: Direction, frame: number, isHit: boolean) {
  const canvas = createOffscreenCanvas(TILE_SIZE, TILE_SIZE);
  const ctx = canvas.getContext('2d')!;
  const bounce = frame === 1 ? -1 : 0;

  if (isHit) { ctx.globalAlpha = 0.6; ctx.fillStyle = '#ff0000'; }

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.ellipse(16, 30, 10, 3, 0, 0, Math.PI * 2); ctx.fill();

  const palette = PALETTES[classType];
  if (direction === 'up') drawHead(ctx, direction, bounce);
  drawBody(ctx, direction, bounce, palette);
  drawLegs(ctx, direction, bounce, palette, frame);
  if (direction !== 'up') drawHead(ctx, direction, bounce);

  return canvas;
}

export function getPlayerSleepingSprite(classType: ClassType) {
  const canvas = createOffscreenCanvas(TILE_SIZE, TILE_SIZE);
  const ctx = canvas.getContext('2d')!;
  const palette = PALETTES[classType];

  // Body lying down
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath(); ctx.ellipse(16, 28, 10, 3, 0, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(6, 16, 20, 8);
  ctx.fillStyle = palette.body;
  ctx.fillRect(7, 17, 18, 6);
  ctx.fillStyle = palette.accent;
  ctx.fillRect(10, 19, 12, 2);

  // Head on pillow
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(6, 12, 8, 6);
  ctx.fillStyle = '#ffdbac';
  ctx.fillRect(7, 13, 6, 4);

  // Zzz text
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 8px Courier New';
  ctx.fillText('zZz', 16, 8);

  return canvas;
}

export function getPlayerDeadSprite(classType: ClassType) {
  const canvas = createOffscreenCanvas(TILE_SIZE, TILE_SIZE);
  const ctx = canvas.getContext('2d')!;
  const palette = PALETTES[classType];

  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath(); ctx.ellipse(16, 28, 10, 3, 0, 0, Math.PI * 2); ctx.fill();

  // Body
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(6, 16, 20, 8);
  ctx.fillStyle = palette.bodyShade;
  ctx.fillRect(7, 17, 18, 6);

  // Head with X eyes
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(6, 12, 8, 6);
  ctx.fillStyle = '#ffdbac';
  ctx.fillRect(7, 13, 6, 4);
  ctx.fillStyle = '#111827';
  ctx.fillText('x', 8, 16);
  ctx.fillText('x', 11, 16);

  return canvas;
}
