import axios from 'axios';
import { withIronSessionApiRoute } from 'iron-session/next';
import tmdbDateToJsDate from '../../../utils/dates';
import cookiesSettings from '../../../utils/cookies';
import getKnownActors, { addActorsToMovie } from '../../../dal/actors';
import { createMovie, findMovie } from '../../../dal/movies';

const HOUR = 60;
const MAX_ACTORS = 50;

async function handler(req, res) {
  const { user: userId } = req.body;
  if (!userId) {
    return res.status(403).send({ message: 'User not logged in' });
  }

  const { mid: movieId } = req.query;
  if (!movieId) {
    return res.status(404).redirect('/404');
  }

  let movie = await findMovie(movieId, userId);
  if (!movie) {
    const requests = [
      axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_KEY}`),
      axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.TMDB_KEY}`)];
    const [response1, response2] = await axios.all(requests);

    const {
      data: {
        poster_path: posterUrl,
        title: name,
        release_date: releaseDate,
        runtime,
      },
    } = response1;
    movie = {
      movieId,
      posterUrl,
      name,
      distributionYear: tmdbDateToJsDate(releaseDate).getFullYear(),
      duration: [Math.floor(runtime / HOUR), runtime % HOUR],
    };
    movie = await createMovie(movie);
    movie.watchedByUser = { date: null };
    movie.watchedByGroups = [];

    const { data: { cast } } = response2;
    const actors = cast
      .filter((actor) => actor.known_for_department.toLowerCase() === 'acting')
      .sort((a1, a2) => Number(a1.order) - Number(a2.order))
      .slice(0, MAX_ACTORS)
      .map((actor) => ({
        id: actor.id,
        name: actor.name,
        character: actor.character,
        profilePath: actor.profile_path,
      }));
    await addActorsToMovie(movieId, actors);
  }

  let actors = await getKnownActors(userId, movieId);
  actors = actors.map((actor) => ({
    imageUrl: `https://www.themoviedb.org/t/p/original${actor.profilePath}`,
    fullName: actor.name,
    lastMovie: actor.last,
    totalNumOfMovies: actor.movies,
    id: actor.id,
    character: actor.character,
  }));

  const result = {
    ...movie,
    id: movie.id,
    posterUrl: `${process.env.TMDB_IMAGE_PREFIX}${movie.posterUrl}`,
    knownActors: actors,
    duration: { hours: movie.duration[0], minutes: movie.duration[1] },
  };

  return res.json(result);
}

export default withIronSessionApiRoute(handler, cookiesSettings);
