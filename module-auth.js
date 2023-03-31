require('dotenv').config(); // Load Configuration
const jwt = require('jsonwebtoken');
const pooldb = require('./module-db');
const strtotime = require('nodestrtotime');

let aksiauth = {};

aksiauth.akun = (req, res, next) => {
    
    let {tokensesi} = req.cookies;

    // Verifikasi Token Sesi
    jwt.verify(tokensesi, 'otentikasi', (err, decoded) => {

        // Cek Error pada apikey
        if (err){
            if (req.iswebpageroute){
                res.clearCookie('tokensesi');
                res.redirect('/portal');
                return;
            }else{
                res.clearCookie('tokensesi');
                res.status(200).json({
                    pesan : `Otentikasi Token Gagal (${err}), coba lagi nanti..`, error : 1
                });
                return;
            }
        }     

        // Jika tidak ada error
        let {username, password, userid} = decoded.data;

        // Cek User Username dan Password dan ID User
        let sqlsyn = `SELECT * FROM pengguna WHERE id='${userid}' AND username='${username}' AND MD5(password)='${password}'`;
        pooldb.query( sqlsyn, (err, result) => {
            // Jika Error Syntax atau semacamnya
            if (err){
                if (req.iswebpageroute){
                    res.clearCookie('tokensesi');
                    res.redirect('/portal');
                    return;
                }else{ 
                    res.clearCookie('tokensesi');
                    res.status(200).json({
                        pesan : `Otentikasi Token Gagal (${err}), coba lagi nanti..`, error : 1
                    });
                    return;
                }
            }
            // User Pass Checks
            if (result[0]){
                // Process Data
                delete (result[0].password);
                // result[0].created = strtotime(`${result[0].created}`);
                // result[0].updated = strtotime(`${result[0].updated}`);
                req.bridge = {akun:result[0]};
                // Next Middleware
                next();
            }
        });
    
    });
    
};
aksiauth.passwebpage = (req, res, next) =>{
    req.iswebpageroute = true;
    next();
}
aksiauth.noneedlogin = (req, res, next) => {
    if (!req.cookies.tokensesi){
        next();
    }else{
        res.redirect('/dashboard');
        return;
    }
};
aksiauth.next = (req, res, next) => {
    next();
};

module.exports = aksiauth;