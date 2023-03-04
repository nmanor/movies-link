import axios from 'axios';
import tmdbDateToJsDate from '../../../utils/dates';

const MAX_RESULT = 20;

export default async function handler(req, res) {
  try {
    const { query } = req.query;
    if (!query || query.length === 0) {
      return res.status(404).end();
    }

    const { data: { results } } = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_KEY}&query=${query}`);
    const result = results
      .filter((entry) => tmdbDateToJsDate(entry.release_date)
        .getFullYear() <= new Date().getFullYear() + 1)
      .slice(0, MAX_RESULT)
      .map((entry) => ({
        id: entry.id,
        title: entry.title,
        releaseYear: entry.release_date ? entry.release_date.split('-')[0] : 'Unknown',
        mediaType: 'Movie',
        imageUrl: `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${entry.poster_path}`,
      }));

    return res.json(result);
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }
}
