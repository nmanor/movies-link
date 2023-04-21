import axios, { HttpStatusCode } from 'axios';
import tmdbDateToJsDate from '../../utils/dates';
import EntityType from '../../utils/enums';

const MAX_RESULT = 45;

const mediaReleasedPredicate = (date) => tmdbDateToJsDate(date || '3000-12-12').getFullYear() <= new Date().getFullYear() + 1;

function mapMovies(data) {
  return data
    .filter((entry) => mediaReleasedPredicate(entry.release_date))
    .map((entry) => {
      const id = `m${entry.id}`;
      const [releaseYear] = entry.release_date.split('-');
      const imageUrl = `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${entry.poster_path}`;
      return {
        id,
        name: entry.title,
        popularity: entry.popularity,
        releaseYear,
        imageUrl,
        entityType: EntityType.Movie,
      };
    });
}

function mapSeries(data) {
  return data
    .filter((entry) => mediaReleasedPredicate(entry.first_air_date))
    .map((entry) => {
      const id = `s${entry.id}`;
      const [releaseYear] = entry.first_air_date.split('-');
      const imageUrl = `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${entry.poster_path}`;
      return {
        id,
        name: entry.name,
        popularity: entry.popularity,
        releaseYear,
        imageUrl,
        entityType: EntityType.Series,
      };
    });
}

function mapPeople(data) {
  return data
    .map((entry) => {
      const imageUrl = `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${entry.profile_path}`;
      const popularity = entry.known_for.reduce((p, c) => p + c.popularity, 0)
          / entry.known_for.length;
      return {
        id: entry.id,
        name: entry.name,
        popularity,
        imageUrl,
        entityType: EntityType.Actor,
      };
    });
}

export default async function handler(req, res) {
  try {
    const { query } = req.query;
    if (!query || query.length === 0) {
      return res.status(HttpStatusCode.NotFound).end();
    }

    const requests = [
      axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_KEY}&query=${query}`),
      axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${process.env.TMDB_KEY}&query=${query}`),
      axios.get(`https://api.themoviedb.org/3/search/person?api_key=${process.env.TMDB_KEY}&query=${query}`),
    ];
    const responses = await axios.all(requests);

    if (responses.every((response) => response.status !== HttpStatusCode.Ok)) {
      return res.status(HttpStatusCode.InternalServerError).end();
    }

    const mapFunctions = [mapMovies, mapSeries, mapPeople];
    let result = [];
    responses.forEach((response, index) => {
      if (response.status !== HttpStatusCode.Ok) return;
      result = [...result, ...mapFunctions[index](response.data.results)];
    });

    result = result
      .sort((e1, e2) => e2.popularity - e1.popularity)
      .slice(0, MAX_RESULT);

    return res.json(result);
  } catch (e) {
    console.log(e);
    return res.status(HttpStatusCode.InternalServerError).end();
  }
}
