import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/callback',
  },
  ((accessToken, refreshToken, profile, done) =>
  // You can add code here to save the user's information to your database
    done(null, profile)
  ),
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
