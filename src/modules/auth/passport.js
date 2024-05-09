import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "../../utils/config.js";
import { repository } from "./repository.js";
import { generateAccessToken } from "../../utils/generateToken.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE.CLIENTID,
      clientSecret: config.GOOGLE.CLIENTSECRET,
      callbackURL: config.GOOGLE.CALLBACKURL,
    },
    async function (profile, cb) {
      try {
        const existingUser = await repository.findUserByEmail(profile.email);
        if (!existingUser) {
          const newUser = await repository.create()
          const { access_token } = generateAccessToken(newUser.id)
          return cb(null, access_token);
        }
        const { access_token } = generateAccessToken(existingUser.id)
        return cb(null, access_token);
      } catch (err) {
        return cb(err, null);
      }
    }
  )
);
