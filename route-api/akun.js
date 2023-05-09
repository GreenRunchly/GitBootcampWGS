const router = require('express').Router();
const md5 = require('md5');
const jwt = require('jsonwebtoken');
// Module untuk koneksi database
const pooldb = require('../module-db');
// Module untuk Validasi input
const modval = require('../module-validator');

router.get('/:idakun', [
    modval.midval.param('idakun').not().isEmpty().withMessage('ID Akun tidak terdeteksi!').trim().escape()
], (req, res) => { // Masuk akun pertama kali untuk mendapatkan token

    // Cek Error pada validasi input
    if ( modval.midvalResult(req, res) ){ // Jika ditemukan masalah akan return true
        return; // Untuk menghentikan eksekusi lanjutan
    }

    let {akun} = req.bridge; // Mengambil data akun
    let idakun = req.params.idakun; // Mengambil id kelas sesuai request

    // Init SQL Query Syntax
    let sqlsyn = ``; let sqlparams = [];

    // Jika id atau username akun sama dengan yang sedang login
    if ( (akun.id == idakun) || (akun.username == idakun) ) {
        // Mengambil data siswa secara lengkap
        sqlsyn += `
        SELECT * FROM pengguna 
        WHERE id = ? OR username = ?
        `;
    }else{
        // Mengambil data siswa secara umum
        sqlsyn += `
        SELECT id, username, name, created FROM pengguna 
        WHERE id = ? OR username = ?
        `;
    }
    sqlparams.push(idakun, idakun);

    // Eksekusi Query
    pooldb.query( sqlsyn, sqlparams, (err, result) => { 
        if (err){ // Cek ada error atau tidak

            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;

        } else { // Jika error tidak ditemukan
            
            if (result[0]){
                // Menampilkan kelas yang sudah join
                res.status(200).json({
                    pesan : `Peserta ditemukan!`, sukses : 1,
                    hasil : result
                });
                return;
            }else{
                // Menampilkan kelas yang sudah join
                res.status(200).json({
                    pesan : `Peserta yang dimaksud tidak ditemukan!`, error : 1
                });
                return;
            }
            
        };
    });

});

module.exports = router;