const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user model
const User = require('../models/User');


module.exports = function(passport){
  passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    // Match user
    User.findOne({
      email: email
    }).then(user => {

      // Email doesnt match
      if(!user){
        return done(null, false, {message: 'No user Found'});
      }

      // Match password 
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch){
          // password matched
          return done(null, user); // null because we have no error, the first one is for an err
          // return the user and the passwords matched

        } else { // password didnt match
          return done(null, false, {message: 'Password Incorrect'});
        }
      })
    })
  }));

  // Passport session w cookies, statefull php
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}