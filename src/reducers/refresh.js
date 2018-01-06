import initialStore from "../initialStore.js";

export default function refresh(store, action) {
    if (typeof store === "undefined") {
        return initialStore;
    }
    if (typeof action !== "object" || typeof action.type !== "string") {
        return store;
    }

    // Déclenche le refresh de la liste des maillages
    if (action.type === "TRIGGER_REFRESH_MESH_LIST") {
        return Object.assign({}, store, {
            "refreshMeshList": !store.refreshMeshList
        });
    }
    // Déclenche le refresh de la liste des catégories
    if (action.type === "TRIGGER_REFRESH_CATEGORIES_LIST") {
        return Object.assign({}, store, {
            "refreshCategoriesList": !store.refreshCategoriesList
        });
    }
    return store;
}

