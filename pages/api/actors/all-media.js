import { withIronSessionApiRoute } from 'iron-session/next';
import axios, { HttpStatusCode } from 'axios';
import cookiesSettings from '../../../utils/cookies';
import tmdbDateToJsDate from '../../../utils/dates';

async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(HttpStatusCode.MethodNotAllowed).send({ message: 'Only POST requests allowed' });
    }

    const { user } = req.session;
    if (!user) {
      return res.status(HttpStatusCode.Forbidden).send({ message: 'User not logged in' });
    }

    const { actorId } = req.body;
    if (!actorId) {
      return res.status(HttpStatusCode.UnprocessableEntity).send({ message: 'Missing actor ID' });
    }

    const response = await axios.get(`https://api.themoviedb.org/3/person/${actorId}/combined_credits?api_key=${process.env.TMDB_KEY}`);
    const media = response.data.cast
      .filter((m) => tmdbDateToJsDate(m.release_date || m.first_air_date || '3000-12-12').getFullYear() <= new Date().getFullYear() + 1)
      .sort((m1, m2) => m2.popularity - m1.popularity)
      .map((m) => ({
        id: `${m.media_type.toLowerCase() === 'movie' ? 'm' : 's'}${m.id}`,
        name: m.name || m.title,
        posterUrl: `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${m.poster_path}`,
        character: m.character,
      }));

    return res.json({ media });
  } catch (e) {
    console.error(e);
    return res.status(HttpStatusCode.InternalServerError).end();
  }
}

export default withIronSessionApiRoute(handler, cookiesSettings);
