import { withIronSessionApiRoute } from 'iron-session/next';
import cookiesSettings from '../../../utils/cookies';
import { addMovieToUser } from '../../../dal/movies';

async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send({ message: 'Only POST requests allowed' });
    }

    const { user } = req.session;
    if (!user) {
      return res.status(403).send({ message: 'User not logged in' });
    }

    const { movieId, watchDate } = req.body;
    const success = await addMovieToUser(user.googleId, movieId, watchDate);

    return res.json({ success });
  } catch (e) {
    console.error(e);
    return res.json({ success: false });
  }
}

export default withIronSessionApiRoute(handler, cookiesSettings);
