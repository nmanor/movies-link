import { withIronSessionApiRoute } from 'iron-session/next';
import { HttpStatusCode } from 'axios';
import cookiesSettings from '../../../utils/cookies';
import { getUserStatistics } from '../../../dal/users';

async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(HttpStatusCode.MethodNotAllowed).send({ message: 'Only POST requests allowed' });
    }

    const { user: userId } = req.body;
    if (!userId) {
      return res.status(HttpStatusCode.Forbidden).send({ message: 'User not logged in' });
    }

    let result = await getUserStatistics(userId);
    result = Object
      .entries(result)
      .reduce((prev, [key, value]) => ({ ...prev, [key]: Number(value) }), {});

    return res.send(result);
  } catch (e) {
    console.error(e);
    return res.status(HttpStatusCode.InternalServerError).end();
  }
}

export default withIronSessionApiRoute(handler, cookiesSettings);
