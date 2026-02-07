import { TILE_SIZE, COLORS } from '../../../constants';

export function drawGrassTile(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = COLORS.GRASS;
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(4, 4, 2, 2);
  ctx.fillRect(20, 18, 2, 2);
  ctx.fillRect(10, 22, 2, 2);
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(6, 14, 2, 2);
  ctx.fillRect(18, 10, 2, 2);
}
