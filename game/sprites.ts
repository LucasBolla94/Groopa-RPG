
import { TileType, ClassType } from '../types';
import { TILE_SIZE, COLORS } from '../constants';

const spriteCache: Record<string, HTMLCanvasElement> = {};

function createOffscreenCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function getTileSprite(type: TileType): HTMLCanvasElement {
  const key = `tile_v10_${type}`;
  if (spriteCache[key]) return spriteCache[key];

  const canvas = createOffscreenCanvas(TILE_SIZE, TILE_SIZE);
  const ctx = canvas.getContext('2d')!;
  
  let baseColor = COLORS.GRASS;
  if (type === TileType.DIRT) baseColor = COLORS.DIRT;
  if (type === TileType.STONE) baseColor = '#5e60ce';
  if (type === TileType.WATER) baseColor = COLORS.WATER;
  if (type === TileType.SAND) baseColor = COLORS.SAND;
  if (type === TileType.FOREST) baseColor = COLORS.FOREST;
  if (type === TileType.WALL) baseColor = '#334155'; // Darker Slate
  if (type === TileType.FLOOR_WOOD) baseColor = '#451a03';

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

  // Detalhes extras por tipo
  if (type === TileType.GRASS) {
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(4, 4, 2, 2); ctx.fillRect(20, 18, 2, 2);
  } else if (type === TileType.STONE) {
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.strokeRect(2, 2, TILE_SIZE-4, TILE_SIZE-4);
  } else if (type === TileType.WALL) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, TILE_SIZE, 4);
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(4, 8, 24, 8);
  } else if (type === TileType.WATER) {
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(8, 8, 16, 2);
  }

  spriteCache[key] = canvas;
  return canvas;
}

export function getInteractiveSprite(type: 'door' | 'chest' | 'bed' | 'fountain' | 'stall', isOpen: boolean = false): HTMLCanvasElement {
    const key = `inter_v2_${type}_${isOpen}`;
    if (spriteCache[key]) return spriteCache[key];

    const canvas = createOffscreenCanvas(TILE_SIZE, TILE_SIZE);
    const ctx = canvas.getContext('2d')!;

    if (type === 'door') {
        ctx.fillStyle = '#451a03';
        if (!isOpen) {
            ctx.fillRect(4, 0, 24, TILE_SIZE);
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.arc(22, 16, 2, 0, Math.PI*2); ctx.fill();
        } else {
            ctx.fillRect(4, 0, 4, TILE_SIZE);
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.fillRect(8, 0, 20, TILE_SIZE);
        }
    } else if (type === 'fountain') {
        // Base de pedra
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath(); ctx.arc(16, 16, 14, 0, Math.PI*2); ctx.fill();
        // Água
        ctx.fillStyle = '#0ea5e9';
        ctx.beginPath(); ctx.arc(16, 16, 10, 0, Math.PI*2); ctx.fill();
        // Brilho da água
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillRect(12, 12, 4, 4);
    } else if (type === 'stall') {
        // Barraca de Mercado
        ctx.fillStyle = '#78350f'; // Madeira
        ctx.fillRect(2, 20, 28, 10);
        // Toldo colorido (Listrado)
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

    spriteCache[key] = canvas;
    return canvas;
}

export function getEntitySprite(type: string, direction: string, frame: number, isHit: boolean = false): HTMLCanvasElement {
  const key = `ent_v10_${type}_${direction}_${frame}_${isHit}`;
  if (spriteCache[key]) return spriteCache[key];

  const canvas = createOffscreenCanvas(TILE_SIZE, TILE_SIZE);
  const ctx = canvas.getContext('2d')!;
  if (isHit) { ctx.globalAlpha = 0.6; ctx.fillStyle = '#ff0000'; }

  const bounce = frame === 1 ? -1 : 0;
  const shadow = 'rgba(0,0,0,0.3)';
  const skin = '#ffdbac';

  ctx.fillStyle = shadow;
  ctx.beginPath(); ctx.ellipse(16, 30, 10, 3, 0, 0, Math.PI * 2); ctx.fill();

  if (type === ClassType.WARRIOR) {
      ctx.fillStyle = '#475569'; ctx.fillRect(10, 24+bounce, 4, 6); ctx.fillRect(18, 24+bounce, 4, 6);
      ctx.fillStyle = '#ef4444'; ctx.fillRect(7, 14+bounce, 18, 12);
      ctx.fillStyle = '#94a3b8'; ctx.fillRect(10, 4+bounce, 12, 11);
      ctx.fillStyle = 'black'; ctx.fillRect(12, 8+bounce, 8, 2);
  } else if (type === ClassType.MAGE) {
      ctx.fillStyle = '#4c1d95'; ctx.fillRect(7, 14+bounce, 18, 14);
      ctx.fillStyle = skin; ctx.fillRect(11, 6+bounce, 10, 10);
      ctx.fillStyle = '#5b21b6'; ctx.beginPath(); ctx.moveTo(5, 8+bounce); ctx.lineTo(27, 8+bounce); ctx.lineTo(16, -4+bounce); ctx.fill();
  } else if (type === ClassType.ELF) {
      ctx.fillStyle = '#064e3b'; ctx.fillRect(8, 14+bounce, 16, 12);
      ctx.fillStyle = skin; ctx.fillRect(11, 6+bounce, 10, 10);
      ctx.fillStyle = '#fde68a'; ctx.fillRect(11, 5+bounce, 10, 4);
      ctx.fillStyle = skin; // Pointy ears
      ctx.beginPath(); ctx.moveTo(11, 10+bounce); ctx.lineTo(6, 6+bounce); ctx.lineTo(11, 13+bounce); ctx.fill();
      ctx.beginPath(); ctx.moveTo(21, 10+bounce); ctx.lineTo(26, 6+bounce); ctx.lineTo(21, 13+bounce); ctx.fill();
  } else if (type.startsWith('merchant')) {
      ctx.fillStyle = '#1e293b'; ctx.fillRect(8, 14+bounce, 16, 14);
      ctx.fillStyle = skin; ctx.fillRect(11, 4+bounce, 10, 10);
      ctx.fillStyle = '#f59e0b'; ctx.fillRect(8, 4+bounce, 16, 2);
  } else {
      ctx.fillStyle = type === 'Rat' ? '#64748b' : '#166534';
      ctx.fillRect(8, 14+bounce, 16, 16);
  }

  spriteCache[key] = canvas;
  return canvas;
}

export function getItemSprite(name: string): HTMLCanvasElement {
    const key = `item_v4_${name}`;
    if (spriteCache[key]) return spriteCache[key];
    const canvas = createOffscreenCanvas(TILE_SIZE, TILE_SIZE);
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(16, 16, 10, 0, Math.PI*2); ctx.fill();
    spriteCache[key] = canvas;
    return canvas;
}

export function getCursorDataUrl(): string {
  const canvas = createOffscreenCanvas(32, 32);
  const ctx = canvas.getContext('2d')!;
  ctx.save(); ctx.translate(4, 4); ctx.rotate(-Math.PI / 4);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, -2, 16, 4);
  ctx.restore();
  return canvas.toDataURL();
}
