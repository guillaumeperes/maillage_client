import { combineReducers } from "redux";
import filters from "./reducers/filters";
import users from "./reducers/users";
import sorts from "./reducers/sorts.js";

export default combineReducers({
    filters,
    users,
    sorts
});
