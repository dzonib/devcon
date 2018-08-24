const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const router = express.Router();
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience')
const validateEducationInput = require('../../validation/education')

// Get all profiles

router.get('/all', async(req, res) => {
  const errors = {}
  try {
    const profiles = await Profile
      .find()
      .populate('user', ['name', 'avatar']);

    if (!profiles) {
      errors.profile = 'there aint any profiles';
      res
        .status(404)
        .json(errors)
    }

    res.json(profiles)
  } catch (e) {
    errors.profile = 'there aint any profiles';
    return res
      .status(404)
      .json(errors);

  }
});

// get by handle

router.get('/handle/:handle', async(req, res) => {
  const errors = {};

  try {
    const profile = await Profile
      .findOne({handle: req.params.handle})
      .populate('user', ['name', 'avatar']);

    if (!profile) {
      errors.profile = 'There is no profile for this user';
      return res
        .status(404)
        .json(errors);
    }

    res.json(profile);
  } catch (e) {
    console.log(`ERROR --> ${e}`);
    res
      .status(404)
      .json(errors);
  }

  // Profile.findOne({handle: req.params.handle})   .populate('user', ['name',
  // 'avatar'])   .then(profile => {     if (!profile) {       errors.profile =
  // 'There is no ...spoon... wait... no profile' res.status(404).json(errors) }
  // res.json(profile)   }).catch(e => res.status(400).json(errors))
});

// get user profile by id

router.get('/user/:user_id', async(req, res) => {
  const errors = {};

  try {
    const profile = await Profile
      .findOne({user: req.params.user_id})
      .populate('user', ['name', 'avatar']);

    if (!profile) {
      errors.profile = 'There is no profile for this user';
      return res
        .status(404)
        .json(errors);
    }

    res.json(profile);
  } catch (e) {
    console.log(`ERROR --> ${e}`);
    res
      .status(404)
      .json({profile: 'There is no profile for this user'});
  }

});
router.get('/', passport.authenticate('jwt', {session: false}), async(req, res) => {
  const errors = {};
  try {
    const userProfile = await Profile.findOne({user: req.user.id});

    if (!userProfile) {

      errors.noprofile = 'There is no profile for this user';

      return res
        .status(404)
        .json(errors);
    }
  } catch (e) {
    console.log(`ERROR --> ${e}`);
  }

  res.json(profile);
});

// make profile and edit profile route

router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const {errors, isValid} = validateProfileInput(req.body);

  if (!isValid) {
    return res
      .status(400)
      .json(errors);
  }

  const {
    handle,
    company,
    website,
    location,
    status,
    skills,
    bio,
    githubusername,
    expirience,
    education,
    social
  } = req.body;

  const profileFields = {};
  profileFields.user = req.user.id;

  if (handle) 
    profileFields.handle = handle;
  if (company) 
    profileFields.company = company;
  if (website) 
    profileFields.website = website;
  if (location) 
    profileFields.location = location;
  if (status) 
    profileFields.status = status;
  
  // skills - split into array
  if (typeof skills !== 'undefined') {
    profileFields.skills = skills.split(',');
  }
  //
  if (bio) 
    profileFields.bio = bio;
  if (githubusername) 
    profileFields.githubusername = githubusername;
  
  // social(object)
  profileFields.social = {};
  if (req.body.youtube) 
    profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) 
    profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) 
    profileFields.social.facebook = req.body.facebook;
  if (req.body.instagram) 
    profileFields.social.instagram = req.body.instagram;
  if (req.body.linkedin) 
    profileFields.social.linkedin = req.body.linkedin;
  
  Profile
    .findOne({user: req.user.id})
    .then(profile => {
      if (profile) {
        console.log(profileFields)
        // update if it exist
        Profile.findOneAndUpdate({
          user: req.user.id
        }, {
          $set: profileFields
        }, {new: true}).then(profile => res.json(profile));
      } else {
        // Create Check if handle exists
        Profile
          .findOne({handle: profileFields.handle})
          .then(profile => {
            if (profile) {
              errors.handle = 'That handle already exists';
              res
                .status(400)
                .json(errors);
            }

            // Save profile
            new Profile(profileFields)
              .populate('user')
              .save()
              .then(profile => res.json(profile));
          });
      }
    });
});

// Add Expirience

router.post('/experience', passport.authenticate('jwt', {session: false}), (req, res) => {

  const {errors, isValid} = validateExperienceInput(req.body);

  if (!isValid) {
    return res
      .status(400)
      .json(errors)
  }

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body;

  Profile
    .findOne({user: req.user.id})
    .then(profile => {

      const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      }

      profile
        .experience
        .unshift(newExp)

      profile
        .save()
        .then(profile => res.json(profile))
    })
});

// Education

router.post('/education', passport.authenticate('jwt', {session: false}), (req, res) => {

  const {errors, isValid} = validateEducationInput(req.body);

  if (!isValid) {
    return res
      .status(400)
      .json(errors)
  }

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body;

  Profile
    .findOne({user: req.user.id})
    .then(profile => {

      const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      }

      profile
        .education
        .unshift(newEdu)

      profile
        .save()
        .then(profile => res.json(profile))
    })
});

// delete expirience

router.delete('/experience/:exp_id', passport.authenticate('jwt', {session: false}), (req, res) => {

  Profile
    .findOne({user: req.user.id})
    .then(profile => {

      const removeIndex = profile
        .experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);

      profile
        .experience
        .splice(removeIndex, 1);
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(e => res.status(404).json(e))
    })

})

module.exports = router;
