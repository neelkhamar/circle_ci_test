const LayoutAction = {
  CHANGE_LAYOUT_MODE_BEGIN: "CHANGE_LAYOUT_MODE_BEGIN",
  CHANGE_LAYOUT_MODE_SUCCESS: "CHANGE_LAYOUT_MODE_SUCCESS",
  CHANGE_LAYOUT_MODE_ERR: "CHANGE_LAYOUT_MODE_ERR",

  CHANGE_RTL_MODE_BEGIN: "CHANGE_RTL_MODE_BEGIN",
  CHANGE_RTL_MODE_SUCCESS: "CHANGE_RTL_MODE_SUCCESS",
  CHANGE_RTL_MODE_ERR: "CHANGE_RTL_MODE_ERR",

  CHANGE_MENU_MODE_BEGIN: "CHANGE_MENU_MODE_BEGIN",
  CHANGE_MENU_MODE_SUCCESS: "CHANGE_MENU_MODE_SUCCESS",
  CHANGE_MENU_MODE_ERR: "CHANGE_MENU_MODE_ERR",

  CHANGE_PROFILE_ACTIVE_MENU_BEGIN: "CHANGE_PROFILE_ACTIVE_MENU_BEGIN",
  CHANGE_PROFILE_ACTIVE_MENU_SUCCESS: "CHANGE_PROFILE_ACTIVE_MENU_SUCCESS",
  CHANGE_PROFILE_ACTIVE_MENU_ERR: "CHANGE_PROFILE_ACTIVE_MENU_ERR",

  changeLayoutBegin: () => {
    return {
      type: LayoutAction.CHANGE_LAYOUT_MODE_BEGIN,
    };
  },

  changeLayoutSuccess: (data) => {
    return {
      type: LayoutAction.CHANGE_LAYOUT_MODE_SUCCESS,
      data,
    };
  },

  changeLayoutErr: (err) => {
    return {
      type: LayoutAction.CHANGE_LAYOUT_MODE_ERR,
      err,
    };
  },

  changeRtlBegin: () => {
    return {
      type: LayoutAction.CHANGE_RTL_MODE_BEGIN,
    };
  },

  changeRtlSuccess: (data) => {
    return {
      type: LayoutAction.CHANGE_RTL_MODE_SUCCESS,
      data,
    };
  },

  changeRtlErr: (err) => {
    return {
      type: LayoutAction.CHANGE_RTL_MODE_ERR,
      err,
    };
  },

  changeMenuBegin: () => {
    return {
      type: LayoutAction.CHANGE_MENU_MODE_BEGIN,
    };
  },

  changeMenuSuccess: (data) => {
    return {
      type: LayoutAction.CHANGE_MENU_MODE_SUCCESS,
      data,
    };
  },

  changeMenuErr: (err) => {
    return {
      type: LayoutAction.CHANGE_MENU_MODE_ERR,
      err,
    };
  },

  changeProfileActiveMenuBegin: () => {
    return {
      type: LayoutAction.CHANGE_PROFILE_ACTIVE_MENU_BEGIN,
    };
  },

  changeProfileActiveMenuSuccess: (data) => {
    return {
      type: LayoutAction.CHANGE_PROFILE_ACTIVE_MENU_SUCCESS,
      data,
    };
  },

  changeProfileActiveMenuErr: (err) => {
    return {
      type: LayoutAction.CHANGE_PROFILE_ACTIVE_MENU_ERR,
      err,
    };
  },
};

export default LayoutAction;
