
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
  const key = `tile_v4_${type}`;
  if (spriteCache[key]) return spriteCache[key];

  const canvas = createOffscreenCanvas(TILE_SIZE, TILE_SIZE);
  const ctx = canvas.getContext('2d')!;
  
  let baseColor = COLORS.GRASS;
  let detailColor = 'rgba(0,0,0,0.1)';

  if (type === TileType.DIRT) baseColor = COLORS.DIRT;
  if (type === TileType.STONE) baseColor = '#5e60ce'; // Paved stone
  if (type === TileType.WATER) baseColor = COLORS.WATER;
  if (type === TileType.SAND) baseColor = COLORS.SAND;
  if (type === TileType.FOREST) baseColor = COLORS.FOREST;
  if (type === TileType.WALL) baseColor = '#1a1c2c';
  if (type === TileType.LAVA) baseColor = '#9d0208';
  if (type === TileType.FLOOR_DARK) baseColor = '#242424';
  if (type === TileType.FLOOR_WOOD) baseColor = '#603808';
  if (type === TileType.ROOF) baseColor = '#780000';
  if (type === TileType.FLOOR_BRICK) baseColor = '#a52422';

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

  if (type === TileType.STONE) {
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.strokeRect(2, 2, TILE_SIZE-4, TILE_SIZE-4);
    ctx.strokeRect(TILE_SIZE/2, TILE_SIZE/2, 2, 2);
  } else if (type === TileType.FLOOR_WOOD) {
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(0, TILE_SIZE-2, TILE_SIZE, 2);
    ctx.fillRect(TILE_SIZE/2, 0, 2, TILE_SIZE);
  } else if (type === TileType.WALL) {
    ctx.fillStyle = '#333c57';
    ctx.fillRect(0, 0, TILE_SIZE, 4);
    ctx.fillRect(0, 0, 4, TILE_SIZE);
    ctx.fillStyle = 'black';
    ctx.fillRect(TILE_SIZE-2, 0, 2, TILE_SIZE);
  } else if (type === TileType.ROOF) {
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    for(let i=0; i<4; i++) ctx.fillRect(0, i*8, TILE_SIZE, 2);
  }

  spriteCache[key] = canvas;
  return canvas;
}

function drawSword(ctx: CanvasRenderingContext2D, bladeColor: string, hiltColor: string, gemColor?: string) {
  ctx.save();
  ctx.translate(16, 16);
  ctx.rotate(-Math.PI / 4);

  // Blade
  ctx.fillStyle = bladeColor;
  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.lineTo(3, 0);
  ctx.lineTo(0, 14);
  ctx.lineTo(-3, 0);
  ctx.closePath();
  ctx.fill();
  
  // Blade Edge/Highlight
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.lineTo(1, 0);
  ctx.lineTo(0, 14);
  ctx.fill();

  // Guard (Cruzeta)
  ctx.fillStyle = hiltColor;
  ctx.fillRect(-6, -1, 12, 3);

  // Handle (Cabo)
  ctx.fillStyle = '#432818'; // Wood/Leather handle
  ctx.fillRect(-1.5, -5, 3, 5);

  // Pommel (Pomo)
  ctx.fillStyle = hiltColor;
  ctx.beginPath();
  ctx.arc(0, -6, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Gem
  if (gemColor) {
    ctx.fillStyle = gemColor;
    ctx.beginPath();
    ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 5;
    ctx.shadowColor = gemColor;
    ctx.stroke();
  }

  ctx.restore();
}

export function getItemSprite(name: string): HTMLCanvasElement {
  const key = `item_v2_${name}`;
  if (spriteCache[key]) return spriteCache[key];

  const canvas = createOffscreenCanvas(TILE_SIZE, TILE_SIZE);
  const ctx = canvas.getContext('2d')!;

  if (name.includes('Health Potion')) {
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillRect(12, 8, 8, 4); 
    ctx.fillStyle = '#dc2626'; 
    ctx.beginPath(); ctx.arc(16, 20, 8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'white'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = 'white'; ctx.fillRect(14, 18, 2, 2);
  } else if (name.includes('Mana Potion')) {
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillRect(12, 8, 8, 4); 
    ctx.fillStyle = '#2563eb'; 
    ctx.beginPath(); ctx.arc(16, 20, 8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'white'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = 'white'; ctx.fillRect(14, 18, 2, 2);
  } 
  // Custom Swords
  else if (name === 'Steel Sword') drawSword(ctx, '#94a3b8', '#475569');
  else if (name === 'Golden Gladius') drawSword(ctx, '#fbbf24', '#b45309', '#ef4444');
  else if (name === 'Rune Blade') drawSword(ctx, '#38bdf8', '#1e40af', '#00f5ff');
  else if (name === 'Obsidian Claymore') drawSword(ctx, '#1e1b4b', '#4c1d95', '#a855f7');
  else if (name === 'Fire Brand') drawSword(ctx, '#f97316', '#7c2d12', '#facc15');
  else if (name === 'Battle Axe') {
    ctx.fillStyle = '#475569';
    ctx.beginPath(); ctx.moveTo(8, 10); ctx.lineTo(16, 16); ctx.lineTo(8, 22); ctx.fill();
    ctx.beginPath(); ctx.moveTo(24, 10); ctx.lineTo(16, 16); ctx.lineTo(24, 22); ctx.fill();
    ctx.fillStyle = '#432818'; ctx.fillRect(15, 6, 2, 20);
  } else {
    // Generic box
    ctx.fillStyle = '#78350f';
    ctx.fillRect(6, 6, 20, 20);
    ctx.strokeStyle = '#432818';
    ctx.strokeRect(6, 6, 20, 20);
  }

  spriteCache[key] = canvas;
  return canvas;
}

export function getEntitySprite(type: string, direction: string, frame: number, isHit: boolean = false, isAttacking: boolean = false): HTMLCanvasElement {
  const key = `ent_v6_${type}_${direction}_${frame}_${isHit}_${isAttacking}`;
  if (spriteCache[key]) return spriteCache[key];

  const canvas = createOffscreenCanvas(TILE_SIZE, TILE_SIZE);
  const ctx = canvas.getContext('2d')!;

  if (isHit) {
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = '#ff0000';
  }

  const bounce = frame === 1 ? -1 : 0;
  const shadow = 'rgba(0,0,0,0.4)';
  const skin = '#ffdbac';

  // Ground Shadow
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.ellipse(16, 30, 10, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  if (type === ClassType.WARRIOR) {
    const armor = '#8d99ae';
    const armorDark = '#4a4e69';
    const red = '#ef233c';
    ctx.fillStyle = red; ctx.fillRect(4, 12 + bounce, 24, 16);
    ctx.fillStyle = skin; ctx.fillRect(8, 22 + bounce, 6, 4); ctx.fillRect(18, 22 + bounce, 6, 4);
    ctx.fillStyle = armorDark; ctx.fillRect(8, 26 + bounce, 6, 4); ctx.fillRect(18, 26 + bounce, 6, 4);
    ctx.fillStyle = armor; ctx.fillRect(7, 12 + bounce, 18, 8);
    ctx.fillStyle = skin; ctx.fillRect(11, 4 + bounce, 10, 10);
    ctx.fillStyle = armor; ctx.fillRect(10, 4 + bounce, 12, 3); ctx.fillRect(10, 4 + bounce, 3, 10); ctx.fillRect(19, 4 + bounce, 3, 10);
    ctx.fillStyle = red; ctx.fillRect(14, 0 + bounce, 4, 5);
  } else if (type === ClassType.MAGE) {
    const robes = '#14213d';
    const hatColor = '#1e3a8a';
    const beardColor = '#f8f9fa';
    ctx.fillStyle = robes; ctx.fillRect(6, 12 + bounce, 20, 18);
    ctx.fillStyle = skin; ctx.fillRect(11, 6 + bounce, 10, 10);
    ctx.fillStyle = beardColor; ctx.beginPath(); ctx.moveTo(11, 14 + bounce); ctx.lineTo(21, 14 + bounce); ctx.lineTo(16, 28 + bounce); ctx.fill();
    ctx.fillStyle = hatColor; ctx.fillRect(4, 7 + bounce, 24, 3); ctx.beginPath(); ctx.moveTo(8, 7 + bounce); ctx.lineTo(24, 7 + bounce); ctx.lineTo(16, -4 + bounce); ctx.fill();
  } else if (type === ClassType.ELF) {
    const greenMain = '#064e3b';
    const hairColor = '#fef3c7';
    ctx.fillStyle = greenMain; ctx.fillRect(6, 12 + bounce, 20, 14);
    ctx.fillStyle = skin; ctx.fillRect(11, 6 + bounce, 10, 10);
    ctx.fillStyle = hairColor; ctx.fillRect(10, 6 + bounce, 12, 4);
    ctx.fillStyle = skin; ctx.beginPath(); ctx.moveTo(10, 10 + bounce); ctx.lineTo(4, 5 + bounce); ctx.lineTo(10, 13 + bounce); ctx.fill();
    ctx.beginPath(); ctx.moveTo(22, 10 + bounce); ctx.lineTo(28, 5 + bounce); ctx.lineTo(22, 13 + bounce); ctx.fill();
  } else if (type.startsWith('merchant')) {
    ctx.fillStyle = '#432818'; ctx.fillRect(8, 24 + bounce, 16, 6); 
    ctx.fillStyle = '#ff9f1c'; ctx.fillRect(6, 12 + bounce, 20, 12); 
    ctx.fillStyle = skin; ctx.fillRect(11, 4 + bounce, 10, 10); 
    ctx.fillStyle = '#7209b7'; ctx.fillRect(8, 4 + bounce, 16, 2); 
  } else {
    let color = '#4a4e69';
    if (type === 'Rat') color = '#6c757d';
    if (type === 'Orc') color = '#2d6a4f';
    if (type === 'Skeleton') color = '#dee2e6';
    if (type === 'Demon') color = '#900000';
    ctx.fillStyle = color;
    ctx.fillRect(8, 12 + bounce, 16, 16);
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(12, 16 + bounce, 2, 2); ctx.fillRect(18, 16 + bounce, 2, 2);
  }

  spriteCache[key] = canvas;
  return canvas;
}

export function getCursorDataUrl(): string {
  const canvas = createOffscreenCanvas(32, 32);
  const ctx = canvas.getContext('2d')!;
  ctx.save();
  ctx.translate(4, 4);
  ctx.rotate(-Math.PI / 4);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, -2, 16, 4);
  ctx.fillStyle = '#d1d5db'; ctx.fillRect(0, -1, 16, 2);
  ctx.beginPath(); ctx.moveTo(16, -2); ctx.lineTo(20, 0); ctx.lineTo(16, 2); ctx.fill();
  ctx.fillStyle = '#fca311'; ctx.fillRect(0, -5, 2, 10);
  ctx.fillStyle = '#78350f'; ctx.fillRect(-6, -1.5, 6, 3);
  ctx.fillStyle = '#fca311'; ctx.beginPath(); ctx.arc(-7, 0, 2, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  return canvas.toDataURL();
}
