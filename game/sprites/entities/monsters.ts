import { TILE_SIZE } from '../../../constants';
import { createOffscreenCanvas } from '../shared';

type Direction = 'up' | 'down' | 'left' | 'right';

const MONSTER_COLORS: Record<string, { body: string; shade: string }> = {
  Rat: { body: '#64748b', shade: '#475569' },
  Goblin: { body: '#166534', shade: '#14532d' },
  Skeleton: { body: '#e5e7eb', shade: '#9ca3af' },
  Wolf: { body: '#78350f', shade: '#4b2f18' },
  Orc: { body: '#166534', shade: '#0f3d1f' },
  Demon: { body: '#7f1d1d', shade: '#450a0a' },
  Bat: { body: '#0f172a', shade: '#1f2937' },
};

export function getMonsterSprite(type: string, direction: Direction, frame: number, isHit: boolean) {
  const canvas = createOffscreenCanvas(TILE_SIZE, TILE_SIZE);
  const ctx = canvas.getContext('2d')!;
  const bounce = frame === 1 ? -1 : 0;

  if (isHit) { ctx.globalAlpha = 0.6; ctx.fillStyle = '#ff0000'; }

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.ellipse(16, 30, 10, 3, 0, 0, Math.PI * 2); ctx.fill();

  const colors = MONSTER_COLORS[type] ?? { body: '#166534', shade: '#0f3d1f' };
  const outline = '#0f172a';

  // Body blob
  ctx.fillStyle = outline;
  ctx.fillRect(8, 12 + bounce, 16, 14);
  ctx.fillStyle = colors.body;
  ctx.fillRect(9, 13 + bounce, 14, 12);
  ctx.fillStyle = colors.shade;
  ctx.fillRect(10, 16 + bounce, 8, 6);

  // Head
  ctx.fillStyle = outline;
  ctx.fillRect(10, 6 + bounce, 12, 8);
  ctx.fillStyle = colors.body;
  ctx.fillRect(11, 7 + bounce, 10, 6);

  if (direction === 'down') {
    ctx.fillStyle = '#111827';
    ctx.fillRect(12, 9 + bounce, 2, 2);
    ctx.fillRect(18, 9 + bounce, 2, 2);
  } else if (direction === 'left' || direction === 'right') {
    const eyeX = direction === 'left' ? 12 : 18;
    ctx.fillStyle = '#111827';
    ctx.fillRect(eyeX, 9 + bounce, 2, 2);
  }

  return canvas;
}

export function getMonsterDeadSprite(type: string) {
  const canvas = createOffscreenCanvas(TILE_SIZE, TILE_SIZE);
  const ctx = canvas.getContext('2d')!;
  const colors = MONSTER_COLORS[type] ?? { body: '#166534', shade: '#0f3d1f' };
  const outline = '#0f172a';

  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath(); ctx.ellipse(16, 28, 10, 3, 0, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = outline;
  ctx.fillRect(6, 16, 20, 8);
  ctx.fillStyle = colors.shade;
  ctx.fillRect(7, 17, 18, 6);

  ctx.fillStyle = outline;
  ctx.fillRect(6, 12, 8, 6);
  ctx.fillStyle = colors.body;
  ctx.fillRect(7, 13, 6, 4);
  ctx.fillStyle = '#111827';
  ctx.fillText('x', 8, 16);
  ctx.fillText('x', 11, 16);

  return canvas;
}
