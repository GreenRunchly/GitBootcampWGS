const router = require('express').Router();
const md5 = require('md5');
// Module untuk koneksi database
const pooldb = require('../module-db');
// Module untuk Validasi input
const modval = require('../module-validator');

// Mengambil semua kelas pengguna
router.get('/saya', (req, res) => {

    let {akun} = req.bridge; // Mengambil data akun

    // Init SQL Query Syntax
    let sqlsyn = ``; let sqlparams = [];

    // Mengambil daftar kelas yang dibuat dan join
    sqlsyn += `
    SELECT k.*, peng.name as owner_name FROM pengguna_class_joined p 
    /* Ambil Kelas */
    JOIN kelas k ON k.id = p.id_class 
    /* Ambil Identitas Pemilik Kelas */
    JOIN pengguna peng ON peng.id = k.id_owner 
    WHERE p.id_owner = ? ORDER BY p.updated ASC;
    `;
    sqlparams.push(akun.id);

    // Eksekusi Query
    pooldb.query( sqlsyn, sqlparams, (err, result) => { 
        if (err){ // Cek ada error atau tidak

            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;

        } else { // Jika error tidak ditemukan
            
            // Menampilkan kelas yang sudah join
            res.status(200).json({
                pesan : `Berhasil!`, sukses : 1,
                hasil : result
            });
            return;

        };
    });
    
});

module.exports = router;