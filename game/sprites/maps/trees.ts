import { TILE_SIZE, COLORS } from '../../../constants';

export function drawTreeTile(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = COLORS.FOREST;
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = '#14532d';
  ctx.fillRect(4, 4, 24, 18);
  ctx.fillStyle = '#166534';
  ctx.fillRect(6, 6, 20, 14);
  ctx.fillStyle = '#0f3d1f';
  ctx.fillRect(10, 20, 12, 8);
  ctx.fillStyle = '#3f6212';
  ctx.fillRect(12, 8, 6, 4);
}
