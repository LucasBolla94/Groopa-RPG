import { TileType, ClassType } from '../types';
import { TILE_SIZE } from '../constants';
import { getTileSpriteFromType } from './sprites/maps/tiles';
import { getInteractiveSprite as getInteractiveSpriteRaw } from './sprites/maps/interactives';
import { createOffscreenCanvas } from './sprites/shared';
import { getItemSpriteByType } from './sprites/items';
import type { ItemType } from '../types';
import { getNpcSprite } from './sprites/npcs';
import { getPlayerSprite, getPlayerSleepingSprite, getPlayerDeadSprite } from './sprites/entities/player';
import { getMonsterSprite, getMonsterDeadSprite } from './sprites/entities/monsters';

const spriteCache: Record<string, HTMLCanvasElement> = {};

export function getTileSprite(type: TileType): HTMLCanvasElement {
  const key = `tile_v11_${type}`;
  if (spriteCache[key]) return spriteCache[key];
  const canvas = getTileSpriteFromType(type);
  spriteCache[key] = canvas;
  return canvas;
}

export function getInteractiveSprite(type: 'door' | 'chest' | 'bed' | 'fountain' | 'stall', isOpen: boolean = false): HTMLCanvasElement {
  const key = `inter_v3_${type}_${isOpen}`;
  if (spriteCache[key]) return spriteCache[key];
  const canvas = getInteractiveSpriteRaw(type, isOpen);
  spriteCache[key] = canvas;
  return canvas;
}

export function getEntitySprite(
  type: string,
  direction: string,
  frame: number,
  isHit: boolean = false,
  state?: 'sleeping' | 'dead'
): HTMLCanvasElement {
  const key = `ent_v12_${type}_${direction}_${frame}_${isHit}_${state ?? 'none'}`;
  if (spriteCache[key]) return spriteCache[key];

  const canvas = createOffscreenCanvas(TILE_SIZE, TILE_SIZE);
  const ctx = canvas.getContext('2d')!;
  if (isHit) { ctx.globalAlpha = 0.6; ctx.fillStyle = '#ff0000'; }

  if (type === ClassType.WARRIOR || type === ClassType.MAGE || type === ClassType.ELF) {
    let playerCanvas: HTMLCanvasElement;
    if (state === 'sleeping') playerCanvas = getPlayerSleepingSprite(type as ClassType);
    else if (state === 'dead') playerCanvas = getPlayerDeadSprite(type as ClassType);
    else playerCanvas = getPlayerSprite(type as ClassType, direction as any, frame, isHit);
    ctx.drawImage(playerCanvas, 0, 0);
  } else if (type.startsWith('merchant')) {
    const npcCanvas = getNpcSprite(type, direction as any, frame);
    ctx.drawImage(npcCanvas, 0, 0);
  } else {
    const monsterCanvas = state === 'dead' ? getMonsterDeadSprite(type) : getMonsterSprite(type, direction as any, frame, isHit);
    ctx.drawImage(monsterCanvas, 0, 0);
  }

  spriteCache[key] = canvas;
  return canvas;
}

export function getItemSprite(type: ItemType, name?: string): HTMLCanvasElement {
  const key = `item_v6_${type}_${name ?? ''}`;
  if (spriteCache[key]) return spriteCache[key];

  const canvas = getItemSpriteByType(type, name);
  spriteCache[key] = canvas;
  return canvas;
}

export function getCursorDataUrl(): string {
  if (typeof document === 'undefined') return '';
  const canvas = createOffscreenCanvas(32, 32);
  const ctx = canvas.getContext('2d')!;
  ctx.save(); ctx.translate(4, 4); ctx.rotate(-Math.PI / 4);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, -2, 16, 4);
  ctx.restore();
  return canvas.toDataURL();
}
