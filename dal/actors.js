import { read, write } from './neo4jDriver';

export default async function getKnownActors(userId, movieId) {
  try {
    const query = `MATCH (:User {googleId: $userId})-[:WATCHED]->(m:Movie)<-[:ACTED_IN]-(a:Actor)-[ai:ACTED_IN]->(:Movie {id: $movieId})
                   RETURN a.id as id, 
                          a.name as name, 
                          a.profilePath as profilePath, 
                          COUNT(m) as movies, 
                          last(collect(m)).name as last, 
                          ai.as AS character
                   ORDER BY movies DESC`;
    const result = await read(query, { userId, movieId });
    return result.map((actor) => ({ ...actor, movies: Number(actor.movies) }));
  } catch (e) {
    return null;
  }
}

export async function addActorsToMovie(movieId, actors) {
  try {
    const params = { movieId };
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

    const query = `MATCH (m:Movie {id: $movieId})
                   ${merges.join('\n')}
                   RETURN true as result`;

    const result = await write(query, params);
    return result[0].result;
  } catch (e) {
    return null;
  }
}
