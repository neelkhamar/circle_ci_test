import LayoutAction from "./Action";

const {
  changeLayoutBegin,
  changeLayoutSuccess,
  changeLayoutErr,
  changeRtlBegin,
  changeRtlSuccess,
  changeRtlErr,

  changeMenuBegin,
  changeMenuSuccess,
  changeMenuErr,

  changeProfileActiveMenuBegin,
  changeProfileActiveMenuSuccess,
  changeProfileActiveMenuErr,
} = LayoutAction;

const changeLayoutMode = (value) => {
  return async (dispatch) => {
    try {
      dispatch(changeLayoutBegin());
      dispatch(changeLayoutSuccess(value));
    } catch (err) {
      dispatch(changeLayoutErr(err));
    }
  };
};

const changeRtlMode = (value) => {
  return async (dispatch) => {
    try {
      dispatch(changeRtlBegin());
      dispatch(changeRtlSuccess(value));
    } catch (err) {
      dispatch(changeRtlErr(err));
    }
  };
};

const changeMenuMode = (value) => {
  return async (dispatch) => {
    try {
      dispatch(changeMenuBegin());
      dispatch(changeMenuSuccess(value));
    } catch (err) {
      dispatch(changeMenuErr(err));
    }
  };
};

const changeProfileActiveMenu = (value) => {
  return async (dispatch) => {
    try {
      dispatch(changeProfileActiveMenuBegin());
      dispatch(changeProfileActiveMenuSuccess(value));
    } catch (err) {
      dispatch(changeProfileActiveMenuErr(err));
    }
  };
};

export {
  changeLayoutMode,
  changeRtlMode,
  changeMenuMode,
  changeProfileActiveMenu,
};
