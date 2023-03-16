import { withIronSessionApiRoute } from 'iron-session/next';
import cookiesSettings from '../../../utils/cookies';
import { removeMovieFromGroup } from '../../../dal/groups';

async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send({ message: 'Only POST requests allowed' });
    }

    const { user } = req.session;
    if (!user) {
      return res.status(403).send({ message: 'User not logged in' });
    }

    const { groupId, movieId } = req.body;
    const success = await removeMovieFromGroup(groupId, movieId);

    return res.json({ success });
  } catch (e) {
    console.error(e);
    return res.json({ success: false });
  }
}

export default withIronSessionApiRoute(handler, cookiesSettings);