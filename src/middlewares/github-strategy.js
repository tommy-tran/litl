import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";

import User from "../models/User";

import config from "../config/config";

export default () => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: config.GITHUB_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, done) => {
        let user = await User.findOne({
          githubID: profile.id
        });

        if (user) {
          return done(null, user);
        }

        user = new User({
          githubID: profile.id,
          email: profile.email,
          username: profile.username
        });

        await user.save();
        return done(null, user);
      }
    )
  );
};
