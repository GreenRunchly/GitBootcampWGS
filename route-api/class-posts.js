const router = require('express').Router();
// Module untuk koneksi database
const pooldb = require('../module-db');
// Module untuk Validasi input
const modval = require('../module-validator');
// Module tools
const tools = require('../module-tools');

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

    // Init SQL Query Syntax
    let sqlsyn = ``; let sqlparams = [];

    // Cek apakah kelasnya ada atau tidak
    sqlsyn += `
    SELECT k.* FROM kelas k
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

    // Eksekusi Query
    pooldb.query( sqlsyn, sqlparams, (err, result) => { 
        if (err){ // Cek ada error atau tidak

            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;

        } else {
            
            // Cek jenis kelas
            if ((result[0][0]) && (result[0][0].visible == 'private')){ // Kelas Private
                // Cek ketersediaan peserta pada kelas
                if ((result[1][0])){
                    
                    // ReInit SQL Query Syntax
                    let sqlsyn = ``; let sqlparams = [];

                    // Mengambil Informasi Lengkap
                    sqlsyn += `
                    SELECT i.* FROM informasi i 
                    JOIN kelas k ON k.id=i.id_class
                    WHERE k.id= ? AND i.id= ? ;
                    `;
                    sqlparams.push(idkelas, idinformasi);

                    // Eksekusi Query
                    pooldb.query( sqlsyn, sqlparams, (err, result_) => { 
                        if (err){ // Cek ada error atau tidak
                            
                            res.status(200).json({
                                pesan : `Kesalahan Internal (${err})`, error : 1
                            });
                            return;

                        } else {

                            if (result_[0]) {

                                // Encode Konten dan Hapus HTML Entities pada title
                                result_[0].title = modval.validator.unescape(result_[0].title);
                                result_[0].content = tools.base64Encode(result_[0].content);
                                
                                // Menampilkan data postingan
                                res.status(200).json({
                                    pesan : `Kelas private ditemukan, anda ada dikelas, menampilkan informasi`, sukses : 1,
                                    hasil : result_
                                });
                                return;                              
                                
                            }else{
    
                                // Menampilkan pesan gagal
                                res.status(200).json({
                                    pesan : `Postingan yang dimaksud tidak ditemukan dalam kelas private ini!`, error : 1
                                });
                                return;
    
                            }
                        
                        };
                    });
                    
                }else{

                    // Menampilkan pesan ditolak
                    res.status(200).json({
                        pesan : `Kamu tidak berada didalam kelas tersebut!`, error : 1
                    });
                    return;

                }
            } else if ((result[0][0]) && (result[0][0].visible == 'public')){ // Kelas Public

                // ReInit SQL Query Syntax
                let sqlsyn = ``; let sqlparams = [];

                // Mengambil Informasi Lengkap
                sqlsyn += `
                SELECT i.* FROM informasi i 
                JOIN kelas k ON k.id=i.id_class
                WHERE k.id= ? AND i.id= ? ;
                `;
                sqlparams.push(idkelas, idinformasi);

                // Eksekusi Query
                pooldb.query( sqlsyn, sqlparams, (err, result_) => { 
                    if (err){ // Cek ada error atau tidak

                        res.status(200).json({
                            pesan : `Kesalahan Internal (${err})`, error : 1
                        });
                        return;

                    } else {

                        if (result_[0]) {

                            // Encode Konten dan Hapus HTML Entities pada title
                            result_[0].title = modval.validator.unescape(result_[0].title);
                            result_[0].content = tools.base64Encode(result_[0].content);

                            // Menampilkan data postingan
                            res.status(200).json({
                                pesan : `Kelas publik ditemukan, anda ada dikelas, menampilkan informasi`, sukses : 1,
                                hasil : result_
                            });
                            return;
                        
                        }else{

                            // Menampilkan pesan gagal
                            res.status(200).json({
                                pesan : `Postingan yang dimaksud tidak ditemukan dalam kelas public ini!`, error : 1
                            });
                            return;

                        }
                    
                    };
                });

            }else{

                // Menampilkan pesan gagal
                res.status(200).json({
                    pesan : `Postingan yang dimaksud tidak ditemukan!`, error : 1
                });
                return;

            };

        };
    });    
    
});

module.exports = router;