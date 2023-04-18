const router = require('express').Router();
const md5 = require('md5');
const jwt = require('jsonwebtoken');
// Module untuk koneksi database
const pooldb = require('../module-db');
// Module untuk Validasi input
const modval = require('../module-validator');

router.post('/:idkelas/informasi/:idinformasi/evaluation/start', (req, res) => { // Masuk akun pertama kali untuk mendapatkan token

    // Cek Error pada validasi input
    if ( modval.midvalResult(req, res) ){ // Jika ditemukan masalah akan return true
        return; // Untuk menghentikan eksekusi lanjutan
    }

    let {akun} = req.bridge; // Mengambil data akun
    let {idkelas, idinformasi} = req.params; // Parameter kelas

    // Init SQL Query Syntax
    let sqlsyn = ``; let sqlparams = [];

    // Cek apakah kelasnya ada atau tidak
    sqlsyn += `
    SELECT k.*, peng.name as class_owner_name, peng.id as class_owner_id FROM kelas k
    /* Ambil Data Identitas Pemilik Kelas */
    JOIN pengguna peng ON peng.id = k.id_owner 
    WHERE k.id = ? ;
    `;
    sqlparams.push(idkelas);

    // Cek apakah peserta ada dikelas tersebut atau tidak
    sqlsyn += `
    SELECT peng.* FROM pengguna_class_joined p 
    JOIN kelas k ON k.id=p.id_class 
    JOIN pengguna peng ON peng.id=p.id_owner
    WHERE p.id_owner = ? AND p.id_class = ? ;
    `;
    sqlparams.push(akun.id, idkelas);

    // Mengambil record evaluasi
    sqlsyn += `
    SELECT er.* FROM evaluasi_result er
    WHERE er.id_informasi = ? AND er.id_owner = ? ;
    `;
    sqlparams.push(idinformasi, akun.id);

    // Eksekusi Query
    pooldb.query( sqlsyn, sqlparams, (err, result) => { 
        if (err){ // Cek ada error atau tidak

            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;

        } else { // Jika error tidak ditemukan

            // Record Query pertama ditemukan dan Cek jenis kelas
            if ((result[0][0])){ 
                // Cek ketersediaan peserta pada kelas
                if ((result[1][0])){
                    // Cek record peserta pada informasi (evaluasi)
                    if ((result[2][0])){

                        // Init SQL Query Syntax
                        let sqlsyn = ``; let sqlparams = [];

                        // Mengambil record evaluasi
                        sqlsyn += `
                        SELECT er.* FROM evaluasi_result er
                        WHERE er.id_informasi = ? AND er.id_owner = ? ;
                        `;
                        sqlparams.push(idinformasi, akun.id);

                        // Eksekusi Query Insert
                        pooldb.query( sqlsyn, sqlparams, (err, result) => { 
                            if (err){ // Cek ada error atau tidak

                                res.status(200).json({
                                    pesan : `Kesalahan Internal (${err})`, error : 1
                                });
                                return;

                            } else { // Jika error tidak ditemukan

                                switch (result[0].status) {
                                    case 'end':
                                        // Menampilkan pesan melanjutkan
                                        res.status(200).json({
                                            pesan : `Anda sudah mengerjakan evaluasi ini!`, error : 1
                                        });
                                        return;
                                        break;
                                
                                    default:
                                        // Menampilkan pesan melanjutkan
                                        res.status(200).json({
                                            pesan : `Melanjutkan...`, sukses : 1
                                        });
                                        return;
                                        break;
                                }
                                
                            }
                        });

                    }else{

                        // Init SQL Query Syntax
                        let sqlsyn = ``; let sqlparams = [];

                        // Menambah record
                        sqlsyn += `
                        INSERT INTO evaluasi_result (id_owner, id_informasi) 
                        VALUES ( ? )
                        `;
                        sqlparams.push([akun.id, idinformasi]);

                        // Eksekusi Query Insert
                        pooldb.query( sqlsyn, sqlparams, (err, result) => { 
                            if (err){ // Cek ada error atau tidak

                                res.status(200).json({
                                    pesan : `Kesalahan Internal (${err})`, error : 1
                                });
                                return;

                            } else { // Jika error tidak ditemukan

                                // Menampilkan pesan memulai
                                res.status(200).json({
                                    pesan : `Memulai...`, sukses : 1
                                });
                                return;

                            }
                        });

                    }
                    
                }else{

                    // Menampilkan pesan ditolak
                    res.status(200).json({
                        pesan : `Kamu tidak berada didalam kelas tersebut!`, error : 1
                    });
                    return;

                }
            } else { 

                // Menampilkan kelas public yang sudah join
                res.status(200).json({
                    pesan : `Kelas tidak ditemukan`, sukses : 1,
                    hasil : result[0]
                });
                return;

            }            

        };
    });

});

module.exports = router;