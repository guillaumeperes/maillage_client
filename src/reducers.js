import { combineReducers } from "redux";
import filters from "./reducers/filters";
import users from "./reducers/users";

export default combineReducers({
    filters,
    users
});
