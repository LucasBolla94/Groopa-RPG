import { createBaseItemCanvas, px } from './utils';

export function createBowSprite() {
  const { canvas, ctx } = createBaseItemCanvas();

  const wood = '#92400e';
  const woodLight = '#d97706';
  const outline = '#0f172a';
  const string = '#f5f3ff';

  // Bow limbs (pixel curve)
  px(ctx, 10, 6, outline, 2, 20);
  px(ctx, 20, 6, outline, 2, 20);

  px(ctx, 11, 7, wood, 1, 18);
  px(ctx, 20, 7, wood, 1, 18);
  px(ctx, 12, 8, woodLight, 1, 16);
  px(ctx, 19, 8, woodLight, 1, 16);

  // Tips
  px(ctx, 9, 6, outline, 1, 2);
  px(ctx, 22, 6, outline, 1, 2);
  px(ctx, 9, 24, outline, 1, 2);
  px(ctx, 22, 24, outline, 1, 2);

  // String
  px(ctx, 16, 6, string, 1, 20);
  px(ctx, 15, 7, string, 1, 18);

  return canvas;
}
