require('https').globalAgent.options.rejectUnauthorized = false;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const {checkUserByEmail, checkUserById} = require("../data/auth/auth");

module.exports = (passport) => {

    // Serialize the user for the sesison
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Used to unserialize the user
    passport.deserializeUser((id, done) => {
        checkUserById(id, done)
    });

    const callback = "/oauth/signin/callback";
    passport.use(new GoogleStrategy({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: callback,
            passReqToCallback: true
        },
        (req, accessToken, refreshToken, profile, done) => {
            checkUserByEmail(req, accessToken, refreshToken, profile, done)
        }
    ));

};
