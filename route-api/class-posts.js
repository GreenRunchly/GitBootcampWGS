const router = require('express').Router();
// Module untuk koneksi database
const pooldb = require('../module-db');
// Module untuk Validasi input
const modval = require('../module-validator');

// Mengambil Postingan berdasar id [postingan] pada kelas yang ditentukan
router.get('/:idkelas/informasi/:idinformasi', [
    modval.midval.param('idkelas').not().isEmpty().withMessage('ID Kelas tidak terdeteksi!').trim().escape(),
    modval.midval.param('idinformasi').not().isEmpty().withMessage('ID Postingan tidak terdeteksi!').trim().escape(),
], (req, res) => {

    // Cek Error pada validasi input
    if ( modval.midvalResult(req, res) ){ // Jika ditemukan masalah akan return true
        return; // Untuk menghentikan eksekusi lanjutan
    }

    let {akun} = req.bridge; // Mengambil data akun
    let {idkelas, idinformasi} = req.params;

    // Mengecek apakah pengguna ada di kelas atau tidak dan mengambil postingan
    let sqlsyn = `
    SELECT i.* FROM pengguna_class_joined p 
    JOIN kelas k ON k.id=p.id_class 
    JOIN informasi i ON k.id=i.id_class 
    WHERE p.id_owner= ? AND p.id_class= ? AND i.id= ?
    `;
    pooldb.query( sqlsyn, [akun.id, idkelas, idinformasi], (err, result) => { 
        
        if (err){ // Jika Error Syntax atau semacamnya
            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;
        } else if (result[0]){ // Jika Berhasil ditemukan record pertama

            // Encode konten jadi base64 dan ubah title entities
            result[0].title = modval.validator.unescape(result[0].title);
            result[0].content = Buffer.from( result[0].content, 'utf8').toString('base64');
            // Menampilkan kelas yang join
            res.status(200).json({
                pesan : `Berhasil!`, sukses : 1,
                hasil : result
            });
            return;

        }else{
            // Menampilkan data kosong
            res.status(200).json({
                pesan : `Postingan yang dimaksud tidak ada!`, error : 1
            });
            return;
        }
    });
    
});

module.exports = router;