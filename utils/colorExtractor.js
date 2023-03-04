import KMeans from 'ml-kmeans';

const savedColors = {};

export async function extractColors(imageUrl, numColors = 10, maxDimension = 150, sampleRate = 10) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = imageUrl;
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });
  const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
  const width = img.width * scale;
  const height = img.height * scale;
  const canvas = document.createElement('canvas');
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

export function hexToRGB(hex) {
  let r = 0;
  let g = 0;
  let b = 0;

  if (hex.length === 4) {
    r = `0x${hex[1]}${hex[1]}`;
    g = `0x${hex[2]}${hex[2]}`;
    b = `0x${hex[3]}${hex[3]}`;
  } else if (hex.length === 7) {
    r = `0x${hex[1]}${hex[2]}`;
    g = `0x${hex[3]}${hex[4]}`;
    b = `0x${hex[5]}${hex[6]}`;
  }

  return [+r, +g, +b];
}

export function colorLightening(hex, rgbFactor = 1) {
  let [r, g, b] = hexToRGB(hex);

  r = Math.min(Math.round(r * rgbFactor), 255);
  g = Math.min(Math.round(g * rgbFactor), 255);
  b = Math.min(Math.round(b * rgbFactor), 255);

  return `rgb(${r},${g},${b})`;
}

const sumArray = (arr) => arr.reduce((a, b) => a + b);

export default async function extractBrightestColor(imageUrl) {
  if (!(imageUrl in savedColors)) {
    let colors = await extractColors(`/api/image?url=${imageUrl}`);
    colors = colors.filter((color) => sumArray(color) <= 620);
    const brightest = colors.reduce(
      (max, current) => (sumArray(max) > sumArray(current) ? max : current),
    );
    savedColors[imageUrl] = rgbToHex(...brightest);
  }
  return savedColors[imageUrl];
}
