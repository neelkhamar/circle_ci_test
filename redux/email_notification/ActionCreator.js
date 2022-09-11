import actions from "./Action";
import { getAllEmailNotification } from "../../requests/notification";

const {
  readEmailNotificationBegin,
  readEmailNotificationSuccess,
  readEmailNotificationErr,
  addEmailNotification,
} = actions;

const readEmailNotificationList = (currentUser) => {
  return async (dispatch) => {
    try {
      getAllEmailNotification(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client
      ).then((response) => {
        const results = response.data.data.map((row, index) => {
          let obj = {};
          obj["from"] = row.attributes.body;
          obj["resource_type"] = row.attributes.resource_type;
          obj["distance_of_time_in_words"] =
            row.attributes.distance_of_time_in_words;
          obj["mark_as_read"] = row.attributes.mark_as_read;
          obj["id"] = row.id;
          return obj;
        });
        dispatch(readEmailNotificationSuccess(results));
      });
    } catch (err) {
      dispatch(readEmailNotificationErr(err));
    }
  };
};

const createEmailNotification = (data) => {
  return async (dispatch) => {
    try {
      dispatch(addEmailNotification(data));
    } catch (err) {
      dispatch(readEmailNotificationErr(err));
    }
  };
};

export { readEmailNotificationList, createEmailNotification };
