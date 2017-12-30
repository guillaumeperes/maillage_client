import initialStore from "../initialStore.js";

export default function sorts(store, action) {
    if (typeof store === "undefined") {
        return initialStore;
    }
    if (typeof action !== "object" || typeof action.type !== "string") {
        return store;
    }

    // Met à jour le tri sélectionné
    if (action.type === "SET_SELECTED_SORT") {
        return Object.assign({}, store, {
            "selectedSort": action.payload
        });
    }
    return store;
};
