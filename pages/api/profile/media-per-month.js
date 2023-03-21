import { withIronSessionApiRoute } from 'iron-session/next';
import { HttpStatusCode } from 'axios';
import cookiesSettings from '../../../utils/cookies';
import { getMediaPerMonth } from '../../../dal/users';

async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(HttpStatusCode.MethodNotAllowed).send({ message: 'Only POST requests allowed' });
    }

    const { user: userId } = req.body;
    if (!userId) {
      return res.status(HttpStatusCode.Forbidden).send({ message: 'User not logged in' });
    }

    const result = await getMediaPerMonth(userId);
    const mediaPerMonth = {};
    for (let month = 1; month <= 12; month += 1) {
      mediaPerMonth[month] = result[month] || 0;
    }

    return res.send(mediaPerMonth);
  } catch (e) {
    console.error(e);
    return res.status(HttpStatusCode.InternalServerError).end();
  }
}

export default withIronSessionApiRoute(handler, cookiesSettings);
