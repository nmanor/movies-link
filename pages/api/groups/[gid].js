import { withIronSessionApiRoute } from 'iron-session/next';
import { HttpStatusCode } from 'axios';
import cookiesSettings from '../../../utils/cookies';
import { getGroupData } from '../../../dal/groups';
import { generateJoinCode, verifyJoinCode } from '../../../utils/groups';

async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(HttpStatusCode.MethodNotAllowed).send({ message: 'Only POST requests allowed' });
    }

    const { user: userId, join: joinCode } = req.body;
    if (!userId) {
      return res.status(HttpStatusCode.Forbidden).send({ message: 'User not logged in' });
    }

    const { gid: groupId } = req.query;
    if (!groupId) {
      return res.status(HttpStatusCode.UnprocessableEntity).send({ message: 'No group ID specified' });
    }

    let group = await getGroupData(groupId);
    if (!group) {
      return res.status(HttpStatusCode.NotFound).send({ message: 'Group does not exist' });
    }

    const userIsMember = group.members.some((member) => member.googleId === userId);
    if (!userIsMember && !joinCode) {
      return res.status(HttpStatusCode.Unauthorized).send({ message: 'User not authorized' });
    }

    if (userIsMember || verifyJoinCode(groupId, group.salt, joinCode)) {
      const hashedId = generateJoinCode(groupId, group.salt);
      delete group.salt;
      group = {
        ...group,
        joinLink: `${process.env.BASE_URL}/group/${groupId}?join=${hashedId}`,
        userIsMember,
        movies: group.media
          .map((movie) => ({
            ...movie,
            posterUrl: `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${movie.posterUrl}`,
          })),
      };
      return res.json(group);
    }
    return res.status(HttpStatusCode.Unauthorized).send({ message: 'Wrong join link' });
  } catch (e) {
    console.error(e);
    return res.status(HttpStatusCode.InternalServerError).end();
  }
}

export default withIronSessionApiRoute(handler, cookiesSettings);
