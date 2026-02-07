export function createOffscreenCanvas(width: number, height: number) {
  if (typeof document === 'undefined') {
    const noop = () => {};
    const ctx = {
      save: noop,
      restore: noop,
      translate: noop,
      rotate: noop,
      beginPath: noop,
      arc: noop,
      ellipse: noop,
      fill: noop,
      stroke: noop,
      strokeRect: noop,
      clearRect: noop,
      fillRect: noop,
      fillText: noop,
      drawImage: noop,
      set lineWidth(_: number) {},
      set fillStyle(_: string) {},
      set strokeStyle(_: string) {},
      set globalAlpha(_: number) {},
      set imageSmoothingEnabled(_: boolean) {},
      font: '',
      textAlign: 'left',
    } as unknown as CanvasRenderingContext2D;
    return {
      width,
      height,
      getContext: () => ctx,
      toDataURL: () => '',
    } as unknown as HTMLCanvasElement;
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}
