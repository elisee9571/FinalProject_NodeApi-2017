const express = require("express");
const router = express.Router();

/* cette route permet de recevoir toute sorte de mail */
router.post("/sendmail", (req, res) => {
    var nodemailer = require("nodemailer");
    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: "587",
        service: "gmail",
        auth: {
            user: "eltest2node@gmail.com",
            pass: "Eltest2nodemailer",
        },
        secure: "false",
        tls: {
            ciphers: "SSLv3",
            rejectUnauthorized: false,
        },
    });
    var mailOptions = {
        from: "eltest2node@gmail.com",
        to: req.body.email,
        subject: req.body.subject,
        text: req.body.text,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.json(error);
            console.log(error);
        } else {
            console.log("email sent" + info.response);
            res.json("email sent" + info.response);
        }
    });
});

/* cette route permet de recevoir toute sorte de mail */
router.post("/receivemail", (req, res) => {
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
        from: req.body.email,
        to: "eltest2node@gmail.com",
        subject: req.body.subject,
        text: req.body.text,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.json(error);
            console.log(error);
        } else {
            console.log("email sent" + info.response);
            res.json("email sent" + info.response);
        }
    });
});

module.exports = router;