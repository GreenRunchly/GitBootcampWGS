const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();
const {db} = require("../dtbs/db");
const sha256 = require('js-sha256');

router.post("/", (req, res) => {
    const {email, password} = req.body;
    const sql = `SELECT d.id FROM dosen d WHERE email = ? AND password = ? LIMIT 1`;

    db.query(sql, [email, sha256(password)], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ 
                code: 500,
                err:"sql error: please contact your administrator"
            });
        } else if (!result.length) {
            return res.status(401).json({
                code: 401,
                err:"username atau password salah"
            });
        }

        jwt.sign(result[0], "myjwtsecret", {expiresIn: 120}, (err, token) => {
            if (err) throw err;
            res.status(200).json({ code: 200, token });
        });
    });
});

module.exports = router;