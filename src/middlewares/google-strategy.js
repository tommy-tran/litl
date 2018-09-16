import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";

import User from "../models/User";

import config from "../config/config";

export default () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, done) => {
        let user = await User.findOne({
          googleID: profile.id
        });

        console.log(user);

        if (user) {
          return done(null, user);
        }

        user = new User({
          googleID: profile.id,
          email: profile.email
        });

        await user.save();
        return done(null, user);
      }
    )
  );
};
