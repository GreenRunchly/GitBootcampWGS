const router = require('express').Router();
const md5 = require('md5');
// Module untuk koneksi database
const pooldb = require('../module-db');
// Module untuk Validasi input
const modval = require('../module-validator');

// Edit kelas
router.post('/:idkelas/edit',[
    modval.midval.param('idkelas').not().isEmpty().withMessage('ID Kelas tidak terdeteksi!').trim().escape(),
    modval.midval.body('name').isLength({ min: 5, max: 30 }).withMessage('Karakter Nama harus minimal 5 dan maksimal 30!').trim().escape(),
    modval.midval.body('subject').isLength({ min: 1 }).withMessage('Subject tidak boleh kosong!').trim().escape(),
    modval.midval.body('room').isLength({ min: 1 }).withMessage('Ruangan tidak boleh kosong!').trim().escape(),
    modval.midval.body('max_user').not().isEmpty().withMessage('Penentu maksimal peserta tidak boleh kosong!').trim().escape()
], (req, res) => {

    // Cek Error pada validasi input
    if ( modval.midvalResult(req, res) ){ // Jika ditemukan masalah akan return true
        return; // Untuk menghentikan eksekusi lanjutan
    }

    let {akun} = req.bridge; // Mengambil data akun
    let {name, desc, subject, room, max_user} = req.body; // Mengambil kode kelas
    let {idkelas} = req.params; // Parameter kelas  
    
    // Batas Max User
    if (modval.validator.isInt(max_user)){
        if ((max_user < 1) || (max_user > 100)) {
            // Jika kurang dari 1 atau lebih dari 100
            res.status(200).json({
                pesan : `Max User tidak valid!`, error : 1
            });
            return;
        }else{

            // Init SQL Query Syntax
            let sqlsyn = ``; let sqlparams = [];

            // Mengambil listing peserta pada kelas tersebut
            sqlsyn += `
            SELECT peng.id, peng.name FROM pengguna_class_joined p
            JOIN pengguna peng ON peng.id = p.id_owner
            JOIN kelas k ON k.id = p.id_class
            WHERE p.id_class= ? ;
            `;
            sqlparams.push(idkelas);

            // Eksekusi Query
            pooldb.query( sqlsyn, sqlparams, (err, result) => { 
                if (err){ // Cek ada error atau tidak

                    res.status(200).json({
                        pesan : `Kesalahan Internal (${err})`, error : 1
                    });
                    return;

                } else if (max_user < result.length){ // Jika setting kapasitas lebih kecil dari jumlah peserta yang sekarang

                    res.status(200).json({
                        pesan : `Tidak boleh lebih kecil dari jumlah participant yang sekarang!`, error : 1
                    });
                    return;

                } else{
                    do_the_stuff();
                }
            });

        }
    }else{
        // Jika berisi huruf bukannya angka
        res.status(200).json({
            pesan : `Max User hanya bisa berisi angka antara 1-100!`, error : 1
        });
        return;
    }

    function do_the_stuff() {
        // // Cek validasi tipe visible kelas
        // if (modval.validator.isAlpha(visible)){
        //     console.log(visible);
        //     if ((visible == 'public') || (visible == 'private')){}else{
        //         // Jika berisi selain public dan private
        //         res.status(200).json({
        //             pesan : `Isi tipe kelas invalid`, error : 1
        //         });
        //         return; 
        //     }
        // }

        // Cek Ada di kelas tersebut atau tidak
        let sqlsyn = `
        SELECT k.* FROM pengguna_class_joined p 
        JOIN kelas k ON k.id=p.id_class 
        WHERE p.id_owner= ? AND p.id_class= ? 
        `;
        pooldb.query( sqlsyn, [akun.id, idkelas], (err, result) => { 
            
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
                // Remove record from db
                let sqlsyn = `
                UPDATE kelas SET class_name= ? ,class_desc= ? ,subject= ? ,room= ? ,max_user= ? 
                WHERE id= ?
                `;
                pooldb.query( sqlsyn, [name, desc, subject, room, max_user, idkelas], (err, result) => { 
                    
                    if (err){ // Jika Error Syntax atau semacamnya
                        res.status(200).json({
                            pesan : `Kesalahan Internal (${err})`, error : 1
                        });
                        return;
                    } else {

                        // Menampilkan kelas yang join
                        res.status(200).json({
                            pesan : `Berhasil mengedit kelas!`, sukses : 1
                        });
                        return;

                    }
                    
                });

            }else{
                // Menampilkan error
                res.status(200).json({
                    pesan : `Anda tidak berada dikelas yang dimaksud!`, error : 1
                });
                return;
            }
        });
    }

});

module.exports = router;