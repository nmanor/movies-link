import { withIronSessionApiRoute } from 'iron-session/next';
import { HttpStatusCode } from 'axios';
import cookiesSettings from '../../../utils/cookies';
import { salt, UID } from '../../../utils/utils';
import { createWatchGroup } from '../../../dal/groups';

async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(HttpStatusCode.MethodNotAllowed).send({ message: 'Only POST requests allowed' });
    }

    const { user } = req.session;
    if (!user) {
      return res.status(HttpStatusCode.Forbidden).send({ message: 'User not logged in' });
    }

    const { name, color } = req.body;
    const id = UID();
    const group = {
      name,
      color,
      id,
      salt: salt(),
    };

    const success = createWatchGroup(user.googleId, group);
    if (success) return res.json({ id });
    return res.status(HttpStatusCode.InternalServerError).end();
  } catch (e) {
    console.error(e);
    return res.status(HttpStatusCode.InternalServerError).end();
  }
}

export default withIronSessionApiRoute(handler, cookiesSettings);
