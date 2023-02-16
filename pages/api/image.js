export default async function handler(req, res) {
  const imageUrl = req.query.url; // URL of the image to fetch
  const response = await fetch(imageUrl);
  const imageBuffer = await response.buffer();
  res.setHeader('Content-Type', 'image/jpeg'); // Set the content type to the appropriate image format
  res.send(imageBuffer);
}
