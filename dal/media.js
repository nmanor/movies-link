import { read, write } from './neo4jDriver';

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
                   RETURN COLLECT(m{.id, .name, .posterUrl, character: act.as}) AS result`;
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
