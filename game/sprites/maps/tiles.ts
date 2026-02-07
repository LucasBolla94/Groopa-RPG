import { TileType } from '../../../types';
import { TILE_SIZE, COLORS } from '../../../constants';
import { createOffscreenCanvas } from '../shared';
import { drawGrassTile } from './grass';
import { drawGroundTile, drawSandTile } from './ground';
import { drawRoadTile } from './road';
import { drawTreeTile } from './trees';
import { drawHouseFloorTile, drawHouseWallTile } from './houses';

function drawWater(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = COLORS.WATER;
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.fillRect(6, 8, 20, 2);
  ctx.fillRect(10, 16, 12, 2);
}

export function getTileSpriteFromType(type: TileType): HTMLCanvasElement {
  const canvas = createOffscreenCanvas(TILE_SIZE, TILE_SIZE);
  const ctx = canvas.getContext('2d')!;

  if (type === TileType.GRASS) drawGrassTile(ctx);
  else if (type === TileType.DIRT) drawGroundTile(ctx);
  else if (type === TileType.STONE) drawRoadTile(ctx);
  else if (type === TileType.WATER) drawWater(ctx);
  else if (type === TileType.SAND) drawSandTile(ctx);
  else if (type === TileType.FOREST) drawTreeTile(ctx);
  else if (type === TileType.WALL) drawHouseWallTile(ctx);
  else if (type === TileType.FLOOR_WOOD) drawHouseFloorTile(ctx);
  else { ctx.fillStyle = '#111827'; ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE); }

  return canvas;
}
