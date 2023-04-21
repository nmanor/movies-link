import EntityType from './enums';

/**
 * Returns a random number in the specified range.
 * @param min {number} Lower bound of the random range
 * @param max {number} Higher bound of the random range
 * @returns {number} Random number in range [min, max]
 */
export const random = (min = 1, max = 100) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Return random element from list of elements.
 * @param list {any[]} Array of elements
 * @returns {*} Random element from the list
 */
export const randomElement = (list) => list[random(0, list.length - 1)];

/**
 * Convert group name to acronyms of the first and the last words (e.g. Hello world > HW).
 * @param name {string} The name of the group
 * @returns {string} The 2-chars acronyms
 */
export function groupNameToAcronyms(name) {
  let splitName = name.split(/(\s|\.|-|_)/g);
  if (splitName.length === 1) splitName = [...splitName[0]];
  return `${splitName[0][0]}${splitName[splitName.length - 1][0]}`.toUpperCase();
}

/**
 * Crete uniq ID based on random number and the current date
 * @returns {string} A string with random ID
 */
export const UID = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

/**
 * Crete random uniq salt string
 * @returns {string} Random salt string
 */
export const salt = () => (Math.random() + 1).toString(36).substring(2);

/**
 * Get the type of the media based on it's ID
 * @param mediaId {string} the ID of the media
 * @returns {string} One of the options in `MediaType`
 */
export const getMediaType = (mediaId) => (mediaId.startsWith('m') ? EntityType.Movie : EntityType.Series);
