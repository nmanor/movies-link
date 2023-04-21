import { withIronSessionApiRoute } from 'iron-session/next';
import axios, { HttpStatusCode } from 'axios';
import cookiesSettings from '../../../utils/cookies';
import EntityType from '../../../utils/enums';

async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(HttpStatusCode.MethodNotAllowed).send({ message: 'Only POST requests allowed' });
    }

    const { googleId } = req.session.user;
    if (!googleId) {
      return res.status(HttpStatusCode.Forbidden).send({ message: 'User not logged in' });
    }

    const { id: mediaId } = req.body;
    if (!mediaId) {
      return res.status(HttpStatusCode.UnprocessableEntity).send({ message: 'Media ID not found' });
    }

    const mediaType = mediaId.startsWith('m') ? EntityType.Movie : EntityType.Series;

    let response;
    if (mediaType === EntityType.Movie) {
      response = await axios.get(`https://api.themoviedb.org/3/movie/${mediaId.slice(1, mediaId.length)}/recommendations?api_key=${process.env.TMDB_KEY}&language=en-US`);
    } else {
      response = await axios.get(`https://api.themoviedb.org/3/tv/${mediaId.slice(1, mediaId.length)}/recommendations?api_key=${process.env.TMDB_KEY}&language=en-US`);
    }

    const result = response.data.results.map((media) => {
      const date = media.release_date || media.first_air_date || '--Unknown';
      return {
        id: `${mediaType === EntityType.Movie ? 'm' : 's'}${media.id}`,
        title: media.title || media.name,
        releaseYear: date.split('-')[0],
        mediaType,
      };
    });
    return res.send(result);
  } catch (e) {
    console.error(e);
    return res.status(500).end();
  }
}
export default withIronSessionApiRoute(handler, cookiesSettings);
