import axios from 'axios';

const DAY = 86400000;
let media = [];
let lastUpdate = new Date(1990, 0, 1);

export default async function handler(req, res) {
  try {
    if (media.length === 0 || new Date() - lastUpdate >= DAY) {
      const response = await axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.TMDB_KEY}`);
      media = response.data.results
        .filter((m) => /^(movie|tv)$/i.test(m.media_type.toLowerCase()))
        .sort((m1, m2) => m2.popularity - m1.popularity)
        .slice(0, 20)
        .map(({
          poster_path: path, id, title, name, media_type: mediaType,
        }) => ({
          path: `${process.env.TMDB_IMAGE_PREFIX}${path}`,
          id: `${mediaType.toLowerCase() === 'movie' ? 'm' : 's'}${id}`,
          title: title || name,
        }));
      lastUpdate = new Date();
    }
    return res.json(media);
  } catch (e) {
    console.error(e);
    return res.status(500);
  }
}
