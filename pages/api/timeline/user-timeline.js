import { withIronSessionApiRoute } from 'iron-session/next';
import cookiesSettings from '../../../utils/cookies';
import { getUserTimeline } from '../../../dal/movies';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const { user: userId } = req.body;
  if (!userId) {
    return res.status(403).send({ message: 'User not logged in' });
  }

  let result = await getUserTimeline(userId);
  result = result.map((movie) => ({
    ...movie,
    movies: Number(movie.movies),
    actors: Number(movie.actors),
    posterUrl: `${process.env.TMDB_IMAGE_PREFIX}${movie.posterUrl}`,
  }));

  return res.json(result);
}

export default withIronSessionApiRoute(handler, cookiesSettings);
