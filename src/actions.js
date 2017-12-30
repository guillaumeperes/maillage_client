// Actions disponibles sur le store

/**
* Sélectionne un filtre sur le moteur de recherche
*/
export function addFilter(filter) {
    return {
        "type": "ADD_FILTER",
        "payload": filter
    };
};

/**
* Désélectionne un filtre sur le moteur de recherche
*/
export function removeFilter(filter) {
    return {
        "type": "REMOVE_FILTER",
        "payload": filter
    };
};

/**
* Sélection d'un critère de tri
*/
export function setSelectedSort(sort) {
    return {
        "type": "SET_SELECTED_SORT",
        "payload": sort
    };
};

/**
* Met à jour le token utilisateur
*/
export function setUserToken(token) {
    return {
        "type": "SET_USER_TOKEN",
        "payload": token
    };
};

/**
* Efface le token utilisateur
*/
export function removeUserToken() {
    return {
        "type": "REMOVE_USER_TOKEN"
    };
};

/**
* Met à jour les rôles de l'utilisateur connecté
*/
export function setUserRoles(roles) {
    return {
        "type": "SET_USER_ROLES",
        "payload": roles
    };
};

/**
* Efface les rôles utilisateur
*/
export function removeUserRoles() {
    return {
        "type": "REMOVE_USER_ROLES"
    };
};
