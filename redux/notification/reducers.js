import actions from "./actions";
const initialState = [];

const {
  READ_NOTIFICATION_BEGIN,
  READ_NOTIFICATION_SUCCESS,
  READ_NOTIFICATION_ERR,
  ADD_NOTIFICATION,
  SET_NOTIFICATION_LIST,
} = actions;

const initialStateFilter = {
  data: [],
  loading: false,
  error: null,
};

const readNotificationReducer = (state = initialStateFilter, action) => {
  const { type, data, err } = action;
  switch (type) {
    case READ_NOTIFICATION_BEGIN:
      return {
        ...initialState,
        loading: true,
      };
    case READ_NOTIFICATION_SUCCESS:
      return {
        ...initialState,
        data,
        loading: false,
      };
    case READ_NOTIFICATION_ERR:
      return {
        ...initialState,
        error: err,
        loading: false,
      };
    case SET_NOTIFICATION_LIST:
      return {
        ...state,
        data: action.data,
      };
    case ADD_NOTIFICATION:
      var mark_as_read = false;
      switch (String(data.mark_as_read)) {
        case "true":
          mark_as_read = true;
          break;
        case "false":
          mark_as_read = false;
          break;
        default:
          mark_as_read = false;
      }
      return {
        ...state.data,
        data: [
          {
            id: data.id,
            from: data.title,
            resource_type: data.resource_type,
            distance_of_time_in_words: data.distance_of_time_in_words,
            mark_as_read: mark_as_read,
          },
          ...state.data,
        ],
        loading: false,
      };
    default:
      return state;
  }
};

export { readNotificationReducer };
