const express = require("express");
const router = express.Router();
const db = require("../database/db");

router.post("/new", (req, res) => {
    console.log(req.body.panier)

    var commande = {
        clientId: req.body.clientId,
        status: 1,
    }

    db.commande.create(commande)
        .then((commande) => {
            for (let i = 0; i < req.body.panier.length; i++) {
                commande.addProduits(req.body.panier[i].produitId, {
                        through: {
                            prix: req.body.panier[i].prix_unitaire,
                            qtn: req.body.panier[i].quantite,
                        }
                    })
                    .then(resp => {
                        res.json(resp)
                    })
                    .catch(err => {
                        res.json(err)
                    })
            }
        })
        .catch((err) => {
            res.json(err)
        })
});


module.exports = router;