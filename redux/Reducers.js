import { combineReducers } from "redux";
import auth from "./user/Reducer";
import settings from "./settings/Reducer";
import ChangeLayoutMode from "./layout/Reducer";
import { headerSearchReducer } from "./headerSearch/reducers";
import { readNotificationReducer } from "./notification/reducers";

const Reducers = combineReducers({
  auth,
  settings,
  ChangeLayoutMode,
  notification: readNotificationReducer,
  headerSearchData: headerSearchReducer,
});

export default Reducers;
