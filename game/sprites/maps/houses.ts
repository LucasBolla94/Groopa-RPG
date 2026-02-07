import { TILE_SIZE } from '../../../constants';

export function drawHouseWallTile(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#334155';
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, TILE_SIZE, 4);
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  ctx.fillRect(4, 8, 24, 8);
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(0, 24, TILE_SIZE, 4);
}

export function drawHouseFloorTile(ctx: CanvasRenderingContext2D) {
  // Base wood
  ctx.fillStyle = '#5b3a1f';
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

  // Plank pattern (vertical boards)
  const plankWidth = 6;
  for (let x = 0; x < TILE_SIZE; x += plankWidth) {
    // alternating tones
    ctx.fillStyle = (Math.floor(x / plankWidth) % 2 === 0) ? '#6b4423' : '#4b2f18';
    ctx.fillRect(x, 0, plankWidth, TILE_SIZE);

    // grain highlights
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(x + 1, 4, 1, TILE_SIZE - 8);
    ctx.fillRect(x + 3, 10, 1, TILE_SIZE - 20);

    // darker knots
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(x + 2, 14, 1, 2);
  }

  // thin seams between planks
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  for (let x = plankWidth; x < TILE_SIZE; x += plankWidth) {
    ctx.fillRect(x, 0, 1, TILE_SIZE);
  }

  // subtle bottom shadow
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(0, TILE_SIZE - 3, TILE_SIZE, 3);
}
