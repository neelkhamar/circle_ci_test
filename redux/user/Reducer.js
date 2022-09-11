import { SET_CURRENT_USER, SET_USER_LOGOUT } from "../constants/";

const INIT_STATE = {
  currentUser: {
    uid: "",
    accessToken: "",
    client: "",
    roles: [],
    userDetails: "",
    certsValidated: false,
  },
};

const defaultState = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: Object.assign({}, state.currentUser, action.payload),
      };

    case SET_USER_LOGOUT:
      return {
        ...state,
        currentUser: Object.assign({}, INIT_STATE.currentUser),
      };

    default:
      return state;
  }
};

export default defaultState;
