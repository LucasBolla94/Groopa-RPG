import { TILE_SIZE } from '../../../constants';
import { createOffscreenCanvas } from '../shared';

export function getInteractiveSprite(type: 'door' | 'chest' | 'bed' | 'fountain' | 'stall', isOpen: boolean = false): HTMLCanvasElement {
  const canvas = createOffscreenCanvas(TILE_SIZE, TILE_SIZE);
  const ctx = canvas.getContext('2d')!;

  if (type === 'door') {
    ctx.fillStyle = '#451a03';
    if (!isOpen) {
      ctx.fillRect(4, 0, 24, TILE_SIZE);
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath(); ctx.arc(22, 16, 2, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillRect(4, 0, 4, TILE_SIZE);
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(8, 0, 20, TILE_SIZE);
    }
  } else if (type === 'fountain') {
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath(); ctx.arc(16, 16, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath(); ctx.arc(16, 16, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillRect(12, 12, 4, 4);
  } else if (type === 'stall') {
    ctx.fillStyle = '#78350f';
    ctx.fillRect(2, 20, 28, 10);
    ctx.fillStyle = '#ef4444'; ctx.fillRect(2, 2, 28, 8);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(2, 10, 28, 4);
    ctx.fillStyle = '#ef4444'; ctx.fillRect(2, 14, 28, 4);
  } else if (type === 'chest') {
    ctx.fillStyle = '#b45309'; ctx.fillRect(4, 10, 24, 18);
    ctx.fillStyle = '#fbbf24'; ctx.fillRect(14, 18, 4, 4);
  } else if (type === 'bed') {
    ctx.fillStyle = '#451a03'; ctx.fillRect(2, 8, 28, 22);
    ctx.fillStyle = '#f1f5f9'; ctx.fillRect(4, 14, 24, 14);
    ctx.fillStyle = '#cbd5e1'; ctx.fillRect(6, 10, 20, 6);
  }

  return canvas;
}
