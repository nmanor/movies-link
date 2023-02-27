import { withIronSessionApiRoute } from 'iron-session/next';
import axios from 'axios';
import cookiesSettings from '../../../utils/cookies';
import { addMovieToUser, addActorsToMovie } from '../../../dal/movies';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const { user } = req.session;
  if (!user) {
    return res.status(403).send({ message: 'User not logged in' });
  }

  const { movieId, watchDate } = req.body;
  const populationRequired = await addMovieToUser(user.googleId, movieId, watchDate);

  if (populationRequired) {
    const { data } = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.TMDB_KEY}`);
    const actors = data.cast
      .filter((actor) => actor.known_for_department.toLowerCase() === 'acting')
      .sort((a1, a2) => Number(a1.order) - Number(a2.order))
      .slice(0, MAX_ACTORS)
      .map(({
        id, name, character, profile_path: profilePath,
      }) => ({
        id, name, character, profilePath,
      }));
    addActorsToMovie(movieId, actors);
  }

  return res.end();
}

export default withIronSessionApiRoute(handler, cookiesSettings);
