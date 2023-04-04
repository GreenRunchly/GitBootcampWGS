const router = require('express').Router();
// Module untuk koneksi database
const pooldb = require('../module-db');
// Module untuk Validasi input
const modval = require('../module-validator');

// Menghapus postingan berdasar id [postingan] pada kelas yang ditentukan
router.post('/:idkelas/informasi/:idinformasi/delete', [
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

            let idpemilik = result[0].id_owner;
            if (idpemilik != akun.id){
                // Menolak akses berbagi
                res.status(200).json({
                    pesan : `Akses ditolak`, error : 1
                });
                return;
            }

            // Menghapus Postingan
            let sqlsyn = `
            DELETE FROM informasi 
            WHERE id_owner= ? AND id_class= ? AND id= ?
            `;
            pooldb.query( sqlsyn, [akun.id, idkelas, idinformasi], (err, result) => { 
                
                if (err){ // Jika Error Syntax atau semacamnya
                    res.status(200).json({
                        pesan : `Kesalahan Internal (${err})`, error : 1
                    });
                    return;
                } else { // Menampilkan kelas yang join
                    
                    res.status(200).json({
                        pesan : `Berhasil menghapus postingan!`, sukses : 1
                    });
                    return;

                }
            });

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