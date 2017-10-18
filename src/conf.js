let e = {};

/**
* Environnement dans lequel l'application évolue
* "dev" : développement
* "prod" : production
*/
e.env = "dev";
// e.env = "prod";

/**
* Base de l'URL pour accéder à l'API
*/
if (e.env === "dev") {
    e.baseApiUrl = "http://localhost:55555";
} else if (e.env === "prod") {
    e.baseApiUrl = "https://api.maillage.guillaumeperes.fr";
}

module.exports = Object.assign({}, module.exports, e);
