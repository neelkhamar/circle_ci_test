import LayoutAction from "./Action";

const initialState = {
  data: false,
  rtlData: false,
  topMenu: false,
  loading: false,
  rtlLoading: false,
  menuLoading: false,
  profileCurrentTab: 1,
  error: null,
};

const {
  CHANGE_LAYOUT_MODE_BEGIN,
  CHANGE_LAYOUT_MODE_SUCCESS,
  CHANGE_LAYOUT_MODE_ERR,

  CHANGE_RTL_MODE_BEGIN,
  CHANGE_RTL_MODE_SUCCESS,
  CHANGE_RTL_MODE_ERR,

  CHANGE_MENU_MODE_BEGIN,
  CHANGE_MENU_MODE_SUCCESS,
  CHANGE_MENU_MODE_ERR,

  CHANGE_PROFILE_ACTIVE_MENU_BEGIN,
  CHANGE_PROFILE_ACTIVE_MENU_SUCCESS,
  CHANGE_PROFILE_ACTIVE_MENU_ERR,
} = LayoutAction;

const LayoutReducer = (state = initialState, action) => {
  const { type, data, err } = action;
  switch (type) {
    case CHANGE_LAYOUT_MODE_BEGIN:
      return {
        ...state,
        loading: true,
      };
    case CHANGE_LAYOUT_MODE_SUCCESS:
      return {
        ...state,
        data,
        loading: false,
      };
    case CHANGE_LAYOUT_MODE_ERR:
      return {
        ...state,
        error: err,
        loading: false,
      };

    case CHANGE_RTL_MODE_BEGIN:
      return {
        ...state,
        rtlLoading: true,
      };
    case CHANGE_RTL_MODE_SUCCESS:
      return {
        ...state,
        rtlData: data,
        rtlLoading: false,
      };
    case CHANGE_RTL_MODE_ERR:
      return {
        ...state,
        error: err,
        rtlLoading: false,
      };
    case CHANGE_MENU_MODE_BEGIN:
      return {
        ...state,
        menuLoading: true,
      };
    case CHANGE_MENU_MODE_SUCCESS:
      return {
        ...state,
        topMenu: data,
        menuLoading: false,
      };
    case CHANGE_MENU_MODE_ERR:
      return {
        ...state,
        error: err,
        menuLoading: false,
      };
    case CHANGE_PROFILE_ACTIVE_MENU_BEGIN:
      return {
        ...state,
      };
    case CHANGE_PROFILE_ACTIVE_MENU_SUCCESS:
      return {
        ...state,
        profileCurrentTab: data,
      };
    case CHANGE_PROFILE_ACTIVE_MENU_ERR:
      return {
        ...state,
        error: err,
      };
    default:
      return state;
  }
};

export default LayoutReducer;
