import axios from 'axios';
import { Buffer } from 'buffer';

export default async function handler(req, res) {
  const imageUrl = req.query.url;
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  const imageBuffer = Buffer.from(response.data, 'binary');
  res.setHeader('Content-Type', 'image/jpeg');
  res.send(imageBuffer);
}
