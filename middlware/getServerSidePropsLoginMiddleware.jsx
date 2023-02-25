import { getIronSession } from 'iron-session';
import redirectToPage from '../utils/redirectToPage';
import cookiesSettings from '../utils/cookies';

/**
 * Warp getServerSideProps function with user check. Redirect to login page if user not logged in.
 * @param callback function that run getServerSideProps functionality and can get `context`
 * with field named `user` as parameter
 * @returns {function} getServerSideProps with `user` field inside the `context`
 */
export default function getServerSidePropsLoginMiddleware(callback) {
  return async function getServerSideProps(context) {
    const { req, res } = context;
    const session = await getIronSession(req, res, cookiesSettings);

    if (!session.user) {
      return redirectToPage('/login');
    }

    context.user = session.user;
    return callback(context);
  };
}
