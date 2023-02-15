import KMeans from 'ml-kmeans';
import { createCanvas, loadImage } from 'canvas';

export async function extractColors(imageUrl, numColors = 10, maxDimension = 150, sampleRate = 10) {
  const response = await fetch(imageUrl);
  const buffer = await response.buffer();
  const img = await loadImage(buffer);
  const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
  const width = img.width * scale;
  const height = img.height * scale;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const colorArray = [];

  for (let i = 0; i < pixels.length; i += sampleRate * 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    colorArray.push([r, g, b]);
  }
  const { centroids } = KMeans(colorArray, numColors);
  return centroids.map((centroid) => centroid.centroid.map(Math.round));
}

const rgbToHex = (r, g, b) => `#${[r, g, b]
  .map((c) => c.toString(16).padStart(2, '0'))
  .join('')
  .toUpperCase()}`;

const sumArray = (arr) => arr.reduce((a, b) => a + b);

export default async function extractBrightestColor(imageUrl) {
  let colors = await extractColors(imageUrl);
  colors = colors.filter((color) => sumArray(color) <= 620);
  const brightest = colors.reduce(
    (max, current) => (sumArray(max) > sumArray(current) ? max : current),
  );
  return rgbToHex(...brightest);
}
