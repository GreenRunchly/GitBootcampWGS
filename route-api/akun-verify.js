const router = require('express').Router();
const md5 = require('md5');
// Module untuk koneksi database
const pooldb = require('../module-db');
// Module untuk Validasi input
const modval = require('../module-validator');

// Mengirim OTP ke user untuk validasi registrasi akun
router.get('/akun/verify', auth.akun, (req, res) => {

    let {akun} = req.bridge; // Mengambil data akun

    // Cek OTP Request
    let sqlsyn = `SELECT * FROM otp_request WHERE id_owner='${akun.id}' AND (status='unverified' OR status='pending')`;
    pooldb.query( sqlsyn, (err, result) => { 
        // Jika Error Syntax atau semacamnya
        if (err){ 
            console.log(`Error (${err})`);
        }
        if (result[0]){
            let idrecord = result[0].id;
            let timenow = strtotime('now');
            let updatedrecord = ((result[0].updated).getTime()/1000);
            if (timenow > updatedrecord+1){
                // Update OTP Code and status
                let sqlsyn = `UPDATE otp_request SET code='${alat.numberGen(6)}', status='unverified' WHERE id='${idrecord}'`;
                pooldb.query( sqlsyn, (err, result) => { 
                    // Jika Error Syntax atau semacamnya
                    if (err){ 
                        res.status(200).json({
                            pesan : `Kesalahan Internal (${err})`, error : 1
                        });
                        return;
                    }
                    // Berhasil diubah
                    res.status(200).json({
                        pesan : `OTP akan dikirimkan ke wa, jika tidak kunjung datang, tunggu 2 menit atau lebih...`, sukses : 1
                    });
                    return;
                });
            }else{
                res.status(200).json({
                    pesan : `Tunggu 3 menit untuk meminta OTP baru`, error : 1
                });
                return;
            }
        }else{
            // Menambahkan OTP Record
            let sqlsyn = `INSERT INTO otp_request (id_owner, code) VALUES ('${akun.id}','${alat.numberGen(6)}')`;
            pooldb.query( sqlsyn, (err, result) => { 
                // Jika Error Syntax atau semacamnya
                if (err){ 
                    res.status(200).json({
                        pesan : `Kesalahan Internal (${err})`, error : 1
                    });
                    return;
                }
                // Berhasil ditambahkan
                res.status(200).json({
                    pesan : `OTP akan dikirimkan ke wa, jika tidak kunjung datang, tunggu 2 menit atau lebih...`, sukses : 1
                });
                return;
            });
        }
    
    });
    
});

module.exports = router;