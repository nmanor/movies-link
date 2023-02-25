import { getIronSession } from 'iron-session';
import { withIronSessionSsr } from 'iron-session/next';
import redirectToPage from '../utils/redirectToPage';
import cookiesSettings from '../utils/cookies';

/**
 * Warp getServerSideProps function with user check. Redirect to login page if user not logged in.
 * @param callback function that run getServerSideProps functionality and can get `context`
 * with field named `user` as parameter
 * @returns {function} getServerSideProps with `user` field inside the `context`
 */
export default function getServerSidePropsLoginMiddleware(callback) {
  return withIronSessionSsr(async (context) => {
    const { req } = context;

    if (!req.session.user) {
      return redirectToPage('/login');
    }

    return callback(context);
  }, cookiesSettings);
}
