import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import { GET_ERRORS, SET_CURRENT_USER } from "./types";


// Reg users

export const registerUser = (userData, history) => async dispatch => {
  try {
    await axios.post('/api/users/register', userData);
    history.push('/login');
  } catch(e) {
    dispatch({
      type: GET_ERRORS,
      payload: e.response.data
    })
  }
}

export const loginUser = (userData) => async dispatch => {
  try {
    const res = await axios.post('/api/users/login', userData);

    const {token} = res.data;

    // set token to ls
    localStorage.setItem('jwtToken', token);
    // set token to auth header
    setAuthToken(token);
    // decode token to get user data
    const decoded = jwt_decode(token);
    // set current user
    dispatch(setCurrentUser(decoded))

  } catch(e) {
    dispatch({
      type: GET_ERRORS,
      payload: e.response.data
    })
  }
};

// set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}

// log user out
export const logoutUser = () => dispatch => {
  // remove token from localStorage
  localStorage.removeItem('jwt-Token');
  // remove auth header for future requests
  setAuthToken(false);
  // set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
}