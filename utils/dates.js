/**
 * Convert date string in TMDB style to JavaScript date object
 * @param date{string} The TMDB date string (`YYYY-DD-MM`)
 * @returns {Date} JavaScript date object
 */
export default function tmdbDateToJsDate(date) {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
}
