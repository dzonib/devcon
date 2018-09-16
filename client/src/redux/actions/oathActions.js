import { TEST_DISPATCH } from "./types";

// Reg users

export const registerUser = (userData) => {
  return {
    type: TEST_DISPATCH,
    payload: userData
  }
}