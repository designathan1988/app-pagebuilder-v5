// How close a page is to the original it was captured from: the share of pixels two full-page pictures have alike,
// at each width the capture observes (Desktop 1440, Laptop 1180, Tablet 834, Phone 390). A pixel is alike when each
// channel differs by TOLERANCE of 255 at most, over the height both pictures have.
import type { Page } from '@playwright/test';

export const TOLERANCE = 24;
export const WIDTHS = [1440, 1180, 834, 390] as const;

// Two pictures (PNG, base64) compared in the page: the share of pixels alike over the height both have, and each
// picture's height.
export async function comparePictures(page: Page, made: string, original: string): Promise<{ readonly match: number; readonly exportHeight: number; readonly targetHeight: number }> {
  return page.evaluate(
    async ([a, b, tolerance]) => {
      const load = (src: string) =>
        new Promise<HTMLImageElement>((resolve) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.src = `data:image/png;base64,${src}`;
        });
      const [exported, original] = await Promise.all([load(a), load(b)]);
      const w = Math.min(exported.width, original.width);
      const h = Math.min(exported.height, original.height);
      const pixels = (image: HTMLImageElement) => {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, w, h).data;
      };
      const da = pixels(exported);
      const db = pixels(original);
      let same = 0;
      for (let i = 0; i < da.length; i += 4) {
        if (Math.abs((da[i] ?? 0) - (db[i] ?? 0)) <= tolerance && Math.abs((da[i + 1] ?? 0) - (db[i + 1] ?? 0)) <= tolerance && Math.abs((da[i + 2] ?? 0) - (db[i + 2] ?? 0)) <= tolerance) same += 1;
      }
      return { match: Math.round((same / (w * h)) * 1000) / 10, exportHeight: exported.height, targetHeight: original.height };
    },
    [made, original, TOLERANCE] as const,
  );
}
