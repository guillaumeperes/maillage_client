// Actions disponibles sur le store

export function addFilter(filter) {
    return {
        "type": "ADD_FILTER",
        "payload": filter
    };
};

export function removeFilter(filter) {
    return {
        "type": "REMOVE_FILTER",
        "payload": filter
    };
};
