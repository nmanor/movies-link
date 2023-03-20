import { withIronSessionApiRoute } from 'iron-session/next';
import { HttpStatusCode } from 'axios';
import cookiesSettings from '../../../utils/cookies';
import { addUserToGroup, getGroupSalt } from '../../../dal/groups';
import { verifyJoinCode } from '../../../utils/groups';

async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(HttpStatusCode.MethodNotAllowed).send({ message: 'Only POST requests allowed' });
    }

    const { user } = req.session;
    if (!user) {
      return res.status(HttpStatusCode.Forbidden).send({ message: 'User not logged in' });
    }

    const { id: groupId, joinCode } = req.body;
    const salt = await getGroupSalt(groupId);
    if (!verifyJoinCode(groupId, salt, joinCode)) {
      return res.status(HttpStatusCode.Unauthorized).send({ message: 'Wrong join link' });
    }

    const success = addUserToGroup(user.googleId, groupId);
    return res.json({ success });
  } catch (e) {
    console.error(e);
    return res.status(HttpStatusCode.InternalServerError).json({ success: false });
  }
}

export default withIronSessionApiRoute(handler, cookiesSettings);
