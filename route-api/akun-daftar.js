const router = require('express').Router();
const md5 = require('md5');
const jwt = require('jsonwebtoken');
// Module untuk koneksi database
const pooldb = require('../module-db');
// Module untuk Validasi input
const modval = require('../module-validator');

router.post('/', [
    modval.midval.body('username').not().isEmpty().withMessage('Harap isi Username!').isAlphanumeric().withMessage('Hanya huruf dan angka yang diperbolehkan').trim().escape(),
    modval.midval.body('fullname').not().isEmpty().withMessage('Harap isi Nama Lengkap!').trim().escape(),
    modval.midval.body('email').not().isEmpty().withMessage('Harap isi Email!').isEmail().withMessage('Email tidak valid').trim().escape(),
    modval.midval.body('password').not().isEmpty().withMessage('Harap isi Password!').trim().escape(),
    modval.midval.body('password_confirm').not().isEmpty().withMessage('Ketik kembali password pada kolom confirm!').trim().escape()
], (req, res) => { // Masuk akun pertama kali untuk mendapatkan token

    // Cek Error pada validasi input
    if ( modval.midvalResult(req, res) ){ // Jika ditemukan masalah akan return true
        return; // Untuk menghentikan eksekusi lanjutan
    }

    let {username, fullname, email, password, password_confirm} = req.body; // Mengambil data

    // Init SQL Query Syntax
    let sqlsyn = ``; let sqlparams = [];

    // Mencari username
    sqlsyn += `
    SELECT id, username FROM pengguna 
    WHERE username = ? ;
    `;
    sqlparams.push(username);

    // Mencari Email
    sqlsyn += `
    SELECT id, email FROM pengguna 
    WHERE email = ? ;
    `;
    sqlparams.push(email);

    // Eksekusi Query
    pooldb.query( sqlsyn, sqlparams, (err, result) => { 
        if (err){ // Cek ada error atau tidak

            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;

        } else { // Jika error tidak ditemukan

            if (result[0][0]) { // Jika username sudah ada
                res.status(200).json({
                    pesan : `Username sudah dipakai!`, error : 1
                });
                return;
            }
            
            if (result[1][0]) { // Jika email sudah dipakai
                res.status(200).json({
                    pesan : `Email sudah dipakai pada akun lain!`, error : 1
                });
                return;
            }

            if (password != password_confirm) { // Jika email sudah dipakai
                res.status(200).json({
                    pesan : `Password konfirmasi tidak sama, cek kembali!`, error : 1
                });
                return;
            }

            // Jika tidak ada return diatas maka fine :D

            // Init SQL Query Syntax
            let sqlsyn = ``; let sqlparams = [];

            // Mencari username
            sqlsyn += `
            INSERT INTO pengguna (username, email, name, password) 
            VALUES ( ? )
            `;
            sqlparams.push([username, email, fullname, md5(password)]);

            // Eksekusi Query Insert
            pooldb.query( sqlsyn, sqlparams, (err, result) => { 
                if (err){ // Cek ada error atau tidak

                    res.status(200).json({
                        pesan : `Kesalahan Internal (${err})`, error : 1
                    });
                    return;

                } else { // Jika error tidak ditemukan

                    // Login otomatis
                    let token = jwt.sign({
                        data: {
                            username, 
                            password:md5(password), 
                            userid:result.insertId
                        }
                    }, 'otentikasi', { expiresIn: (60*60) });

                    // Set Cookie
                    res.cookie('tokensesi', token, {expire:(60*60)});
                    res.status(200).json({
                        pesan : `Berhasil Daftar, masuk otomatis!`, sukses : 1
                    });
                    return;
                
                }
            });


            

            
    
        }
    });

});

module.exports = router;