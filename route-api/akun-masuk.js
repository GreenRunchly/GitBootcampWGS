const router = require('express').Router();
const md5 = require('md5');
const jwt = require('jsonwebtoken');
// Module untuk koneksi database
const pooldb = require('../module-db');
// Module untuk Validasi input
const modval = require('../module-validator');

router.post('/', [
    modval.midval.body('username').not().isEmpty().withMessage('Harap isi Username!').trim().escape(),
    modval.midval.body('password').not().isEmpty().withMessage('Harap isi password!').trim().escape()
], (req, res) => { // Masuk akun pertama kali untuk mendapatkan token

    // Cek Error pada validasi input
    if ( modval.midvalResult(req, res) ){ // Jika ditemukan masalah akan return true
        return; // Untuk menghentikan eksekusi lanjutan
    }

    let {username, password} = req.body; // Mengambil data
   
    // Mengambil id, username dan password untuk pencocokan data pada token
    let sqlsyn = `
    SELECT id, password, username FROM pengguna 
    WHERE username = ? 
    `;
    pooldb.query( sqlsyn,  [username], (err, result) => {

        if (err){  // Cek error atau tidak
            
            res.status(200).json({
                pesan : `Gagal Masuk! (${err})`, error : 1
            });
            return;

        }else if (result[0]){ // Jika Berhasil ditemukan record pertama

            // Cek kesamaan password dan username
            if (result[0].username != username){
                // Username tidak cocok (CASE SENSITIVE)
                res.status(200).json({
                    pesan : `Username tidak ditemukan!`, error : 1
                });
                return;
            }else if (result[0].password != md5(password)) {
                // Password tidak cocok (CASE SENSITIVE)
                res.status(200).json({
                    pesan : `Password tidak cocok!`, error : 1
                });
                return;
            }

            // Jika tidak ada return diatas maka fine :D
            let token = jwt.sign({
                data: {
                    username, 
                    password:md5(password), 
                    userid:result[0].id
                }
            }, 'otentikasi', { expiresIn: (60*60) });

            // Set Cookie
            res.cookie('tokensesi', token, {expire:(60*60)});
            res.status(200).json({
                pesan : `Berhasil Masuk!`, sukses : 1
            });
            return;
           
        }else{
            // Username tidak ditemukan
            res.status(200).json({
                pesan : `Username tidak ditemukan!`, error : 1
            });
            return;
        }
        
    });

});

module.exports = router;