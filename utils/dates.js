/**
 * Convert date string in TMDB style to JavaScript date object
 * @param date{string} The TMDB date string (`YYYY-DD-MM`)
 * @returns {Date} JavaScript date object
 */
export default function tmdbDateToJsDate(date) {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Returns a greeting based on the current time of day.
 * @param userName {string|null} The username to greet [optional].
 * @returns {string} A greeting based on the current time of day.
 */
export function greetByTime(userName = null) {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const postfix = userName ? `, ${userName}!` : '!';

  if (currentHour < 5) {
    return `Good night${postfix}`;
  } if (currentHour < 12) {
    return `Good morning${postfix}`;
  } if (currentHour < 18) {
    return `Good afternoon${postfix}`;
  } if (currentHour < 22) {
    return `Good evening${postfix}`;
  }
  return `Good night${postfix}`;
}
