import { withIronSessionApiRoute } from 'iron-session/next';
import { HttpStatusCode } from 'axios';
import cookiesSettings from '../../../utils/cookies';
import { removeUserFromGroup } from '../../../dal/groups';

async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(HttpStatusCode.MethodNotAllowed).send({ message: 'Only POST requests allowed' });
    }

    const { user } = req.session;
    if (!user) {
      return res.status(HttpStatusCode.Forbidden).send({ message: 'User not logged in' });
    }

    const { id: groupId } = req.body;
    const success = removeUserFromGroup(user.googleId, groupId);
    return res.json({ success });
  } catch (e) {
    console.error(e);
    return res.status(HttpStatusCode.InternalServerError).json({ success: false });
  }
}

export default withIronSessionApiRoute(handler, cookiesSettings);
