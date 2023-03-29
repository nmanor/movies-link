import axios from 'axios';
import { read, write } from './neo4jDriver';
import { fetchMovieCast, fetchSeriesCast, processCast } from '../utils/actors';
import { addActorsToMedia } from './actors';
import tmdbDateToJsDate from '../utils/dates';

const HOUR = 60;
const MAX_ACTORS = 20;

export async function findMovie(movieId, userId) {
  try {
    const query = `MATCH (m:Movie {id: $movieId}), (u:User {googleId: $userId})
                   OPTIONAL MATCH (u)-[w:WATCHED]->(m)
                   OPTIONAL MATCH (u)-[:MEMBER_OF]->(g:Group)-[gw:WATCHED]->(m)
                   OPTIONAL MATCH (a:Actor)-[:ACTED_IN]->(m)
                   RETURN m.id AS id, 
                          m.posterUrl AS posterUrl, 
                          m.name AS name, 
                          m.distributionYear AS distributionYear, 
                          m.duration AS duration,
                          m.mediaType AS mediaType,
                          {date: w.date} AS watchedByUser,
                          COLLECT(g{.name, .id, .color, date: gw.date}) AS watchedByGroups,
                          COUNT(a) AS numberOfActors`;
    const result = await read(query, { movieId, userId });
    return result[0];
  } catch (e) {
    return null;
  }
}

export async function findSeries(seriesId, userId) {
  try {
    const query = `MATCH (s:Series {id: $seriesId}), (u:User {googleId: $userId})
                   OPTIONAL MATCH (u)-[w:WATCHED]->(s)
                   OPTIONAL MATCH (u)-[:MEMBER_OF]->(g:Group)-[gw:WATCHED]->(s)
                   OPTIONAL MATCH (a:Actor)-[:ACTED_IN]->(s)
                   RETURN s.id AS id, 
                          s.posterUrl AS posterUrl, 
                          s.name AS name, 
                          s.numberOfSeasons AS numberOfSeasons,
                          s.mediaType AS mediaType,
                          {date: w.date} AS watchedByUser,
                          COLLECT(g{.name, .id, .color, date: gw.date}) AS watchedByGroups,
                          COUNT(a) AS numberOfActors`;
    const result = await read(query, { seriesId, userId });
    return result[0];
  } catch (e) {
    return null;
  }
}

export async function addMediaToUser(userId, mediaId, watchDate) {
  try {
    const query = `MATCH (u:User {googleId: $userId}), (m:Media {id: $mediaId})
                   MERGE (u)-[:WATCHED {date: $watchDate}]->(m)`;
    await write(query, { userId, mediaId, watchDate });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function removeMediaFromUser(userId, mediaId) {
  try {
    const query = `MATCH (:User {googleId: $userId})-[w:WATCHED]->(:Media {id: $mediaId})
                   DELETE w`;
    await write(query, { userId, mediaId });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function createMovie(movie) {
  try {
    const query = `MERGE (m:Movie:Media {id: $movieId})
                   ON CREATE SET m.id = $movieId,
                                 m.posterUrl = $posterUrl,
                                 m.name = $name,
                                 m.distributionYear = $distributionYear,
                                 m.duration = $duration,
                                 m.mediaType = 'Movie'
                   RETURN m`;
    const result = await write(query, movie);
    return result[0].m.properties;
  } catch (e) {
    return null;
  }
}

export async function createSeries(series) {
  try {
    const query = `MERGE (s:Series:Media {id: $seriesId})
                   ON CREATE SET s.id = $seriesId,
                                 s.posterUrl = $posterUrl,
                                 s.name = $name,
                                 s.mediaType = 'TV Show',
                                 s.numberOfSeasons = $numberOfSeasons
                   RETURN s`;
    const result = await write(query, series);
    return result[0].s.properties;
  } catch (e) {
    return null;
  }
}

export default async function getWatchedMedias(userId, actorId) {
  try {
    const query = `MATCH (u:User {googleId: $userId})-[w:WATCHED|MEMBER_OF*1..2]->(m:Media)<-[act:ACTED_IN]-(a:Actor {id: $actorId})
                   WITH m, act, LAST(w).date AS date
                   ORDER BY date DESC
                   RETURN COLLECT(DISTINCT m{.id, .name, .posterUrl, character: act.as}) AS result`;
    const result = await read(query, { userId, actorId });
    return result[0].result;
  } catch (e) {
    return [];
  }
}

export async function getUserTimeline(userId) {
  try {
    const query = `MATCH (u:User {googleId: $userId})
                   OPTIONAL MATCH (u)-[w:WATCHED]->(m:Media)
                   WITH m{.*, date: w.date} AS ugm, u
                   OPTIONAL MATCH (u)-[:MEMBER_OF]->(g:Group)-[w:WATCHED]->(m:Media)
                   WITH m{.*, date: w.date, groupName: g.name, groupColor: g.color} AS gm, ugm, u 
                   WITH COLLECT(DISTINCT gm) + COLLECT(DISTINCT ugm) AS media
                   RETURN media`;
    return (await read(query, { userId }))[0].media;
  } catch (e) {
    return [];
  }
}

export async function updateNumberOfSeasons(seriesId, numberOfSeasons) {
  try {
    const query = `MATCH (s:Series {id: $seriesId})
                   SET s.numberOfSeasons = $numberOfSeasons`;
    await write(query, { seriesId, numberOfSeasons });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function getAllUserMediaIds(userId) {
  try {
    const query = `MATCH (:User {googleId: $userId})-[:WATCHED|MEMBER_OF*1..2]-(m:Media)
                   RETURN COLLECT(m.id) AS ids`;
    return (await read(query, { userId }))[0].ids;
  } catch (e) {
    console.error(e);
    return false;
  }
}

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

/**
 * A function that handles the movie, brings all the necessary information about it and adds it
 * to the DB if it does not exist.
 * @param mediaId {string} The ID of the media with `m` prefix (e.g. `m123`)
 * @param userId {string} The ID of the user
 * @returns {Promise<{media: Object, promises: Promise<Awaited<unknown>[]>}>} An object that
 * represents the movie for the user, and a Promise that waits for the end of several actions
 * that are running at the same time
 */
export async function handleMovie(mediaId, userId) {
  if (!mediaId.startsWith('m')) {
    throw new Error('The ID provided is not a movie ID');
  }

  const promises = [];

  let media = await findMovie(mediaId, userId);
  if (!media) {
    promises.push(saveMovieActors(mediaId));
    media = await storeMovieInDB(mediaId);
    media.watchedByUser = { date: null };
    media.watchedByGroups = [];
  } else if (Number(media.numberOfActors) === 0) {
    promises.push(saveMovieActors(mediaId));
  }
  return { media, promises: Promise.all(promises) };
}

/**
 * A function that handles the series, brings all the necessary information about it and adds it
 * to the DB if it does not exist.
 * @param mediaId {string} The ID of the media with `s` prefix (e.g. `s123`)
 * @param userId {string} The ID of the user
 * @returns {Promise<{media: Object, promises: Promise<Awaited<unknown>[]>}>} An object that
 * represents the series for the user, and a Promise that waits for the end of several actions
 * that are running at the same time
 */
export async function handleSeries(mediaId, userId) {
  if (!mediaId.startsWith('s')) {
    throw new Error('The ID provided is not a series ID');
  }

  const promises = [];

  let tmdbMedia;
  let media;
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

  return { media, promises: Promise.all(promises) };
}
