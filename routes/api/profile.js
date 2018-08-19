const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const router = express.Router();
const validateProfileInput = require('../../validation/profile')

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const errors = {};
    let userProfile = '';
    try {
      userProfile = await Profile.findOne({ user: req.user.id });
    } catch (e) {
      console.log(`ERROR --> ${e}`);
    }

    if (!userProfile) {
      errors.noprofile = 'There is no profile for this user';
      return res.status(404).json(errors);
    }

    res.json(profile);
  }
);

// make profile and edit profile route

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
    (req, res) => {

    const {errors, isValid} = validateProfileInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors)
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

    if (handle) profileFields.handle = handle;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    // skills - split into array
    if (typeof skills !== 'undefined') {
      profileFields.skills = skills.split(',');
    }
    //
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;
    // social(object)
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // update if it exist
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create

        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = 'That handle already exists';
            res.status(400).json(errors);
          }

          // Save profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      } 
    });
  }
);

module.exports = router;
