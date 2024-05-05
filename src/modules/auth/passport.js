import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "../../utils/config.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE.CLIENTID,
      clientSecret: config.GOOGLE.CLIENTSECRET,
      callbackURL: config.GOOGLE.CALLBACKURL,
    },
    async function (profile, cb) {
      try {
        const existingUser = "";
        if (!existingUser) {
          /**
           * create new User and generate jwt
           */
        }
        /**
         * generate jwt token
         */
        return cb(null, "token");
      } catch (err) {
        return cb(err, null);
      }
    }
  )
);
