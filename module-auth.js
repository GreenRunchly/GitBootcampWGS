require('dotenv').config(); // Load Configuration
const jwt = require('jsonwebtoken');
const pooldb = require('./module-db');
// const strtotime = require('nodestrtotime');

let aksiauth = {}; // Initial Module

aksiauth.akun = (req, res, next) => {
    
    let {tokensesi} = req.cookies; // Mengambil tokensesi pada cookie

    // Verifikasi Token Sesi dengan JWT
    jwt.verify(tokensesi, 'otentikasi', (err, decoded) => {

        if (err){  // Cek error atau tidak

            if (req.passwebpage){ 
                // Jika webpage
                res.clearCookie('tokensesi');
                res.redirect('/portal'); // Redir ke portal
                return;
            }else{
                // Jika API
                res.clearCookie('tokensesi');
                res.status(200).json({
                    pesan : `Otentikasi Token Gagal (${err}), coba lagi nanti..`, error : 1, logout : 1
                });
                return;
            }
            
        }else{ // Jika tidak ada error

            let {username, password, userid} = decoded.data; // Tarik data coy

            // Cek User Username dan Password dan ID User
            let sqlsyn = `
            SELECT * FROM pengguna 
            WHERE id= ? AND username= ? AND password= ?
            `;
            pooldb.query(sqlsyn, [userid, username, password], (err, result) => {
                
                // Cek error atau tidak
                if (err){

                    // Reset login agar tidak ada kerusakan/error mendalam
                    if (req.passwebpage){
                        // Jika di webpage
                        res.clearCookie('tokensesi');
                        res.redirect('/portal');
                        return;
                    }else{ 
                        // Jika di API
                        res.clearCookie('tokensesi');
                        res.status(200).json({
                            pesan : `Otentikasi Token Gagal (${err}), coba lagi nanti..`, error : 1
                        });
                        return;
                    }

                }else if (result[0]){ // Hanya membutuhkan satu hasil

                    // Process Data User
                    // result[0].created = strtotime(`${result[0].created}`);
                    // result[0].updated = strtotime(`${result[0].updated}`);
                    delete (result[0].password); // Hapus password
                    req.bridge = {akun:result[0]};
                    // Next Middleware
                    next();

                }else{

                    // Reset login agar tidak ada kerusakan/error mendalam
                    if (req.passwebpage){
                        // Jika di webpage
                        res.clearCookie('tokensesi');
                        res.redirect('/portal');
                        return;
                    }else{
                        // Jika di API
                        res.clearCookie('tokensesi');
                        res.status(200).json({
                            pesan : `Otentikasi Akun Gagal (UserNotFound), logging out...`, error : 1, logout : 1
                        });
                    }

                }

            });

        }
    
    });
    
};
aksiauth.passwebpage = (req, res, next) =>{

    req.passwebpage = true; // Indikator bahwa ini webpage bukan API
    next(); // Lanjut

}
aksiauth.noneedlogin = (req, res, next) => {

    // Cek cookie pada browser
    if (!req.cookies.tokensesi){
        next(); // Lanjut
    }else{
        res.redirect('/dashboard'); // Redir ke dashboard
        return;
    }

};
aksiauth.next = (req, res, next) => {

    next(); // Lanjut aja

};

module.exports = aksiauth;