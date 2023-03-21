import { withIronSessionApiRoute } from 'iron-session/next';
import { HttpStatusCode } from 'axios';
import cookiesSettings from '../../../utils/cookies';
import { removeMediaFromGroup } from '../../../dal/groups';

async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(HttpStatusCode.MethodNotAllowed).send({ message: 'Only POST requests allowed' });
    }

    const { user } = req.session;
    if (!user) {
      return res.status(HttpStatusCode.Forbidden).send({ message: 'User not logged in' });
    }

    const { groupId, movieId } = req.body;
    const success = await removeMediaFromGroup(groupId, movieId);

    return res.json({ success });
  } catch (e) {
    console.error(e);
    return res.json({ success: false });
  }
}

export default withIronSessionApiRoute(handler, cookiesSettings);
