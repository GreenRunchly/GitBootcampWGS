const router = require('express').Router();
const md5 = require('md5');
// Module untuk koneksi database
const pooldb = require('../module-db');
// Module untuk Validasi input
const modval = require('../module-validator');

// Membuat kelas
router.post('/create',[
    modval.midval.body('name').isLength({ min: 5, max: 30 }).withMessage('Karakter Nama harus minimal 5 dan maksimal 30!').trim().escape(),
    modval.midval.body('desc').isLength({ min: 0, max: 150 }).withMessage('Karakter Deskripsi harus minimal 5 dan maksimal 100!').trim().escape(),
    modval.midval.body('subject').not().isEmpty().withMessage('Subject tidak boleh kosong!').trim().escape(),
    modval.midval.body('room').not().isEmpty().withMessage('Ruangan tidak boleh kosong!').trim().escape(),
], (req, res) => {
    
    // Cek Error pada validasi input
    if ( modval.midvalResult(req, res) ){ // Jika ditemukan masalah akan return true
        return; // Untuk menghentikan eksekusi lanjutan
    }

    let {akun} = req.bridge; // Mengambil data akun
    let {name, desc, subject, room} = req.body; // Mengambil kode kelas
    
    // Menambahkan Kelas
    let sqlsyn = `
    INSERT INTO kelas (id_owner, class_name, class_desc, subject, room) 
    VALUES ( ?, ?, ?, ?, ? )
    `;
    pooldb.query( sqlsyn, [akun.id, name, desc, subject, room], (err, result) => { 
        // Jika Error Syntax atau semacamnya
        if (err){ 
            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;
        } else {
            // Menambahkan akun ke kelas
            let sqlsyn = `
            INSERT INTO pengguna_class_joined (id_owner, id_class) 
            VALUES ( ?, ? )
            `;
            pooldb.query( sqlsyn, [akun.id, result.insertId], (err, result) => { 
                
                if (err){ // Jika Error Syntax atau semacamnya
                    res.status(200).json({
                        pesan : `Kesalahan Internal (${err})`, error : 1
                    });
                    return;
                } else { // Menampilkan pesan berhasil
                    
                    res.status(200).json({
                        pesan : `Berhasil Membuat Kelas!`, sukses : 1
                    });
                    return;

                }
                
            });
        }
    });

});

module.exports = router;