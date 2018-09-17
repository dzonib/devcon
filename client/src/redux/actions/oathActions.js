import { GET_ERRORS } from "./types";
import axios from 'axios'

// Reg users

export const registerUser = (userData) => async dispatch => {
  try {
    const res = await axios.post('/api/users/register', userData);
    console.log(res)
  } catch(e) {
    dispatch({
      type: GET_ERRORS,
      payload: e.response.data
    })
  }

}