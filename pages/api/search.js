import axios, { HttpStatusCode } from 'axios';
import tmdbDateToJsDate from '../../utils/dates';
import MediaType from '../../utils/enums';

const MAX_RESULT = 30;

export default async function handler(req, res) {
  try {
    const { query } = req.query;
    if (!query || query.length === 0) {
      return res.status(HttpStatusCode.NotFound).end();
    }

    const requests = [
      axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_KEY}&query=${query}`),
      axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${process.env.TMDB_KEY}&query=${query}`),
    ];
    const [moviesResponse, seriesResponse] = await axios.all(requests);

    if (moviesResponse.status !== HttpStatusCode.Ok
        || seriesResponse.status !== HttpStatusCode.Ok) {
      return res.status(HttpStatusCode.InternalServerError).end();
    }

    const movies = moviesResponse.data.results
      .map((entry) => ({ ...entry, mediaType: MediaType.Movie }));
    const series = seriesResponse.data.results
      .map((entry) => ({ ...entry, mediaType: MediaType.Series }));

    const result = [...movies, ...series]
      .filter((entry) => tmdbDateToJsDate(entry.release_date || entry.first_air_date || '3000-12-12')
        .getFullYear() <= new Date().getFullYear() + 1)
      .sort((m1, m2) => m2.popularity - m1.popularity)
      .slice(0, MAX_RESULT)
      .map((entry) => {
        let releaseYear = 'Unknown';
        let { id } = entry;
        if (entry.mediaType === MediaType.Movie) {
          [releaseYear] = entry.release_date.split('-');
          id = `m${id}`;
        }
        if (entry.mediaType === MediaType.Series) {
          [releaseYear] = entry.first_air_date.split('-');
          id = `s${id}`;
        }

        return {
          id,
          title: entry.title || entry.name,
          releaseYear,
          imageUrl: `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${entry.poster_path}`,
          mediaType: entry.mediaType,
        };
      });

    return res.json(result);
  } catch (e) {
    console.log(e);
    return res.status(HttpStatusCode.InternalServerError).end();
  }
}
