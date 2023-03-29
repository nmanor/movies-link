import { withIronSessionApiRoute } from 'iron-session/next';
import { HttpStatusCode } from 'axios';
import cookiesSettings from '../../../utils/cookies';
import { addMediaToUser, handleMovie, handleSeries } from '../../../dal/media';

async function handleMedia(mediaId, userId) {
  const handlerFunction = mediaId.startsWith('m') ? handleMovie : handleSeries;
  await handlerFunction(mediaId, userId);
  await addMediaToUser(userId, mediaId, -1);
}

async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(HttpStatusCode.MethodNotAllowed).send({ message: 'Only POST requests allowed' });
    }

    const userId = req.session.user.googleId;
    if (!userId) {
      return res.status(HttpStatusCode.Forbidden).send({ message: 'User not logged in' });
    }

    const { mediaIds } = req.body;
    if (!mediaIds) {
      return res.status(HttpStatusCode.UnprocessableEntity).send({ message: 'Media IDs list must be attached' });
    }

    mediaIds.forEach((mediaId) => handleMedia(mediaId, userId));

    return res.end();
  } catch (e) {
    console.error(e);
    return res.status(500).end();
  }
}
export default withIronSessionApiRoute(handler, cookiesSettings);
