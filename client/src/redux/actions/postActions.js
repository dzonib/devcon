import axios from 'axios'

import {ADD_POST, GET_ERRORS, POST_LOADING, GET_POSTS, DELETE_POST, GET_POST, CLEAR_ERRORS} from './types'

// Add post
export const addPost = postData => async dispatch => {
  try {
    dispatch(clearErrors())
    const res = await axios.post('/api/posts', postData)

    dispatch({type: ADD_POST, payload: res.data})
  } catch (e) {
    dispatch({type: GET_ERRORS, payload: e.response.data})
  }
}

// get posts
export const getPosts = postData => async dispatch => {
  try {
    dispatch(setPostLoading())
    const res = await axios.get('/api/posts', postData)
    dispatch({type: GET_POSTS, payload: res.data})
  } catch (e) {
    dispatch({type: GET_POSTS, payload: null})
  }
}

// get post
export const getPost = id => async dispatch => {
  try {
    dispatch(setPostLoading())
    const res = await axios.get(`/api/posts/${id}`)
    dispatch({type: GET_POST, payload: res.data})
  } catch (e) {
    dispatch({type: GET_POSTS, payload: null})
  }
}

// delete post
export const deletePost = id => dispatch => {
  axios
    .delete(`/api/posts/${id}`)
    .then(res => {
      dispatch({type: DELETE_POST, payload: id})
    })
    .catch(e => {
      dispatch({type: GET_ERRORS, payload: e.response.data})
    })
}

// add like
export const addLike = id => dispatch => {
  axios.post(`/api/posts/like/${id}`).then( res => dispatch(getPosts())).catch(e => {
    dispatch({
      type: GET_ERRORS,
      payload: e.response.data
    })
  })
}
// remove like
export const removeLike = id => dispatch => {
  axios.post(`/api/posts/unlike/${id}`).then(res => dispatch(getPosts())).catch(e => {
    dispatch({
      type: GET_ERRORS,
      payload: e.response.data
    })
  })
}

// Add post
export const addComment = ( postId, commentData) => async dispatch => {
  try {
    dispatch(clearErrors())
    const res = await axios.post(`/api/posts/comment/${postId}`, commentData)

    dispatch({type: GET_POST, payload: res.data})
  } catch (e) {
    dispatch({type: GET_ERRORS, payload: e.response.data})
  }
}

// add comment
export const deleteComment = ( postId, commentId) => async dispatch => {
  try {
    const res = await axios.delete(`/api/posts/comment/${postId}/${commentId}`)

    dispatch({type: GET_POST, payload: res.data})
  } catch (e) {
    dispatch({type: GET_ERRORS, payload: e.response.data})
  }
}


// set loading state

export const setPostLoading = () => {
  return {type: POST_LOADING}
}

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  }
}