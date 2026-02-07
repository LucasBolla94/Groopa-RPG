import { TILE_SIZE, COLORS } from '../../../constants';

export function drawGroundTile(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = COLORS.DIRT;
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.fillRect(6, 6, 2, 2);
  ctx.fillRect(18, 14, 2, 2);
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(10, 20, 3, 2);
}

export function drawSandTile(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = COLORS.SAND;
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.fillRect(8, 10, 2, 2);
  ctx.fillRect(20, 20, 2, 2);
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.fillRect(12, 16, 2, 2);
}
