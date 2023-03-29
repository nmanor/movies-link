import { HttpStatusCode } from 'axios';
import { withIronSessionApiRoute } from 'iron-session/next';
import cookiesSettings from '../../../utils/cookies';
import getKnownActors from '../../../dal/actors';
import MediaType from '../../../utils/enums';
import { getMediaType } from '../../../utils/utils';
import { handleMovie, handleSeries } from '../../../dal/media';

async function handler(req, res) {
  try {
    const { user: userId } = req.body;
    if (!userId) {
      return res.status(HttpStatusCode.Forbidden).send({ message: 'User not logged in' });
    }

    const { mid: mediaId } = req.query;
    if (!mediaId) {
      return res.status(HttpStatusCode.UnprocessableEntity).send({ message: 'Missing media ID' });
    }

    const mediaType = getMediaType(mediaId);

    let media;
    let promises;
    if (mediaType === MediaType.Movie) {
      const result = await handleMovie(mediaId, userId);
      media = result.media;
      promises = result.promises;
    } else {
      const result = await handleSeries(mediaId, userId);
      media = result.media;
      promises = result.promises;
    }

    // wait for all the async functions to finish
    await promises;

    let actors = await getKnownActors(userId, mediaId);
    actors = actors.map((actor) => ({
      imageUrl: `https://www.themoviedb.org/t/p/original${actor.profilePath}`,
      fullName: actor.name,
      lastMovie: actor.last,
      totalNumOfMovies: actor.media,
      id: actor.id,
      character: actor.character,
    }));

    const result = {
      ...media,
      id: media.id,
      posterUrl: `${process.env.TMDB_IMAGE_PREFIX}${media.posterUrl}`,
      knownActors: actors,
    };

    if (mediaType === MediaType.Movie) {
      result.duration = { hours: media.duration[0], minutes: media.duration[1] };
    }

    return res.json(result);
  } catch (e) {
    console.error(e);
    return res.status(HttpStatusCode.InternalServerError);
  }
}

export default withIronSessionApiRoute(handler, cookiesSettings);
