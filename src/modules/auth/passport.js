import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "../../utils/config.js";
const { GOOGLE } = config
import repository from "./repository.js";
import { generateAccessToken } from "../../utils/generateToken.js";


/**
 * Configures the Google OAuth2 strategy for Passport.js authentication.
 * This strategy is used to authenticate users who sign in with their Google accounts.
 *
 * @param {string} clientID - The client ID of the Google OAuth2 application.
 * @param {string} clientSecret - The client secret of the Google OAuth2 application.
 * @param {string} callbackURL - The callback URL for the Google OAuth2 application.
 * @param {function} callback - The callback function that is called after a successful or failed authentication attempt.
 * @returns {void}
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE.CLIENTID,
      clientSecret: GOOGLE.CLIENTSECRET,
      callbackURL: GOOGLE.CALLBACKURL,
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const existingUser = await repository.findUserByEmail(
          profile.emails[0].value
        );
        if (!existingUser) {
          const newUser = await repository.create({
            email: profile.emails[0].value,
            role: "User",
            fullname: profile.displayName,
            profile_picture: profile.picture,
            verified: true,
          });

          const { access_token } = generateAccessToken(newUser.id);
          return cb(null, { access_token, userId: newUser.id });
        }
        const { access_token } = generateAccessToken(existingUser.id);
        return cb(null, { access_token, userId: existingUser.id });
      } catch (err) {
        return cb(err, null);
      }
    }
  )
);

export default passport