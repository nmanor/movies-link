import { getIronSession } from 'iron-session';
import passport from '../../../utils/passport';
import login from '../../../dal/users';
import cookiesSettings from '../../../utils/cookies';

export default async function handler(req, res, next) {
  passport.authenticate('google', { failureRedirect: '/login' }, async (err, user) => {
    try {
      if (user) {
        const {
          id: googleId, name: { givenName: firstName, familyName: lastName }, emails, photos,
        } = user;
        const email = emails[0] ? emails[0].value : undefined;
        const image = photos[0] ? photos[0].value : undefined;

        const session = await getIronSession(req, res, cookiesSettings);
        session.user = await login({
          googleId, firstName, lastName, email, image,
        });
        await session.save();

        if (user.creationTime === user.lastLogin) {
          res.redirect('/initial-recommendation');
        } else {
          res.redirect('/');
        }
      } else {
        res.redirect('/login');
      }
    } catch (e) {
      console.error(e);
      res.redirect('/404');
    }
  })(req, res, next);
}
