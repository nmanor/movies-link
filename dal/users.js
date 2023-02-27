import { write } from './neo4jDriver';

export default async function login(user) {
  try {
    const query = ` MERGE (u:User {googleId: $googleId})
                    ON CREATE SET u={ googleId: $googleId,
                                      firstName: $firstName, 
                                      lastName: $lastName, 
                                      email: $email, 
                                      image: $image, 
                                      creationTime: timestamp(), 
                                      lastLogin: timestamp()}
                    ON MATCH SET u.lastLogin = timestamp()
                    RETURN u`;
    const result = await write(query, user);
    return result[0].u.properties;
  } catch (e) {
    return null;
  }
}
