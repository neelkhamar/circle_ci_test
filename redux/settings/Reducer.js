import { SET_SPINNER } from "../constants";

const INIT_STATE = {
  spinner: false,
};

const defaultState = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_SPINNER:
      return {
        ...state,
        spinner: action.payload,
      };
    default:
      return state;
  }
};

export default defaultState;
