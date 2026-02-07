import { TILE_SIZE } from '../../constants';
import { createOffscreenCanvas } from './shared';

type Direction = 'up' | 'down' | 'left' | 'right';

export function getNpcSprite(type: string, direction: Direction, frame: number) {
  const canvas = createOffscreenCanvas(TILE_SIZE, TILE_SIZE);
  const ctx = canvas.getContext('2d')!;

  const bounce = frame === 1 ? -1 : 0;
  const skin = '#ffdbac';
  const outline = '#0f172a';

  // Body outline
  ctx.fillStyle = outline;
  ctx.fillRect(7, 13 + bounce, 18, 16);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(8, 14 + bounce, 16, 14);

  // Head
  ctx.fillStyle = outline;
  ctx.fillRect(10, 3 + bounce, 12, 12);
  ctx.fillStyle = skin;
  ctx.fillRect(11, 4 + bounce, 10, 10);
  if (direction !== 'up') {
    ctx.fillStyle = '#f1f5f9';
    const eyeX = direction === 'left' ? 12 : direction === 'right' ? 18 : 13;
    ctx.fillRect(eyeX, 7 + bounce, 2, 2);
  }

  if (type.includes('weapon')) ctx.fillStyle = '#f59e0b';
  else if (type.includes('armor')) ctx.fillStyle = '#94a3b8';
  else ctx.fillStyle = '#60a5fa';

  ctx.fillRect(8, 4 + bounce, 16, 2);
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(8, 24 + bounce, 16, 2);

  return canvas;
}
