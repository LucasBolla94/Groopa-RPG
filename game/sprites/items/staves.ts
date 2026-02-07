import { createBaseItemCanvas, px } from './utils';

export function createStaffSprite() {
  const { canvas, ctx } = createBaseItemCanvas();

  const wood = '#7c2d12';
  const woodDark = '#451a03';
  const outline = '#0f172a';
  const crystal = '#38bdf8';
  const crystalLight = '#e0f2fe';

  // Shaft
  px(ctx, 15, 4, outline, 2, 24);
  px(ctx, 16, 5, wood, 1, 22);
  px(ctx, 15, 5, woodDark, 1, 22);

  // Crystal head (diamond)
  px(ctx, 16, 1, crystalLight, 1, 1);
  px(ctx, 15, 2, crystal, 3, 1);
  px(ctx, 14, 3, crystal, 5, 1);
  px(ctx, 15, 4, crystalLight, 3, 1);
  px(ctx, 16, 5, crystalLight, 1, 1);

  // Cap
  px(ctx, 14, 6, outline, 4, 1);

  return canvas;
}
