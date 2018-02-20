const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');




// Load user model 
const User = require('../models/User');



// User Login Route
router.get('/login', (req, res) => {
  res.render('users/login');
});

// User Register Route
router.get('/register', (req, res) => {
  res.render('users/register');
});

// Login Form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Register Form POST
router.post('/register', (req, res) => {
  // Errors array
  let errors = [];

  // Passwords do not match
  if (req.body.password != req.body.password2) {
    errors.push({ text: 'Passwords do not match' });
  }

  // Password is less than 4 characters
  if (req.body.password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters' })
  }

  // There is an error
  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name, // so form doesn't clear, the user doesn't have to re-enter 
      email: req.body.email, // so form doesn't clear, the user doesn't have to re-enter 
      password: req.body.password, // so form doesn't clear, the user doesn't have to re-enter 
      password2: req.body.password2 // so form doesn't clear, the user doesn't have to re-enter 
    });
  } else {

    const userObj = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    }

    User.findOne({ email: userObj.email })
      .then(user => {
        if (user) {
          req.flash('error_msg', 'Email already registered');
          res.redirect('/users/register');
        }
      })

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(userObj.password, salt, (err, hash) => {
        if (err) throw err;
        userObj.password = hash;

        new User(userObj)
          .save()
          .then(user => {
            req.flash('success_msg', 'You are now registered and can log in');
            res.redirect('/users/login');
          })
          .catch(err => {
            console.log(err);
            return;
          })

      });
    });
  }
});


// Logout User 
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});



module.exports = router;