import { withIronSessionApiRoute } from 'iron-session/next';
import axios from 'axios';
import cookiesSettings from '../../../utils/cookies';
import { addMovieToUser } from '../../../dal/movies';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const { user } = req.session;
  if (!user) {
    return res.status(403).send({ message: 'User not logged in' });
  }

  const { movieId, watchDate } = req.body;
  await addMovieToUser(user.googleId, movieId, watchDate);

  return res.end();
}

export default withIronSessionApiRoute(handler, cookiesSettings);
