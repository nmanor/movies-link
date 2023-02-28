import { read, write } from './neo4jDriver';

export async function findMovie(movieId, userId) {
  try {
    const query = ` MATCH (m:Movie {id: $movieId}), (u:User {googleId: $userId})
                    OPTIONAL MATCH (u)-[w:WATCHED]->(m)
                    RETURN m.id AS id, 
                           m.posterUrl AS posterUrl, 
                           m.name AS name, 
                           COUNT(w) <> 0 AS watchedByUser, 
                           m.distributionYear AS distributionYear, 
                           m.duration AS duration`;
    const result = await read(query, { movieId, userId });
    return result[0];
  } catch (e) {
    return null;
  }
}

export async function addMovieToUser(userId, movieId, watchDate) {
  try {
    const query = ` MATCH (u:User {googleId: $userId})
                    MERGE (m:Movie {id: $movieId})
                    MERGE (u)-[w:WATCHED {date: $watchDate}]->(m)
                    WITH m
                    MATCH (a:Actor)-[:ACTED_IN]->(m)
                    RETURN COUNT(a) = 0 AS populationRequired`;
    const result = await write(query, { userId, movieId, watchDate });
    return result[0].populationRequired;
  } catch (e) {
    return null;
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
                   RETURN m.id AS id, m.name AS name, m.posterUrl AS posterUrl, act.as AS character, w.date AS watchDate
                   ORDER BY w.date DESC`;
    return await read(query, { userId, actorId });
  } catch (e) {
    return [];
  }
}

export async function getUserTimeline(userId) {
  try {
    const query = `MATCH (u:User {googleId: $userId})-[w:WATCHED]->(m:Movie)
                   CALL {
                      WITH u, m
                      MATCH (u)-[:WATCHED]->(m1:Movie)<-[:ACTED_IN]-(a:Actor)-[:ACTED_IN]->(m)
                      RETURN COUNT(DISTINCT m1) as movies, COUNT(a) as actors
                   }
                   RETURN m.name AS title, m.posterUrl AS posterUrl, w.date AS date, movies, actors
                   ORDER BY date DESC`;
    return await read(query, { userId });
  } catch (e) {
    return [];
  }
}
