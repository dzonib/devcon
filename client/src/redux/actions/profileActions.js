import axios from 'axios'

import {
  GET_PROFILE,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  SET_CURRENT_USER,
  GET_PROFILES
} from '../actions/types'
import {logoutUser} from './authActions';

// Get current profile
export const getCurrentProfile = () => async dispatch => {
  dispatch(setProfileLoading())
  try {
    const res = await axios.get('/api/profile')

    dispatch({type: GET_PROFILE, payload: res.data})
  } catch (e) {
    dispatch({type: GET_PROFILE, payload: {}})
  }
}

// Get profile by handle
export const getProfileByHandle = (handle) => async dispatch => {
  dispatch(setProfileLoading())
  try {
    const res = await axios.get(`/api/profile/handle/${handle}`)
    dispatch({type: GET_PROFILE, payload: res.data})
  } catch (e) {
    dispatch({type: GET_PROFILE, payload: null})
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

// Add experience

export const addExperience = (expData, history) => async dispatch => {
  try {
    await axios.post('/api/profile/experience', expData)
    history.push('/dashboard')
  } catch (e) {
    dispatch({type: GET_ERRORS, payload: e.response.data})
  }
}

export const addEducation = (eduData, history) => dispatch => {
  axios
    .post('/api/profile/education', eduData)
    .then(res => history.push('/dashboard'))
    .catch(err => dispatch({type: GET_ERRORS, payload: err.response.data}));
};

export const deleteExperience = (id) => async dispatch => {
  try {
    await axios.delete(`/api/profile/experience/${id}`)
    dispatch(getCurrentProfile())
  } catch (e) {
    dispatch({type: GET_ERRORS, payload: e.response.data})
  }

}
export const deleteEducation = (id) => async dispatch => {
  try {
    await axios.delete(`/api/profile/education/${id}`)
    dispatch(getCurrentProfile())
  } catch (e) {
    dispatch({type: GET_ERRORS, payload: e.response.data})
  }
}

// Profiles (get all)

export const getProfiles = () => async dispatch => {
  try {
    dispatch(setProfileLoading())
    const res = await axios.get('/api/profile/all')
    dispatch({
      type: GET_PROFILES,
      payload: res.data
    })
  } catch(e) {
    dispatch({
      type: GET_PROFILES,
      payload: null
    })
  }
}

// Delete accout and profile

export const deleteAccount = () => async dispatch => {
  try {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      await axios.delete('/api/profile')

      dispatch({type: SET_CURRENT_USER, payload: {}})

      dispatch(logoutUser())
    }
  } catch (e) {
    dispatch({type: GET_ERRORS, payload: e.response.data})
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
