import { withIronSessionApiRoute } from 'iron-session/next';
import cookiesSettings from '../../../utils/cookies';
import { addUserToGroup, getGroupSalt } from '../../../dal/groups';
import { verifyJoinCode } from '../../../utils/groups';

async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send({ message: 'Only POST requests allowed' });
    }

    const { user } = req.session;
    if (!user) {
      return res.status(403).send({ message: 'User not logged in' });
    }

    const { id: groupId, joinCode } = req.body;
    const salt = await getGroupSalt(groupId);
    if (!verifyJoinCode(groupId, salt, joinCode)) {
      return res.status(401).send({ message: 'Wrong join link' });
    }

    const success = addUserToGroup(user.googleId, groupId);
    return res.json({ success });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false });
  }
}

export default withIronSessionApiRoute(handler, cookiesSettings);
