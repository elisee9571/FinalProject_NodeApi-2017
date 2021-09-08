/** Start Require modules 
Express.js (librairie) est un framework pour créer des applications http Web basées sur Node.js.*/
const Express = require("express");

/**Le partage de ressources inter-origines (CORS) est un mécanisme qui consiste à ajouter des en-têtes HTTP afin de
 * permettre à un agent utilisateur d'accéder à des ressources d'un serveur situé sur une autre origine que le site courant.*/
const cors = require("cors");

/** Interlogiciel (middleware) d'analyse du corps Node.js.
permet d'analyser le contenue de body et fait la communication entre des éléments */
const BodyParser = require("body-parser");

/*Nous définissons ici les paramètres du serveur */
/* hostname : nom de l'utilisateur */
const hostname = "localhost";

/* le port où vous pouvez appeler pour utiliser votre serveur en local */
var port = process.env.PORT || 3000;

var app = Express();

/* On utilise l'application "cors" */
app.use(cors());

/* Analyser application , ENCODER l'url /x-www-form-urlencoded 
    URL est est un lien 
    EXTENDED = false est une option de configuration qui indique à l'analyseur d'utiliser l'encodage classique.
    Lors de son utilisation, les valeurs ne peuvent être que des chaînes ou des tableaux */
app.use(BodyParser.urlencoded({ extended: false }));

/* Analyser- CONVERTIR application/json */
app.use(BodyParser.json());

// app.use permet de rendre utilisable nos routes
app.use("/produit", require("./router/produit"));
app.use("/client", require("./router/client"));
app.use("/commande", require("./router/commande"));
app.use("/", require("./router/nodemailer"));

/* Démarrer le serveur */
/* nous disons à notre application de commencer à écouter dans le port 
   et de nous renvoyer le msg avec les informations du port */
app.listen(port, hostname, function() {
    console.log(
        "Mon server fonctionne sur http://" + hostname + ":" + port + "\n"
    );
});