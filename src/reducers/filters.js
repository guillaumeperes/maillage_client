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
        const index = filters.indexOf(action.payload);
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
        const index = filters.indexOf(action.payload);
        if (index !== -1) {
            filters.splice(index, 1);
        }
        return Object.assign({}, store, {
            "selectedFilters": filters
        });
    }
    // Désélectionne toutes les facettes
    if (action.type === "REMOVE_FILTERS") {
        return Object.assign({}, store, {
            "selectedFilters": []
        });
    }
    return store;
};
