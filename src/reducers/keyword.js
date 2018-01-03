import initialStore from "../initialStore.js";

export default function keyword(store, action) {
    if (typeof store === "undefined") {
        return initialStore;
    }
    if (typeof action !== "object" || typeof action.type !== "string") {
        return store;
    }

    // Mise à jour du mot clé utilisé pour la recherche fulltext
    if (action.type === "SET_KEYWORD") {
        return Object.assign({}, store, {
            "keyword": action.payload
        });
    }
    // Réinitialisation de la recherche fulltext
    if (action.type === "REMOVE_KEYWORD") {
        return Object.assign({}, store, {
            "keyword": null
        });
    }
    return store;
}
