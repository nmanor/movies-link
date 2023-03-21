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

/*
MATCH (u:User {googleId: '118301174708090486372'})
OPTIONAL MATCH (u)-[wm:WATCHED|MEMBER_OF*1..2]->(m:Movie)
OPTIONAL MATCH (u)-[ws:WATCHED|MEMBER_OF*1..2]->(s:Series)
RETURN COUNT(DISTINCT m) AS movies, COUNT(DISTINCT s) AS series, SUM(m.duration[1]) + SUM(m.duration[0]) * 60 AS moviesTime, SUM(s.numberOfSeasons) AS numberOfSeasons
 */
