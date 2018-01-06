import { combineReducers } from "redux";
import filters from "./reducers/filters";
import users from "./reducers/users";
import sorts from "./reducers/sorts.js";
import keyword from "./reducers/keyword.js";
import refresh from "./reducers/refresh.js";

export default combineReducers({
    filters,
    users,
    sorts,
    keyword,
    refresh
});
