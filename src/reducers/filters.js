import initialStore from "../initialStore.js";

export default function filters(store, action) {
    if (typeof store === "undefined") {
        return initialStore;
    }
    if (typeof action !== "object" || typeof action.type !== "string") {
        return store;
    }
    
    // Ajoute un filtre à la recherche
    if (action.type === "ADD_FILTER") {
        let filters = store.selectedFilters;
        let index = filters.findIndex(function(filter) {
            return filter.id === action.payload.id;
        });
        if (index === -1) {
            filters.push(action.payload);
        }
        return Object.assign({}, store, {
            "selectedFilters": filters
        });
    }
    // Supprime un filtre de la recherche
    if (action.type === "REMOVE_FILTER") {
        let filters = store.selectedFilters;
        let index = filters.findIndex(function(filter) {
            return filter.id === action.payload.id;
        });
        if (index !== -1) {
            filters.splice(index, 1);
        }
        return Object.assign({}, store, {
            "selectedFilters": filters
        });
    }
    return store;
};
