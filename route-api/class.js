const router = require('express').Router();
// Module untuk koneksi database
const pooldb = require('../module-db');
// Module untuk Validasi input
const modval = require('../module-validator');

// Mengambil Kelas spesifik dan hanya bisa akses data penting jika sudah bergabung (jika public)
router.get('/:idkelas', [
    modval.midval.param('idkelas').not().isEmpty().withMessage('ID Kelas tidak terdeteksi!').trim().escape()
], (req, res) => {

    // Cek Error pada validasi input
    if ( modval.midvalResult(req, res) ){ // Jika ditemukan masalah akan return true
        return; // Untuk menghentikan eksekusi lanjutan
    }

    let {akun} = req.bridge; // Mengambil data akun
    let idkelas = req.params.idkelas; // Mengambil id kelas sesuai request

    // Init SQL Query Syntax
    let sqlsyn = ``; let sqlparams = [];

    // Mengambil daftar kelas yang dibuat dan join
    sqlsyn += `
    SELECT k.*, peng.name as class_owner_name, peng.id as class_owner_id FROM pengguna_class_joined p 
    /* Ambil Data Kelas */
    JOIN kelas k ON k.id = p.id_class 
    /* Ambil Data Identitas Pemilik Kelas */
    JOIN pengguna peng ON peng.id = k.id_owner 
    WHERE p.id_owner = ? AND p.id_class = ?;
    `;
    sqlparams.push(akun.id, idkelas);

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
                    pesan : `Kelas ditemukan!`, sukses : 1,
                    hasil : result
                });
                return;
            }else{
                // Menampilkan kelas yang sudah join
                res.status(200).json({
                    pesan : `Kelas yang dimaksud tidak ditemukan!`, error : 1
                });
                return;
            }
            

        };
    });
    
});

module.exports = router;