import { TILE_SIZE } from '../../../constants';

export function drawRoadTile(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#5e60ce';
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.strokeRect(2, 2, TILE_SIZE - 4, TILE_SIZE - 4);
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(6, 6, 2, 2);
  ctx.fillRect(20, 12, 2, 2);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(12, 20, 4, 2);
}
