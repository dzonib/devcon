import axios from 'axios'

import {GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE, GET_ERRORS, SET_CURRENT_USER} from '../actions/types'
import { logoutUser } from './authActions';
// get current profile

export const getCurrentProfile = () => async dispatch => {
  dispatch(setProfileLoading())
  try {
    const res = await axios.get('/api/profile')

    dispatch({type: GET_PROFILE, payload: res.data})
  } catch (e) {
    dispatch({type: GET_PROFILE, payload: {}})
  }
}

// Create profile

export const createProfile = (profile, history) => async dispatch => {
  try {
    await axios.post('/api/profile', profile)
    history.push('/dashboard')
  } catch (e) {
    dispatch({type: GET_ERRORS, payload: e.response.data})
  }
}

// Delete accout and profile

export const deleteAccount = () => async dispatch => {
  try {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      await axios.delete('/api/profile')
      
      dispatch({
        type: SET_CURRENT_USER,
        payload: {}
      })

      dispatch(logoutUser())
    }
  } catch(e) {
    dispatch({
      type: GET_ERRORS,
      payload: e.response.data
    })
  }
}

// profile loading

export const setProfileLoading = () => {
  return {type: PROFILE_LOADING}
}

// clear profile
export const clearCurrentProfile = () => {
  return {type: CLEAR_CURRENT_PROFILE}
}