import axios, { HttpStatusCode } from 'axios';
import { withIronSessionApiRoute } from 'iron-session/next';
import tmdbDateToJsDate from '../../../utils/dates';
import cookiesSettings from '../../../utils/cookies';
import getKnownActors, { addActorsToMedia } from '../../../dal/actors';
import {
  createMovie, createSeries, findMovie, findSeries, updateNumberOfSeasons,
} from '../../../dal/media';
import MediaType from '../../../utils/enums';
import { getMediaType } from '../../../utils/utils';
import { fetchMovieCast, fetchSeriesCast, processCast } from '../../../utils/actors';

const HOUR = 60;
const MAX_ACTORS = 20;
let promises = [];

async function saveMovieActors(mediaId) {
  const cast = await fetchMovieCast(mediaId);
  await addActorsToMedia(mediaId, processCast(cast, MAX_ACTORS));
}

async function updateSeriesActors(series, tmdbSeries, seriesId) {
  const prevNumberOfSeasons = series ? series.numberOfSeasons || 0 : 0;
  const newNumberOfSeasons = tmdbSeries.number_of_seasons;

  if (prevNumberOfSeasons === newNumberOfSeasons) return;
  const actors = await fetchSeriesCast(prevNumberOfSeasons, newNumberOfSeasons, seriesId);
  if (actors) await addActorsToMedia(seriesId, processCast(actors, MAX_ACTORS));
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
      return res.status(HttpStatusCode.Forbidden).send({ message: 'User not logged in' });
    }

    const { mid: mediaId } = req.query;
    if (!mediaId) {
      return res.status(HttpStatusCode.UnprocessableEntity).send({ message: 'Missing media ID' });
    }

    const mediaType = getMediaType(mediaId);

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

      media.posterUrl = tmdbMedia.poster_path;
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
