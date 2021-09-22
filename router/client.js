const express = require("express");
const router = express.Router();
const db = require("../database/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// SECRET_KEY permet de stocker des données de façon sûre, secret est notre valeur
process.env.SECRET_KEY = "secret";

/* cette route permet à un utilisateur de créer un compte */
router.post("/register", (req, res) => {
    db.client
        .findOne({
            where: {
                email: req.body.email,
            },
        })
        .then((client) => {
            if (!client) {
                const hash = bcrypt.hashSync(req.body.password, 10);
                req.body.password = hash;
                db.client
                    .create(req.body)
                    .then((itemclient) => {
                        var nodemailer = require("nodemailer");
                        var transporter = nodemailer.createTransport({
                            host: "smtp.gmail.com",
                            port: "587",
                            service: "gmail",
                            auth: {
                                user: "eltest2node@gmail.com",
                                pass: "Eltest2nodemailer",
                            },
                            secureConnection: "false",
                            tls: {
                                ciphers: "SSLv3",
                                rejectUnauthorized: false,
                            },
                        });
                        var mailOptions = {
                            from: "eltest2node@gmail.com",
                            to: itemclient.email,
                            subject: "Inscription à 2017 Agenda Quotidien",
                            html: "<a href=http://localhost:8080/validemail/" +
                                itemclient.email +
                                ">Confirmer votre mail</a>",
                        };
                        transporter.sendMail(mailOptions, function(error, info) {
                            if (error) {
                                console.log(error);
                                return res.json(error);
                            } else {
                                console.log("email sent" + info.response);
                                return res.status(200).json({
                                    email: itemclient.email,
                                    email_sent: info.response,
                                });
                            }
                        });
                    })
                    .catch((err) => {
                        res.status(401).json({ err });
                    });
            } else {
                res.json("cette adresse email est déjà utilisée");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});

/* cette route permet à l'utilisateur de recevoir un mail avec un lien pour changer son mdp oublié */
router.post("/forgetpassword", (req, res) => {
    var randtoken = require("rand-token");
    var token = randtoken.generate(16);
    db.client
        .findOne({
            where: {
                email: req.body.email,
            },
        })
        .then((client) => {
            if (client) {
                client
                    .update({
                        forget: token,
                    })
                    .then((item) => {
                        var nodemailer = require("nodemailer");

                        var transporter = nodemailer.createTransport({
                            host: "smtp.gmail.com",
                            port: "587",
                            service: "gmail",
                            auth: {
                                user: "eltest2node@gmail.com",
                                pass: "Eltest2nodemailer",
                            },
                            secureConnection: "false",
                            tls: {
                                ciphers: "SSLv3",
                                rejectUnauthorized: false,
                            },
                        });
                        var mailOptions = {
                            from: "eltest2node@gmail.com",
                            to: item.email,
                            subject: "Réinitialiser le mot de passe",
                            html: "<a href=http://localhost:8080/updatepassword/" +
                                item.forget +
                                ">Mettre à jour le mot de passe</a>",
                        };

                        transporter.sendMail(mailOptions, function(error, info) {
                            if (error) {
                                res.json(error);
                                console.log(error);
                            } else {
                                console.log("email sent" + info.response);
                                res.json("email sent" + info.response);
                            }
                        });
                    })
                    .catch((err) => {
                        res.json(err);
                    });
            } else {
                res.status(404).json("utilisateur non trouvé");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});

/* cette route permet à l'utilisateur de pouvoir modifier son mdp */
router.post("/updatepassword", (req, res) => {
    db.client
        .findOne({
            where: {
                forget: req.body.forget,
            },
        })
        .then((client) => {
            if (client) {
                const hash = bcrypt.hashSync(req.body.password, 10);
                req.body.password = hash;
                client
                    .update({
                        password: req.body.password,
                        forget: null,
                    })
                    .then(() => {
                        res.json({
                            message: "Votre mot de passe est mis à jour",
                        });
                    })
                    .catch((err) => {
                        res.json(err);
                    });
            } else {
                res.json("lien non valide");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});

/* cette route permet à l'utilisateur de pouvoir valider son mail une fois le compte crée */
router.post("/validemail", (req, res) => {
    db.client
        .findOne({
            where: {
                email: req.body.email,
            },
        })
        .then((client) => {
            if (client) {
                /* si tu trouve l'utilisateur tu met son status en true si il est different de 1*/
                if (client.status !== 1) {
                    client
                        .update({
                            status: 1,
                        })
                        .then((itemclient) => {
                            res.json({
                                message: "Votre mail est validé",
                            });
                        })
                        .catch((err) => {
                            res.json(err);
                        });
                } else {
                    res.json("Votre mail est déjà validé");
                }
            } else {
                res.status(404).json("Utilisateur non trouvé !!!");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});

/* cette route permet à l'utilisateur de ce connecter avec ses identifiants */
router.post("/login", (req, res) => {
    db.client
        .findOne({
            where: {
                email: req.body.email,
            },
        })
        .then((client) => {
            if (client.status === true) {
                if (bcrypt.compareSync(req.body.password, client.password)) {
                    let clientdata = {
                        id: client.id,
                        nom: client.nom,
                        email: client.email,
                        password: client.password,
                        adresse: client.adresse,
                        ville: client.ville,
                        cp: client.cp,
                        pays: client.pays,
                        tel: client.tel,
                    };
                    let token = jwt.sign(clientdata, process.env.SECRET_KEY, {
                        expiresIn: 1800,
                        /* 30min */
                    });
                    res.status(200).json({
                        token: token,
                    });
                } else {
                    res.json(err);
                }
            } else {
                res.json({
                    message: "Vous devez valider votre adresse mail",
                });
            }
        })
        .catch((err) => {
            return res.status(404).json("Utilisateur non trouvé");
        });
});

/* cette route permet de reccupérer les info du profil */
router.get("/profil/:id", (req, res) => {
    db.client
        .findOne({
            where: {
                id: req.params.id,
            },
        })
        .then((client) => {
            if (client) {
                let clientdata = {
                    id: client.id,
                    nom: client.nom,
                    email: client.email,
                    password: client.password,
                    adresse: client.adresse,
                    ville: client.ville,
                    cp: client.cp,
                    pays: client.pays,
                    tel: client.tel,
                };
                let token = jwt.sign(clientdata, process.env.SECRET_KEY, {
                    expiresIn: 1800, // 30min
                });
                res.status(200).json({
                    token: token,
                });
            } else {
                res.json("error le client n'est pas dans la base !!!");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});

/* cette route permet de mettre le profil à jour */
router.put("/update/:id", (req, res) => {
    db.client
        .findOne({
            where: {
                id: req.params.id,
            },
        })
        .then((client) => {
            if (client) {
                client
                    .update(req.body)
                    .then((clientitem) => {
                        db.client
                            .findOne({
                                where: {
                                    id: clientitem.id,
                                },
                            })
                            .then((client) => {
                                let clientdata = {
                                    id: client.id,
                                    nom: client.nom,
                                    email: client.email,
                                    password: client.password,
                                    adresse: client.adresse,
                                    ville: client.ville,
                                    cp: client.cp,
                                    pays: client.pays,
                                    tel: client.tel,
                                };
                                let token = jwt.sign(clientdata, process.env.SECRET_KEY, {
                                    expiresIn: 1800, // 30min
                                });
                                res.status(200).json({
                                    token: token,
                                });
                            })
                            .catch((err) => {
                                res.status(400).send(err);
                            });
                    })
                    .catch((err) => {
                        res.status(402).send("impossible de metter à jour le client" + err);
                    });
            } else {
                res.json("client n'est pas dans la base ");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});

module.exports = router;