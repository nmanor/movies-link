import { withIronSessionApiRoute } from 'iron-session/next';
import axios, { HttpStatusCode } from 'axios';
import cookiesSettings from '../../../utils/cookies';
import MediaType from '../../../utils/enums';

async function handler(req, res) {
  try {
    let { user: userId } = req.body;
    userId = userId || req.session.user.googleId;
    if (!userId) {
      return res.status(HttpStatusCode.Forbidden).send({ message: 'User not logged in' });
    }

    let { page } = req.query;
    page = page || 1;

    const [moviesResponse, seriesResponse] = await Promise.all([
      axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.TMDB_KEY}&page=${page}&language=en-US`),
      axios.get(`https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.TMDB_KEY}&page=${page}&language=en-US`),
    ]);

    const movies = moviesResponse.data.results.map(({
      id, title, release_date: releaseDate, popularity,
    }) => ({
      id: `m${id}`,
      title,
      releaseYear: releaseDate.split('-')[0],
      mediaType: MediaType.Movie,
      popularity,
    }));
    const series = seriesResponse.data.results.map(({
      id, name: title, first_air_date: firstAirDate, popularity,
    }) => ({
      id: `s${id}`,
      title,
      releaseYear: firstAirDate.split('-')[0],
      mediaType: MediaType.Series,
      popularity,
    }));

    const result = [...movies, ...series].sort((m1, m2) => m2.popularity - m1.popularity);
    return res.send(result);
  } catch (e) {
    console.error(e);
    return res.status(500).end();
  }
}
export default withIronSessionApiRoute(handler, cookiesSettings);
