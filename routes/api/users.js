const express = require('express') 
const gravatar = require('gravatar') 
const bcript = require('bcryptjs') 
const jwt = require('jsonwebtoken') 
const router = express.Router() 
const keys = require('../../config/keys') 
const passport = require('passport')

// load register validation
const validateRegisterInput = require('../../validation/register') 
// load login validation
const validateLoginInput = require('../../validation/login') 

const User = require('../../models/User') 

router.get('/test', (req, res) => {
  res.json({msg: 'Users works'}) 
}) 

// @route POST api/users/register @desc register user @access public

router.post('/register', (req, res) => {

  const {errors, isValid} = validateRegisterInput(req.body) 

  if (!isValid) {
    return res
      .status(400)
      .json(errors)
  }

  User
    .findOne({email: req.body.email})
    .then(user => {
      if (user) {
        errors.email = "Email already exists"
        return res
          .status(400)
          .json(errors) 
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: 200,
          r: 'pg',
          d: 'mm'
        }) 
        const newUser = new User({name: req.body.name, email: req.body.email, avatar, password: req.body.password}) 

        bcript.genSalt(10, (err, salt) => {
          bcript.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash 
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err)) 
          }) 
        }) 
      }
    })
    .catch(e => console.log(e))
}) 

// @route POST api/users/login @desc login user / returning the jwt token
// @access public

router.post('/login', (req, res) => {
  const {email, password} = req.body 

  const {errors, isValid} = validateLoginInput(req.body) 

  if (!isValid) {
    return res
      .status(400)
      .json(errors)
  }

  // find user by email
  User
    .findOne({email})
    .then(user => {
      // check for user
      if (!user) {
        errors.email = 'User not found'
        res
          .status(404)
          .json(errors) 
      }
      // compare users
      bcript
        .compare(password, user.password)
        .then(isMatched => {
          if (isMatched) {
            // if the password is matched
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            }  //create jwt payload

            // sign the token
            jwt.sign(payload, keys.secretOrKey, {
              expiresIn: 3600
            }, (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              })
            }) 
          } else {
            errors.password = 'Password incorrect' 
            return res
              .status(400)
              .json(errors) 
          }
        }) 
    })
    .catch(e => console.log(e))
}) 

// @route POST api/users/current @desc return current user @access private

router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  console.log(req.user)
  const {_id, name, email} = req.user 
  res.json({name, email, id: _id})
})

module.exports = router 
