import initialStore from "../initialStore.js";

export default function users(store, action) {
    if (typeof store === "undefined") {
        return initialStore;
    }
    if (typeof action !== "object" || typeof action.type !== "string") {
        return store;
    }

    // Stockage du token de connexion (e.g connexion d'un utilisateur)
    if (action.type === "SET_USER_TOKEN") {
        return Object.assign({}, store, {
            "userToken": action.payload
        });
    }
    // Supprime le token de connexion (e.g : lors d'une déconnexion)
    if (action.type === "REMOVE_USER_TOKEN") {
        return Object.assign({}, store, {
            "userToken": null
        });
    }
    return store;
};
