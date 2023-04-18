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
    modval.midval.body('max_user').not().isEmpty().withMessage('Penentu maksimal peserta tidak boleh kosong!').trim().escape()
], (req, res) => {
    
    // Cek Error pada validasi input
    if ( modval.midvalResult(req, res) ){ // Jika ditemukan masalah akan return true
        return; // Untuk menghentikan eksekusi lanjutan
    }

    let {akun} = req.bridge; // Mengambil data akun
    let {name, desc, subject, room, max_user} = req.body; // Mengambil kode kelas

    // Batas Max User
    if (modval.validator.isInt(max_user)){
        if ((max_user < 1) || (max_user > 100)) {
            // Jika kurang dari 1 atau lebih dari 100
            res.status(200).json({
                pesan : `Max User tidak valid!`, error : 1
            });
            return;
        }
    }else{
        // Jika berisi huruf bukannya angka
        res.status(200).json({
            pesan : `Max User hanya bisa berisi angka antara 1-100!`, error : 1
        });
        return;
    }

    // // Cek validasi tipe visible kelas
    // if (modval.validator.isAlpha(visible)){
    //     if ((visible == 'public') || (visible == 'private')){}else{
    //         // Jika berisi selain public dan private
    //         res.status(200).json({
    //             pesan : `Isi tipe kelas invalid`, error : 1
    //         });
    //         return; 
    //     }
    // }
    
    // Menambahkan Kelas
    let sqlsyn = `
    INSERT INTO kelas (id_owner, class_name, class_desc, subject, room, max_user) 
    VALUES ( ?, ?, ?, ?, ?, ? )
    `;
    pooldb.query( sqlsyn, [akun.id, name, desc, subject, room, max_user], (err, result) => { 
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