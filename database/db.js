// sequelize permet de créer une base de donner, créer des tables, lire, écrire, supprimer, modifer et lier nos tables
const Sequelize = require("sequelize");

// db est un objet
const db = {};

// new Sequelize crée une instance qui permet la connection à la base de donnée (qu'on a nommé "db_ecommerce")
const dbinfo = new Sequelize("db_ecommerce", "root", "", {
    host: "localhost",
    /* Son rôle est d'associer des noms d'hôtes à des adresses IP. */
    dialect: "mysql",
    /* Hibernate utilise la configuration "dialecte" pour savoir quelle base de données vous utilisez */
    port: 3306,
    /* 3306, serveur de base de données MySQL */
    pool: {
        /* Un pool désigne un ensemble de ressources réutilisables, géré de façon commune pour un ensemble d'usagers */
        /* nombre de connection */
        max: 5,
        min: 0,
    }
}); // instance de ma base de donnée

// connection à la database
dbinfo.authenticate()
    .then(() => {
        console.log("La connexion a été établie avec succès.")
    })
    .catch((err) => {
        console.error("Impossible de se connecter à la base de données:", err);
    });

/* models/tables */
/* Start Require models/tables *
* require (necessite) chaque table de la base de données
* nous en avons besoin dans ce fichier pour faire des associations
* nous avons tous besoin de la table des associations que nous créons,
nous avons besoin de certaines données dans cette table */

/* table */
db.image = require("../models/Image")(dbinfo, Sequelize);
db.produit = require("../models/Produit")(dbinfo, Sequelize);
db.client = require("../models/Client")(dbinfo, Sequelize);
db.commande = require("../models/Commande")(dbinfo, Sequelize);
db.facture = require("../models/Facture")(dbinfo, Sequelize);
db.livraison = require("../models/Livraison")(dbinfo, Sequelize);
db.paiement = require("../models/Paiement")(dbinfo, Sequelize);

/* table des tables intermédiaires */
db.contenir = require("../models/Contenir")(dbinfo, Sequelize); //contenir le produit dans la commande.
db.effectuer = require("../models/Effectuer")(dbinfo, Sequelize); //le client va effectuer la commande.
db.payer = require("../models/Payer")(dbinfo, Sequelize); //le client va payer la commande.
db.creer = require("../models/Creer")(dbinfo, Sequelize); // le paiement va créer une livraison.
db.recevoir = require("../models/Recevoir")(dbinfo, Sequelize); //le client va recevoir une facture.

/*Il existe quatre types d'associations disponibles dans Sequelize
BelongsTo  : permet de creer une association (0/1)
 - Les associations sont des associations dans lesquelles la clé étrangère pour la relation un-à-un existe sur le modèle source.(0/1)
 HasOne (1/1) : Les associations sont des associations dans lesquelles la clé étrangère pour la relation un-à-un existe sur le modèle cible.(1/1)
 HasMany (1/N) ou (N/N) : les associations connectent une source à plusieurs cibles. Les cibles sont cependant à nouveau connectées à exactement une source spécifique.(1/N) ou (N/N)
 BelongsToMany (0/N) : permet de creer une association
 - Les associations sont utilisées pour connecter des sources avec plusieurs cibles. En outre, les cibles peuvent également avoir des connexions à plusieurs sources.(0/N) */

/** Start Relation **/
//  1,N ET 0,N - 1/1 
db.produit.hasMany(db.image, {
    foreignKey: 'produitId'
}); // produit 1/N image - cas contraire Image 1/1 produit (donc l'Id produit va dans la table image (le N vers le plus petit ))
db.client.hasMany(db.facture, {
    foreignKey: 'clientId'
}); // client 1/N facture - cas contraire facture 1/1 client (donc l'Id client va dans la table facture (le N vers le plus petit ))
db.produit.hasMany(db.facture, {
    foreignKey: 'produitId'
}); // produit 1/N facture - cas contraire facture 1/1 produit (donc l'Id produit va dans la table facture (le N vers le plus petit ))
db.client.hasMany(db.livraison, {
    foreignKey: 'clientId'
}); // client 1/N livraison - cas contraire livraison 1/1 client (donc l'Id client va dans la table livraison (le N vers le plus petit ))

/*table intermediaire*/
/* entre client et commande */
db.client.belongsToMany(db.commande, {
    through: "Effectuer",
    foreignKey: "clientId"
});
db.commande.belongsToMany(db.client, {
    through: "Effectuer",
    foreignKey: "commandeId"
});

/* entre produit et commande */
db.commande.belongsToMany(db.produit, {
    through: "Contenir",
    foreignKey: "commandeId"
});
db.produit.belongsToMany(db.commande, {
    through: "Contenir",
    foreignKey: "produitId"
});

/* entre commande et paiement */
db.paiement.belongsToMany(db.commande, {
    through: "Payer",
    foreignKey: "paiementId"
});
db.commande.belongsToMany(db.paiement, {
    through: "Payer",
    foreignKey: "commandeId"
});

/* entre paiement et livraison */
db.livraison.belongsToMany(db.paiement, {
    through: "Creer",
    foreignKey: "livraisonId"
});
db.paiement.belongsToMany(db.livraison, {
    through: "Creer",
    foreignKey: "paiementId"
});

/* entre paiement et facture */
db.paiement.belongsToMany(db.facture, {
    through: "Recevoir",
    foreignKey: "paiementId"
});
db.facture.belongsToMany(db.paiement, {
    through: "Recevoir",
    foreignKey: "factureId"
});

// Fait reference a l'instance de la base de données
db.dbinfo = dbinfo;
db.Sequelize = Sequelize;

// Attention à mettre toujours en commentaire car ils synchronise la base de donnée !!!
//dbinfo.sync({ force: true });

module.exports = db;