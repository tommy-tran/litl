import passport from 'passport';
import configureGithubStrategy from './github-strategy';
import configureGoogleStrategy from './google-strategy';

export default app => {
  // Passport
  app.use(passport.initialize());
  configureGithubStrategy();
  configureGoogleStrategy();

  passport.serializeUser((user, done) => {
    const token = user.generateToken();
    const userInfo = { id: user.id, token };
    done(null, userInfo);
  });

  passport.deserializeUser((id, done) => {
    done(null, id);
  });
};
