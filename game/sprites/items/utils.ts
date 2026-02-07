import { TILE_SIZE } from '../../../constants';

export function createOffscreenCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function createBaseItemCanvas() {
  const canvas = createOffscreenCanvas(TILE_SIZE, TILE_SIZE);
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, TILE_SIZE, TILE_SIZE);
  ctx.imageSmoothingEnabled = false;
  return { canvas, ctx };
}

export function px(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, w: number = 1, h: number = 1) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}
