import { SET_CURRENT_USER, SET_USER_LOGOUT } from "../constants/";

export const setCurrentUser = (payload) => {
  return {
    type: SET_CURRENT_USER,
    payload,
  };
};

export const logout = () => {
  return {
    type: SET_USER_LOGOUT,
  };
};
