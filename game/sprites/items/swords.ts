import { createBaseItemCanvas, px } from './utils';

export function createSwordSprite(variant: 'steel' | 'basic' = 'basic') {
  const { canvas, ctx } = createBaseItemCanvas();

  const blade = variant === 'steel' ? '#cbd5e1' : '#e5e7eb';
  const bladeDark = variant === 'steel' ? '#94a3b8' : '#9ca3af';
  const outline = '#0f172a';
  const gold = '#f59e0b';
  const goldDark = '#b45309';
  const grip = '#7c2d12';
  const gripDark = '#451a03';

  // Outline + blade
  px(ctx, 15, 3, outline, 2, 18);
  px(ctx, 16, 4, blade, 1, 16);
  px(ctx, 15, 5, bladeDark, 1, 14);
  px(ctx, 14, 6, blade, 1, 10);
  px(ctx, 17, 6, bladeDark, 1, 10);

  // Tip
  px(ctx, 16, 2, blade, 1, 1);
  px(ctx, 15, 2, bladeDark, 1, 1);

  // Guard
  px(ctx, 10, 20, outline, 12, 3);
  px(ctx, 11, 21, gold, 10, 1);
  px(ctx, 12, 22, goldDark, 8, 1);

  // Grip
  px(ctx, 15, 23, outline, 2, 6);
  px(ctx, 16, 24, grip, 1, 4);
  px(ctx, 15, 24, gripDark, 1, 4);

  // Pommel
  px(ctx, 14, 29, outline, 4, 2);
  px(ctx, 15, 30, gold, 2, 1);

  return canvas;
}
