import { createSwordSprite } from './swords';
import { createBowSprite } from './bows';
import { createStaffSprite } from './staves';
import { createBaseItemCanvas, px } from './utils';
import type { ItemType } from '../../../types';

export type WeaponSpriteKind = 'sword' | 'bow' | 'staff' | 'unknown';

export function getWeaponKindFromName(name: string): WeaponSpriteKind {
  const n = name.toLowerCase();
  if (n.includes('sword') || n.includes('blade')) return 'sword';
  if (n.includes('bow') || n.includes('arc')) return 'bow';
  if (n.includes('staff') || n.includes('wand') || n.includes('rod')) return 'staff';
  return 'unknown';
}

export function getWeaponSprite(name: string) {
  const kind = getWeaponKindFromName(name);
  if (kind === 'sword') return createSwordSprite(name.toLowerCase().includes('steel') ? 'steel' : 'basic');
  if (kind === 'bow') return createBowSprite();
  if (kind === 'staff') return createStaffSprite();
  return createSwordSprite('basic');
}

function createShieldSprite() {
  const { canvas, ctx } = createBaseItemCanvas();
  const outline = '#0f172a';
  const metal = '#94a3b8';
  const metalLight = '#e2e8f0';
  px(ctx, 10, 6, outline, 12, 18);
  px(ctx, 11, 7, metal, 10, 16);
  px(ctx, 12, 8, metalLight, 8, 6);
  px(ctx, 14, 14, metal, 4, 6);
  px(ctx, 15, 16, '#f59e0b', 2, 2);
  return canvas;
}

function createArmorSprite() {
  const { canvas, ctx } = createBaseItemCanvas();
  const outline = '#0f172a';
  const plate = '#64748b';
  const plateLight = '#cbd5e1';
  px(ctx, 9, 6, outline, 14, 18);
  px(ctx, 10, 7, plate, 12, 16);
  px(ctx, 12, 9, plateLight, 8, 4);
  px(ctx, 12, 15, plateLight, 8, 3);
  px(ctx, 12, 12, '#1f2937', 8, 2);
  return canvas;
}

function createHelmetSprite() {
  const { canvas, ctx } = createBaseItemCanvas();
  const outline = '#0f172a';
  const metal = '#94a3b8';
  const light = '#e2e8f0';
  px(ctx, 9, 10, outline, 14, 10);
  px(ctx, 10, 11, metal, 12, 8);
  px(ctx, 12, 12, light, 8, 3);
  px(ctx, 13, 15, '#1f2937', 6, 2);
  return canvas;
}

function createGlovesSprite() {
  const { canvas, ctx } = createBaseItemCanvas();
  const outline = '#0f172a';
  const leather = '#7c2d12';
  const leatherLight = '#b45309';
  px(ctx, 8, 14, outline, 7, 8);
  px(ctx, 9, 15, leather, 5, 6);
  px(ctx, 16, 14, outline, 7, 8);
  px(ctx, 17, 15, leatherLight, 5, 6);
  return canvas;
}

function createPantsSprite() {
  const { canvas, ctx } = createBaseItemCanvas();
  const outline = '#0f172a';
  const cloth = '#334155';
  const clothLight = '#64748b';
  px(ctx, 10, 10, outline, 12, 16);
  px(ctx, 11, 11, cloth, 10, 14);
  px(ctx, 12, 12, clothLight, 4, 6);
  px(ctx, 16, 12, clothLight, 4, 6);
  return canvas;
}

function createBootsSprite() {
  const { canvas, ctx } = createBaseItemCanvas();
  const outline = '#0f172a';
  const boot = '#7c2d12';
  const bootLight = '#a16207';
  px(ctx, 10, 18, outline, 12, 8);
  px(ctx, 11, 19, boot, 10, 6);
  px(ctx, 12, 20, bootLight, 4, 3);
  px(ctx, 16, 20, bootLight, 4, 3);
  return canvas;
}

function createRingSprite() {
  const { canvas, ctx } = createBaseItemCanvas();
  const outline = '#0f172a';
  const gold = '#f59e0b';
  const shine = '#fde68a';
  px(ctx, 12, 12, outline, 8, 8);
  px(ctx, 13, 13, gold, 6, 6);
  px(ctx, 14, 14, outline, 4, 4);
  px(ctx, 15, 15, shine, 2, 2);
  return canvas;
}

function createWingsSprite() {
  const { canvas, ctx } = createBaseItemCanvas();
  const outline = '#0f172a';
  const feather = '#e2e8f0';
  const featherDark = '#94a3b8';
  px(ctx, 6, 10, outline, 6, 12);
  px(ctx, 20, 10, outline, 6, 12);
  px(ctx, 7, 11, feather, 4, 10);
  px(ctx, 21, 11, feather, 4, 10);
  px(ctx, 9, 13, featherDark, 2, 6);
  px(ctx, 21, 13, featherDark, 2, 6);
  return canvas;
}

function createBackpackSprite() {
  const { canvas, ctx } = createBaseItemCanvas();
  const outline = '#0f172a';
  const pack = '#7c2d12';
  const packLight = '#b45309';
  px(ctx, 10, 8, outline, 12, 16);
  px(ctx, 11, 9, pack, 10, 14);
  px(ctx, 12, 10, packLight, 8, 5);
  px(ctx, 13, 16, '#451a03', 6, 5);
  return canvas;
}

function createPotionSprite() {
  const { canvas, ctx } = createBaseItemCanvas();
  const outline = '#0f172a';
  const glass = '#94a3b8';
  const liquid = '#ef4444';
  px(ctx, 13, 6, outline, 6, 4);
  px(ctx, 14, 7, glass, 4, 2);
  px(ctx, 12, 10, outline, 8, 12);
  px(ctx, 13, 11, glass, 6, 10);
  px(ctx, 13, 15, liquid, 6, 6);
  px(ctx, 15, 12, '#fecaca', 2, 2);
  return canvas;
}

function createMiscSprite() {
  const { canvas, ctx } = createBaseItemCanvas();
  const outline = '#0f172a';
  const gem = '#34d399';
  const gemLight = '#a7f3d0';
  px(ctx, 12, 10, outline, 8, 10);
  px(ctx, 13, 11, gem, 6, 8);
  px(ctx, 15, 13, gemLight, 2, 2);
  return canvas;
}

export function getItemSpriteByType(type: ItemType, name?: string): HTMLCanvasElement {
  if (type === 'weapon') return getWeaponSprite(name ?? '');
  if (type === 'shield') return createShieldSprite();
  if (type === 'armor') return createArmorSprite();
  if (type === 'helmet') return createHelmetSprite();
  if (type === 'gloves') return createGlovesSprite();
  if (type === 'pants') return createPantsSprite();
  if (type === 'boots') return createBootsSprite();
  if (type === 'ring') return createRingSprite();
  if (type === 'wings') return createWingsSprite();
  if (type === 'backpack') return createBackpackSprite();
  if (type === 'potion') return createPotionSprite();
  return createMiscSprite();
}
