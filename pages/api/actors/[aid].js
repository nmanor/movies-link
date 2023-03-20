import axios from 'axios';
import getWatchedMedias from '../../../dal/media';

function genderIdToString(gender) {
  if (gender === 1) return 'Female';
  if (gender === 2) return 'Male';
  return 'Other';
}

export default async function handler(req, res) {
  try {
    const { user: userId } = req.body;
    if (!userId) {
      return res.status(403).send({ message: 'User not logged in' });
    }

    const { aid: actorId } = req.query;
    if (!actorId) {
      return res.status(404).redirect('/404');
    }

    const requests = [
      axios.get(`https://api.themoviedb.org/3/person/${actorId}?api_key=${process.env.TMDB_KEY}&language=en-US`),
      axios.get(`https://api.themoviedb.org/3/person/${actorId}/external_ids?api_key=${process.env.TMDB_KEY}&language=en-US`)];
    const [{
      data: {
        name, birthday, place_of_birth: placeOfBirth, gender, profile_path: profileUrl,
      },
    },
    {
      data:
            { instagram_id: instagram, facebook_id: facebook, twitter_id: twitter },
    }] = await axios.all(requests);

    const watchedMovies = await getWatchedMedias(userId, Number(actorId));

    const result = {
      id: actorId,
      name,
      birthday,
      placeOfBirth: placeOfBirth.split(',').pop().trim(),
      gender: genderIdToString(gender),
      profileUrl: `https://image.tmdb.org/t/p/w780${profileUrl}`,
      instagram: instagram ? `https://www.instagram.com/${instagram}` : null,
      facebook: facebook ? `https://www.facebook.com/${facebook}` : null,
      twitter: twitter ? `https://twitter.com/${twitter}` : null,
      watchedMovies: watchedMovies
        .map((movie) => ({
          ...movie,
          posterUrl: `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${movie.posterUrl}`,
        })),
    };

    return res.json(result);
  } catch (e) {
    return res.status(404).end();
  }
}
