const router = require('express').Router();
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const alat = require('../module-tools');
// const strtotime = require('nodestrtotime');
const pooldb = require('../module-db');
// const auth = require('../module-auth');

// Module untuk Validasi input
const midval = require('express-validator');
function midvalResult(req, res, next) {
    // Validasi Input
    const errorValidasiInput = midval.validationResult(req);
    if (!errorValidasiInput.isEmpty()) { // Jika tidak ada error
        res.status(200).json({
            pesan : errorValidasiInput.errors[0].msg, error : 1
        });
        return true;
    }else{
        return false;
    }
}

router.post('/akun/masuk', [
    midval.body('username').not().isEmpty().withMessage('Harap isi Username!').trim().escape(),
    midval.body('password').not().isEmpty().withMessage('Harap isi password!').trim().escape()
], (req, res) => { // Masuk akun pertama kali untuk mendapatkan token

    // Cek Error pada validasi input
    if ( midvalResult(req, res) ){ // Jika ditemukan masalah akan return true
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
            }else if (result[0].password != password) {
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

router.post('/akun/keluar', (req, res) => { // Keluar dari akun
    // Clear cookie
    res.clearCookie('tokensesi');
    res.status(200).json({
        pesan : `Berhasil Keluar!`, sukses : 1
    });
    return;
});

// Mengirim OTP ke user untuk validasi registrasi akun
// router.get('/akun/verify', auth.akun, (req, res) => {

//     let {akun} = req.bridge; // Mengambil data akun

//     // Cek OTP Request
//     let sqlsyn = `SELECT * FROM otp_request WHERE id_owner='${akun.id}' AND (status='unverified' OR status='pending')`;
//     pooldb.query( sqlsyn, (err, result) => { 
//         // Jika Error Syntax atau semacamnya
//         if (err){ 
//             console.log(`Error (${err})`);
//         }
//         if (result[0]){
//             let idrecord = result[0].id;
//             let timenow = strtotime('now');
//             let updatedrecord = ((result[0].updated).getTime()/1000);
//             if (timenow > updatedrecord+1){
//                 // Update OTP Code and status
//                 let sqlsyn = `UPDATE otp_request SET code='${alat.numberGen(6)}', status='unverified' WHERE id='${idrecord}'`;
//                 pooldb.query( sqlsyn, (err, result) => { 
//                     // Jika Error Syntax atau semacamnya
//                     if (err){ 
//                         res.status(200).json({
//                             pesan : `Kesalahan Internal (${err})`, error : 1
//                         });
//                         return;
//                     }
//                     // Berhasil diubah
//                     res.status(200).json({
//                         pesan : `OTP akan dikirimkan ke wa, jika tidak kunjung datang, tunggu 2 menit atau lebih...`, sukses : 1
//                     });
//                     return;
//                 });
//             }else{
//                 res.status(200).json({
//                     pesan : `Tunggu 3 menit untuk meminta OTP baru`, error : 1
//                 });
//                 return;
//             }
//         }else{
//             // Menambahkan OTP Record
//             let sqlsyn = `INSERT INTO otp_request (id_owner, code) VALUES ('${akun.id}','${alat.numberGen(6)}')`;
//             pooldb.query( sqlsyn, (err, result) => { 
//                 // Jika Error Syntax atau semacamnya
//                 if (err){ 
//                     res.status(200).json({
//                         pesan : `Kesalahan Internal (${err})`, error : 1
//                     });
//                     return;
//                 }
//                 // Berhasil ditambahkan
//                 res.status(200).json({
//                     pesan : `OTP akan dikirimkan ke wa, jika tidak kunjung datang, tunggu 2 menit atau lebih...`, sukses : 1
//                 });
//                 return;
//             });
//         }
    
//     });
    
// });

module.exports = router;