import { withIronSessionApiRoute } from 'iron-session/next';
import cookiesSettings from '../../../utils/cookies';
import { getGroupData } from '../../../dal/groups';
import { generateJoinCode, verifyJoinCode } from '../../../utils/groups';

async function handler(req, res) {
  try {
    const { user: userId, join: joinCode } = req.body;
    if (!userId) {
      return res.status(403).send({ message: 'User not logged in' });
    }

    const { gid: groupId } = req.query;
    if (!groupId) {
      return res.status(404).send({ message: 'No group ID specified' });
    }

    let group = await getGroupData(groupId);
    if (!group) {
      return res.status(404).send({ message: 'Group does not exist' });
    }

    const userIsMember = group.members.some((member) => member.googleId === userId);
    if (!userIsMember && !joinCode) {
      return res.status(401).send({ message: 'User not authorized' });
    }

    if (userIsMember || verifyJoinCode(groupId, group.salt, joinCode)) {
      const hashedId = generateJoinCode(groupId, group.salt);
      delete group.salt;
      group = {
        ...group,
        joinLink: `${process.env.BASE_URL}/group/${groupId}?join=${hashedId}`,
        userIsMember,
        movies: group.movies
          .map((movie) => ({
            ...movie,
            posterUrl: `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${movie.posterUrl}`,
          })),
      };
      return res.json(group);
    }
    return res.status(401).send({ message: 'Wrong join link' });
  } catch (e) {
    console.error(e);
    return res.status(500).end();
  }
}

export default withIronSessionApiRoute(handler, cookiesSettings);
