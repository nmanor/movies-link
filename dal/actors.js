import { read, write } from './neo4jDriver';

export default async function getKnownActors(userId, mediaId) {
  try {
    const query = `MATCH (:User {googleId: $userId})-[w:WATCHED|MEMBER_OF*1..2]->(m:Media)<-[:ACTED_IN]-
                         (a:Actor)-[ai:ACTED_IN]->(:Media {id: $mediaId})
                   WITH a, ai, m, LAST(w).date AS d
                   ORDER BY d
                   RETURN a.id as id, 
                          a.name as name, 
                          a.profilePath as profilePath, 
                          COUNT(DISTINCT m) as media, 
                          LAST(COLLECT(m)).name as last, 
                          ai.as AS character
                   ORDER BY media DESC`;
    const result = await read(query, { userId, mediaId });
    return result.map((actor) => ({ ...actor, media: Number(actor.media) }));
  } catch (e) {
    return null;
  }
}

export async function addActorsToMedia(mediaId, actors) {
  try {
    const params = { mediaId };
    const merges = [];

    actors.forEach((actor, i) => {
      const id = `id${i}`;
      const name = `name${i}`;
      const character = `character${i}`;
      const profilePath = `profilePath${i}`;
      const node = `a${i}`;

      const merge = `MERGE (${node}:Actor {id: $${id}})
                     ON CREATE SET ${node}.id = $${id}, ${node}.name = $${name}, ${node}.profilePath = $${profilePath}
                     MERGE (${node})-[:ACTED_IN {as: $${character}}]->(m)`;

      params[id] = actor.id;
      params[name] = actor.name;
      params[character] = actor.character;
      params[profilePath] = actor.profilePath;
      merges.push(merge);
    });

    const query = `MATCH (m:Media {id: $mediaId})
                   ${merges.join('\n')}
                   RETURN true as result`;

    const result = await write(query, params);
    return result[0].result;
  } catch (e) {
    return null;
  }
}
