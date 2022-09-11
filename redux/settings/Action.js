import { SET_SPINNER } from "../constants/";

export const setSpinner = (payload) => {
  return {
    type: SET_SPINNER,
    payload,
  };
};
