const router = require('express').Router();
// Module untuk koneksi database
const pooldb = require('../module-db');
// Module untuk Validasi input
const modval = require('../module-validator');

// Mengambil semua data postingan yang bisa dilihat oleh pengguna pada kelas yang dimaksud
router.get('/:idkelas/informasi/saya', [
    modval.midval.param('idkelas').not().isEmpty().withMessage('ID Kelas tidak terdeteksi!').trim().escape()
], (req, res) => {

    // Cek Error pada validasi input
    if ( modval.midvalResult(req, res) ){ // Jika ditemukan masalah akan return true
        return; // Untuk menghentikan eksekusi lanjutan
    }

    let {akun} = req.bridge; // Mengambil data akun
    let {idkelas, idinformasi} = req.params; // Mengambil data parameter

    // Cek semua data (listing) postingan pada kelas yang dimaksud
    let sqlsyn = `
    SELECT i.id, i.id_owner, i.id_class, i.title, i.created, i.updated FROM pengguna_class_joined p 
    JOIN kelas k ON k.id=p.id_class 
    JOIN informasi i ON k.id=i.id_class 
    WHERE p.id_owner= ? AND p.id_class= ?
    `;
    pooldb.query(sqlsyn, [akun.id, idkelas], (err, result) => { 
        
        if (err){ // Cek ada error atau tidak
            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;
        } else if (result[0]) {
            // Encode konten jadi html entiies
            result[0].title = modval.validator.unescape(result[0].title);

            // Menampilkan kelas yang join
            res.status(200).json({
                pesan : `Postingan kelas berhasil diambil!`, sukses : 1,
                hasil : result
            });
            return;
        } else {
            // Menampilkan data kosong
            res.status(200).json({
                pesan : `Belum ada postingan samsek!`, sukses : 1,
                hasil : result
            });
            return;
        }
    });
    
});

module.exports = router;