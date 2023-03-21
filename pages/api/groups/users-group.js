import { withIronSessionApiRoute } from 'iron-session/next';
import { HttpStatusCode } from 'axios';
import cookiesSettings from '../../../utils/cookies';
import { getUsersGroup } from '../../../dal/groups';

async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(HttpStatusCode.MethodNotAllowed).send({ message: 'Only POST requests allowed' });
    }

    const { user: userId } = req.body;
    if (!userId) {
      return res.status(HttpStatusCode.Forbidden).send({ message: 'User not logged in' });
    }

    const groups = await getUsersGroup(userId);
    return res.send(groups);
  } catch (e) {
    console.error(e);
    return res.status(HttpStatusCode.InternalServerError).end();
  }
}

export default withIronSessionApiRoute(handler, cookiesSettings);
