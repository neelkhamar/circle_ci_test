const actions = {
  READ_NOTIFICATION_BEGIN: "READ_NOTIFICATION_BEGIN",
  READ_NOTIFICATION_SUCCESS: "READ_NOTIFICATION_SUCCESS",
  READ_NOTIFICATION_ERR: "READ_NOTIFICATION_ERR",
  ADD_NOTIFICATION: "ADD_NOTIFICATION",
  SET_NOTIFICATION_LIST: "SET_NOTIFICATION_LIST",

  readNotificationBegin: () => {
    return {
      type: actions.READ_NOTIFICATION_BEGIN,
    };
  },

  readNotificationSuccess: (data) => {
    return {
      type: actions.READ_NOTIFICATION_SUCCESS,
      data,
    };
  },

  readNotificationErr: (err) => {
    return {
      type: actions.READ_NOTIFICATION_ERR,
      err,
    };
  },

  addNotification: (data) => {
    return {
      type: actions.ADD_NOTIFICATION,
      data,
    };
  },

  setNotificationList: (data) => {
    return {
      type: actions.SET_NOTIFICATION_LIST,
      data,
    };
  },
};

export default actions;
