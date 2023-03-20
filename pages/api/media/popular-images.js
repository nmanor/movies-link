import axios from 'axios';

const DAY = 86400000;
let images = [];
let lastUpdate = new Date(1990, 0, 1);

export default async function handler(req, res) {
  try {
    if (images.length === 0 || new Date() - lastUpdate >= DAY) {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_KEY}`);
      images = response.data.results.map(({ backdrop_path: path }) => `${process.env.TMDB_IMAGE_PREFIX}${path}`);
      lastUpdate = new Date();
    }
    return res.json(images.sort(() => Math.random() - 0.5));
  } catch (e) {
    console.error(e);
    return res.status(500);
  }
}
