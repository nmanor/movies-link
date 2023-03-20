import axios, { HttpStatusCode } from 'axios';
import { withIronSessionApiRoute } from 'iron-session/next';
import tmdbDateToJsDate from '../../../utils/dates';
import cookiesSettings from '../../../utils/cookies';
import getKnownActors, { addActorsToMedia } from '../../../dal/actors';
import {
  createMovie, createSeries, findMovie, findSeries, updateNumberOfSeasons,
} from '../../../dal/media';
import MediaType from '../../../utils/enums';

const HOUR = 60;
const MAX_ACTORS = 20;
let promises = [];

const processCast = (cast) => cast
  .filter((member) => member.known_for_department.toLowerCase() === 'acting')
  .sort((a1, a2) => Number(a1.order) - Number(a2.order))
  .slice(0, MAX_ACTORS)
  .map((actor) => ({
    id: actor.id,
    name: actor.name,
    character: actor.character,
    profilePath: actor.profile_path,
  }));

async function saveMovieActors(mediaId) {
  const response = await axios.get(`https://api.themoviedb.org/3/movie/${mediaId.slice(1)}/credits?api_key=${process.env.TMDB_KEY}`);
  const { data: { cast } } = response;
  await addActorsToMedia(mediaId, processCast(cast));
}

async function updateSeriesActors(series, tmdbSeries, seriesId) {
  const prevNumberOfSeasons = series ? series.numberOfSeasons || 0 : 0;
  const newNumberOfSeasons = tmdbSeries.number_of_seasons;

  if (prevNumberOfSeasons === newNumberOfSeasons) return;

  const requests = [];
  for (let season = prevNumberOfSeasons + 1; season <= newNumberOfSeasons; season += 1) {
    requests.push(axios.get(`https://api.themoviedb.org/3/tv/${seriesId.slice(1)}/season/${season}/credits?api_key=${process.env.TMDB_KEY}`));
  }

  const responses = await Promise.all(requests);
  const actors = new Set();
  responses
    .forEach(({ data: { cast } }) => cast
      .forEach((member) => actors.add(member)));

  if (actors) await addActorsToMedia(seriesId, processCast([...new Set(actors)]));
}

async function storeMovieInDB(mediaId) {
  const response = await axios.get(`https://api.themoviedb.org/3/movie/${mediaId.slice(1)}?api_key=${process.env.TMDB_KEY}`);

  const {
    data: {
      poster_path: posterUrl,
      title: name,
      release_date: releaseDate,
      runtime,
    },
  } = response;

  const media = {
    movieId: mediaId,
    posterUrl,
    name,
    distributionYear: tmdbDateToJsDate(releaseDate).getFullYear(),
    duration: [Math.floor(runtime / HOUR), runtime % HOUR],
  };

  return createMovie(media);
}

async function storeSeriesInDB(mediaId, data) {
  const { poster_path: posterUrl, name, number_of_seasons: numberOfSeasons } = data;

  const media = {
    seriesId: mediaId,
    posterUrl,
    numberOfSeasons,
    name,
  };

  return createSeries(media);
}

async function handler(req, res) {
  try {
    const { user: userId } = req.body;
    if (!userId) {
      return res.status(403).send({ message: 'User not logged in' });
    }

    const { mid: mediaId } = req.query;
    if (!mediaId) {
      return res.status(404).redirect('/404');
    }

    const mediaType = mediaId.startsWith('m') ? MediaType.Movie : MediaType.Series;

    promises = [];
    let media;
    if (mediaType === MediaType.Movie) {
      media = await findMovie(mediaId, userId);
      if (!media) {
        promises.push(saveMovieActors(mediaId));
        media = await storeMovieInDB(mediaId);
        media.watchedByUser = { date: null };
        media.watchedByGroups = [];
      }
    } else {
      let tmdbMedia;
      [media, tmdbMedia] = await Promise.all([
        findSeries(mediaId, userId),
        axios.get(`https://api.themoviedb.org/3/tv/${mediaId.slice(1)}?api_key=${process.env.TMDB_KEY}`),
      ]);

      tmdbMedia = tmdbMedia.data;

      promises.push(updateSeriesActors(media, tmdbMedia, mediaId));

      if (!media) {
        media = await storeSeriesInDB(mediaId, tmdbMedia);
        media.watchedByUser = { date: null };
        media.watchedByGroups = [];
      } else if (media.numberOfSeasons !== tmdbMedia.number_of_seasons) {
        promises.push(updateNumberOfSeasons(mediaId, tmdbMedia.number_of_seasons));
        media.numberOfSeasons = tmdbMedia.number_of_seasons;
      }

      media.firstAirDate = tmdbDateToJsDate(tmdbMedia.first_air_date).getFullYear();
      media.lastAirDate = tmdbMedia.status.toLowerCase() === 'ended'
        ? tmdbDateToJsDate(tmdbMedia.last_air_date).getFullYear()
        : 'present';
    }

    // wait for all the async functions to finish
    await Promise.all(promises);

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
