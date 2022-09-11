import actions from "./actions";
import { getAllNotification } from "../../requests/notification";
const initialState = [];

const {
  readNotificationBegin,
  readNotificationSuccess,
  readNotificationErr,
  addNotification,
  setNotificationList,
} = actions;

const readNotificationList = (currentUser) => {
  return async (dispatch) => {
    try {
      getAllNotification(
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
        dispatch(readNotificationSuccess(results));
      });
    } catch (err) {
      dispatch(readNotificationErr(err));
    }
  };
};

const createNotification = (data) => {
  return async (dispatch) => {
    try {
      dispatch(addNotification(data));
    } catch (err) {
      dispatch(readNotificationErr(err));
    }
  };
};

const createNotificationList = (data) => {
  return async (dispatch) => {
    try {
      dispatch(setNotificationList(data));
    } catch (err) {
      console.log(err);
    }
  };
};

export { readNotificationList, createNotification, createNotificationList };
