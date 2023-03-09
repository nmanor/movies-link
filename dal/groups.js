import { read, write } from './neo4jDriver';

export async function createWatchGroup(userId, group) {
  try {
    const query = `MATCH (u:User {googleId: $userId})
                   CREATE (u)
                          -[:MEMBER_OF {registrationTime: timestamp()}]->
                          (:Group {id: $id, name: $name, color: $color, salt: $salt, creationTime: timestamp()})`;
    await write(query, { userId, ...group });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function addUserToGroup(userId, groupId) {
  try {
    const query = `MATCH (u:User {googleId: $userId}), (g:Group {id: $groupId})
                   CREATE (u)-[:MEMBER_OF {registrationTime: timestamp()}]->(g)`;
    await write(query, { userId, groupId });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function removeUserFromGroup(userId, groupId) {
  try {
    const query = `MATCH (:User {googleId: $userId})-[m:MEMBER_OF]->(:Group {id: $groupId})
                   DELETE m`;
    await write(query, { userId, groupId });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function getGroupData(groupId) {
  try {
    const query = `MATCH (g:Group {id: $groupId})
                   OPTIONAL MATCH (g)-[:WATCHED]->(m:Movie)
                   OPTIONAL MATCH (u:User)-[:MEMBER_OF]->(g)
                   RETURN g.id AS id, 
                          g.name AS name, 
                          g.color AS accentColor, 
                          g.salt AS salt, 
                          COLLECT(DISTINCT m{.posterUrl, .name, .id}) AS movies, 
                          COLLECT(DISTINCT u{.firstName, .lastName, .image, .googleId}) AS members`;
    const response = await read(query, { groupId });
    return response[0];
  } catch (e) {
    console.error(e);
    return {};
  }
}

export async function getGroupSalt(groupId) {
  try {
    const query = `MATCH (g:Group {id: $groupId})
                   RETURN g.salt AS salt`;
    const response = await read(query, { groupId });
    return response[0].salt;
  } catch (e) {
    console.error(e);
    return {};
  }
}
