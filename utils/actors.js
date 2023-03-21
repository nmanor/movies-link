import axios from 'axios';

/**
 * Fetch all cast of series in seasons range
 * @param firstSeason {number} The first season to fetch the cast
 * @param lastSeason {number} The last season to fetch the cast
 * @param seriesId {number|string} The ID of the series with `s` prefix
 * @returns {Promise<any[]>} List of all the cast of the series
 */
export async function fetchSeriesCast(firstSeason, lastSeason, seriesId) {
  if (firstSeason > lastSeason) {
    throw new Error(`First season can't be bigger than the last (got ${firstSeason} < ${lastSeason})`);
  }

  const requests = [];
  for (let season = firstSeason + 1; season <= lastSeason; season += 1) {
    requests.push(axios.get(`https://api.themoviedb.org/3/tv/${seriesId.slice(1)}/season/${season}/credits?api_key=${process.env.TMDB_KEY}`));
  }

  const responses = await Promise.all(requests);
  const actors = [];
  responses.forEach(({ data: { cast } }) => actors.push(...cast));
  return actors.filter((a1, i, self) => self.findIndex((a2) => a2.id === a1.id) === i);
}

/**
 * Fetch all cast of movie
 * @param mediaId {number|string} The ID of the movie with `m` prefix
 * @returns {Promise<any[]>} List of all the cast of the movie
 */
export async function fetchMovieCast(mediaId) {
  const response = await axios.get(`https://api.themoviedb.org/3/movie/${mediaId.slice(1)}/credits?api_key=${process.env.TMDB_KEY}`);
  const { data: { cast } } = response;
  return cast;
}

/**
 * Process list of cast into actors form
 * @param cast {Object[]} The list of all the cast
 * @param maxActors {number} The maximum number of actors to return
 * @returns {Object[]} List of actors only
 */
export const processCast = (cast, maxActors = Number.MAX_VALUE) => cast
  .filter((member) => member.known_for_department.toLowerCase() === 'acting')
  .sort((a1, a2) => Number(a1.order) - Number(a2.order))
  .slice(0, maxActors)
  .map((actor) => ({
    id: actor.id,
    name: actor.name,
    character: actor.character,
    profilePath: actor.profile_path,
  }));
