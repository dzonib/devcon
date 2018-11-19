const express = require('express') 
const mongoose = require('mongoose') 
const passport = require('passport') 

const Post = require('../../models/Post') 
const Profile = require('../../models/Profile') 
const router = express.Router() 

const validatePostInput = require('../../validation/post') 

router.get('/test', (req, res) => {
  res.json({ msg: 'Posts works' }) 
}) 

// GET POSTs

router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(e => res.status(404)) 
}) 

// GET POST by id

router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(e =>
      res.status(404).json({ nopostfound: 'No post found with that id' })
    ) 
}) 

// ADD POST

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body) 

    if (!isValid) {
      res.status(400).json(errors) 
    }

    const { text, name, avatar } = req.body 

    const newPost = new Post({
      text,
      name,
      avatar,
      user: req.user.id
    }) 

    newPost.save().then(post => res.json(post)) 
  }
) 

// REMOVE POST

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findOne({ user: req.user.id })
      .then(post => {
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: 'User not authorized' }) 
        }
        post.remove().then(() => res.json({ success: 'true' })) 
      })
      .catch(e => res.status(404).json({ postnotfound: 'Post not found' })) 
  }
) 

// Like post

router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (
          post.likes.filter(like => String(like.user) === req.user.id).length >
          0
        ) {
          return res
            .status(400)
            .json({ alreadyliked: 'User already liked this post' }) 
        }

        post.likes.unshift({ user: req.user.id }) 

        post.save().then(post => res.json(post)) 
      })
      .catch(e => res.status(404).json({ postnotfound: 'No post found' })) 
  }
) 

// Unlike the post :(

router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (
          post.likes.filter(like => String(like.user) === req.user.id)
            .length === 0
        ) {
          return res
            .status(400)
            .json({ notliked: 'You have not yet liked this post' }) 
        }

        // get remove index
        const rmvIndex = post.likes
          .map(item => String(item.user))
          .indexOf(req.user.id) 

        post.likes.splice(rmvIndex, 1) 
        
        post.save().then(post => res.json(post))
        // .then after save
      })
      .catch(e => res.status(404).json({ postnotfound: 'No post found' })) 
  }
) 


// Add comment

router.post('/comment/:id', passport.authenticate('jwt', {session: false}), (req, res) => {

  const { errors, isValid } = validatePostInput(req.body) 

    if (!isValid) {
      return res.status(400).json(errors) 
    }

  Post.findById(req.params.id)
    .then(post => {
      const newComment = {
        user: req.user.id,
        text: req.body.text,
        avatar: req.user.avatar
      }

      post.comments.unshift(newComment)

      post.save().then(res.json(post))
    })
    .catch(e => res.json({errors: "post not found"}))
})


// Delete comment


router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session: false}),
  (req, res) => {

  Post.findById(req.params.id)
    .then(post => {
     

      if(post.comments.filter(item => String(item.id) === req.params.comment_id).length === 0) {
        return res.status(404).json({commentnotfound: 'Comment not found'})
      }
     
      const postIndex = post.comments.map(item => String(item.id)).indexOf(req.params.comment_id)

      post.comments.splice(postIndex, 1) 

      post.save().then(res.json(post))
    })
    .catch(e => res.status(404).json({errors: "post not found"}))
})


module.exports = router 

// Check if you need find profile first and then do stuff (Profile.findOne({user: req.user.id}))
