const express = require('express');
const gravatar = require('gravatar');
const bcript = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const keys = require('../../config/keys');
const passport = require('passport')

const User = require('../../models/User');

router.get('/test', (req, res) => {
  res.json({ msg: 'Users works' });
});

// @route POST api/users/register
// @desc register user
// @access public

router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: 'Email alredy exists' });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: 200,
        r: 'pg',
        d: 'mm'
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcript.genSalt(10, (err, salt) => {
        bcript.hash(newUser.password, salt, (err, hash) => {
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc login user / returning the jwt token
// @access public

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // find user by email
  User.findOne({ email }).then(user => {
    // check for user
    if (!user) res.status(404).json({ email: 'User not found' });
    // compare users
    bcript.compare(password, user.password).then(isMatched => {
      if (isMatched) {
        // if the password is matched
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        }; //create jwt payload

        // sign the token
        jwt.sign(payload, 
          keys.secretOrKey, 
          { expiresIn: 3600 }, 
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            })
        });
      } else {
        return res.status(400).json({ password: 'Password incorrect' });
      }
    });
  });
});

// @route POST api/users/current
// @desc return current user
// @access private

router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  const {_id, name, email} = req.user
  res.json({
    name,
    email,
    id: _id
  })
})

module.exports = router;
