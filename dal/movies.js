import { read, write } from './neo4jDriver';

export async function findMovie(movieId, userId) {
  try {
    const query = ` MATCH (m:Movie {id: $movieId}), (u:User {googleId: $userId})
                    OPTIONAL MATCH (u)-[w:WATCHED]->(m)
                    RETURN m.id AS id, 
                           m.posterUrl AS posterUrl, 
                           m.name AS name, 
                           m.distributionYear AS distributionYear, 
                           m.duration AS duration,
                           m.mediaType AS mediaType,
                           COUNT(w) <> 0 AS watchedByUser`;
    const result = await read(query, { movieId, userId });
    return result[0];
  } catch (e) {
    return null;
  }
}

export async function addMovieToUser(userId, movieId, watchDate) {
  try {
    const query = `MATCH (u:User {googleId: $userId}), (m:Movie {id: $movieId})
                   MERGE (u)-[:WATCHED {date: $watchDate}]->(m)`;
    await write(query, { userId, movieId, watchDate });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function removeMovieFromUser(userId, movieId) {
  try {
    const query = `MATCH (:User {googleId: $userId})-[w:WATCHED]->(:Movie {id: $movieId})
                   DELETE w`;
    await write(query, { userId, movieId });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function createMovie(movie) {
  try {
    const query = ` MERGE (m:Movie {id: $movieId})
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

export default async function getWatchedMovies(userId, actorId) {
  try {
    const query = `MATCH (a:Actor {id: $actorId})-[act:ACTED_IN]->(m:Movie)<-[w:WATCHED]-(u:User {googleId: $userId})
                   RETURN m.id AS id, 
                          m.name AS name, 
                          m.posterUrl AS posterUrl, 
                          act.as AS character, 
                          w.date AS watchDate
                   ORDER BY w.date DESC`;
    return await read(query, { userId, actorId });
  } catch (e) {
    return [];
  }
}

export async function getUserTimeline(userId) {
  try {
    const query = `MATCH (u:User {googleId: $userId})
                   OPTIONAL MATCH (u)-[w:WATCHED]->(m:Movie)
                   WITH m{.*, date: w.date} AS ugm, u
                   OPTIONAL MATCH (u)-[:MEMBER_OF]->(g:Group)-[w:WATCHED]->(m:Movie)
                   WITH m{.*, date: w.date, groupName: g.name, groupColor: g.color} AS gm, ugm, u 
                   WITH COLLECT(DISTINCT gm) + COLLECT(DISTINCT ugm) AS movies
                   RETURN movies`;
    return (await read(query, { userId }))[0].movies;
  } catch (e) {
    return [];
  }
}
