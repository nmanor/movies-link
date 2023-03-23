import { read, write } from './neo4jDriver';

export default async function login(user) {
  try {
    const query = `MERGE (u:User {googleId: $googleId})
                   ON CREATE SET u={ googleId: $googleId,
                                     firstName: $firstName, 
                                     lastName: $lastName, 
                                     email: $email, 
                                     image: $image, 
                                     creationTime: timestamp(), 
                                     lastLogin: timestamp()}
                   ON MATCH SET u.lastLogin = timestamp()
                   WITH u
                   OPTIONAL MATCH (u)-[:MEMBER_OF]->(g:Group)
                   RETURN u, COLLECT(g{.name, .id, .color}) AS groups`;
    const result = await write(query, user);
    return { ...result[0].u.properties, groups: result[0].groups };
  } catch (e) {
    return null;
  }
}

export async function getMediaPerMonth(userId) {
  try {
    const query = `MATCH (:User {googleId: $userId})-[w:WATCHED|MEMBER_OF*1..2]->(:Media)
                   WHERE LAST(w).date >= timestamp() - 31536000000
                   RETURN datetime({epochmillis: toInteger(LAST(w).date)}).month AS month, COUNT(w) AS media
                   ORDER BY month`;
    const result = await read(query, { userId });
    return result
      .reduce((prev, curr) => ({ ...prev, [Number(curr.month)]: Number(curr.media) }), {});
  } catch (e) {
    console.error(e);
    return {};
  }
}

export async function getUserStatistics(userId) {
  try {
    const query = `MATCH (u:User {googleId: $userId})
                   OPTIONAL MATCH (u)-[wm:WATCHED|MEMBER_OF*1..2]->(m:Movie)
                   WITH u, COUNT(DISTINCT m) AS movies, SUM(m.duration[0]) * 60 + SUM(m.duration[1]) AS moviesTime
                   OPTIONAL MATCH (u)-[ws:WATCHED|MEMBER_OF*1..2]->(s:Series)
                   WITH movies, moviesTime, COUNT(DISTINCT s) AS series, SUM(s.numberOfSeasons) AS numberOfSeasons
                   RETURN *`;
    const result = await read(query, { userId });
    return result[0];
  } catch (e) {
    console.error(e);
    return {
      movies: 0, series: 0, moviesTime: 0, numberOfSeasons: 0,
    };
  }
}
