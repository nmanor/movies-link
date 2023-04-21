import { withIronSessionApiRoute } from 'iron-session/next';
import { HttpStatusCode } from 'axios';
import cookiesSettings from '../../../utils/cookies';
import { getMediaType } from '../../../utils/utils';
import EntityType from '../../../utils/enums';
import { fetchMovieCast, fetchSeriesCast, processCast } from '../../../utils/actors';

async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(HttpStatusCode.MethodNotAllowed).send({ message: 'Only POST requests allowed' });
    }

    const { user } = req.session;
    if (!user) {
      return res.status(HttpStatusCode.Forbidden).send({ message: 'User not logged in' });
    }

    const { mediaId, numberOfSeasons } = req.body;
    if (!mediaId) {
      return res.status(HttpStatusCode.UnprocessableEntity).send({ message: 'Missing media ID' });
    }

    const mediaType = getMediaType(mediaId);
    if (mediaType === EntityType.Series && !numberOfSeasons) {
      return res.status(HttpStatusCode.UnprocessableEntity).send({ message: 'Missing number of seasons' });
    }

    let cast;
    if (mediaType === EntityType.Movie) cast = await fetchMovieCast(mediaId);
    else cast = await fetchSeriesCast(1, numberOfSeasons, mediaId);

    const actors = processCast(cast).map((actor) => ({
      ...actor,
      imageUrl: `https://www.themoviedb.org/t/p/original${actor.profilePath}`,
    }));
    return res.json({ actors });
  } catch (e) {
    console.error(e);
    return res.status(HttpStatusCode.InternalServerError).end();
  }
}

export default withIronSessionApiRoute(handler, cookiesSettings);
