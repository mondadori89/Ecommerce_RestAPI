/*const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;


passport.serializeUser((user, done) => {     
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.users.findById(id, function (err, user) { 
      if (err) return done(err);
      done(null, user);
    });
});
*/
var passport = require('passport');
var LocalStrategy = require('passport-local');
const { pool } = require('../db.js')


passport.use(new LocalStrategy(function verify(email, password, done) {
  pool.query('SELECT email, password FROM users WHERE email = $1;', [ email ], function(err, results) {
    if (err) return done(err);
    if (!results) return done(null, false, { msg: 'Incorrect email or password.' }); 
    if (results.rows[0].password !== password) return done(null, false, { msg: 'Incorrect email or password.' });
    return done(null, results);
    });
}));