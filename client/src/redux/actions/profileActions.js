import axios from 'axios'

import {GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE} from '../actions/types'

// get current profile

export const getCurrentProfile = () => async dispatch => {
  dispatch(setProfileLoading())
  try {
    const res = await axios.get('/api/profile')

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    })
  } catch(e) {
    dispatch({
      type: GET_PROFILE,
      payload: {}
    })
  }
}

// profile loading

export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  }
}

// clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  }
}