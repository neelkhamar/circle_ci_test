const actions = {
  READ_EMAIL_NOTIFICATION_BEGIN: "READ_EMAIL_NOTIFICATION_BEGIN",
  READ_EMAIL_NOTIFICATION_SUCCESS: "READ_EMAIL_NOTIFICATION_SUCCESS",
  READ_EMAIL_NOTIFICATION_ERR: "READ_EMAIL_NOTIFICATION_ERR",
  ADD_EMAIL_NOTIFICATION: "ADD_EMAIL_NOTIFICATION",

  readEmailNotificationBegin: () => {
    return {
      type: actions.READ_EMAIL_NOTIFICATION_BEGIN,
    };
  },

  readEmailNotificationSuccess: (data) => {
    return {
      type: actions.READ_EMAIL_NOTIFICATION_SUCCESS,
      data,
    };
  },

  readEmailNotificationErr: (err) => {
    return {
      type: actions.READ_EMAIL_NOTIFICATION_ERR,
      err,
    };
  },

  addEmailNotification: (data) => {
    return {
      type: actions.ADD_EMAIL_NOTIFICATION,
      data,
    };
  },
};

export default actions;
