import { withIronSessionApiRoute } from 'iron-session/next';
import { HttpStatusCode } from 'axios';
import cookiesSettings from '../../../utils/cookies';
import { getAllUserMediaIds } from '../../../dal/media';

async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(HttpStatusCode.MethodNotAllowed).send({ message: 'Only POST requests allowed' });
    }

    const { user: userId } = req.body;
    if (!userId) {
      return res.status(HttpStatusCode.Forbidden).send({ message: 'User not logged in' });
    }

    const ids = await getAllUserMediaIds(userId);
    return res.json(ids);
  } catch (e) {
    console.error(e);
    return res.status(500).end();
  }
}
export default withIronSessionApiRoute(handler, cookiesSettings);
