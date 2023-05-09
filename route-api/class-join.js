const router = require('express').Router();
const md5 = require('md5');
// Module untuk koneksi database
const pooldb = require('../module-db');
// Module untuk Validasi input
const modval = require('../module-validator');

// Bergabung ke kelas
router.post('/join', [
    modval.midval.body('invitecode').isLength({ min: 12, max: 12 }).withMessage('Masukan 12 digit kode undangan!').trim().escape().isNumeric().withMessage('Kode tidak valid!')
], (req, res) => {

    // Cek Error pada validasi input
    if ( modval.midvalResult(req, res) ){ // Jika ditemukan masalah akan return true
        return; // Untuk menghentikan eksekusi lanjutan
    }

    let {akun} = req.bridge; // Mengambil data akun
    let {invitecode} = req.body; // Mengambil kode kelas

    // Cek Kode Invite yang dimaksud
    let sqlsyn = `
    SELECT ki.* FROM kelas_invite ki 
    JOIN kelas k ON k.id=ki.id_class 
    WHERE invite_code= ? `;
    pooldb.query( sqlsyn, [invitecode], (err, result) => { 
        
        if (err){ // Jika Error Syntax atau semacamnya
            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;
        } else if (result[0]){ // Jika Berhasil ditemukan record pertama

            let {id_class} = result[0]; 

            // Cek Apakah berada di kelas atau belum
            let sqlsyn = `
            SELECT id_owner, id_class FROM pengguna_class_joined 
            WHERE id_owner= ? AND id_class= ? 
            `;
            pooldb.query( sqlsyn, [akun.id, id_class], (err, result) => { 
                
                if (err){ // Jika Error Syntax atau semacamnya
                    res.status(200).json({
                        pesan : `Kesalahan Internal (${err})`, error : 1
                    });
                    return;
                } else if (result[0]){ // Jika Berhasil ditemukan record pertama
                    // Menampilkan pesan berhasil
                    res.status(200).json({
                        pesan : `Bung, anda sudah berada dikelas tersebut!`, error : 1
                    });
                    return;

                }else{ // Cek Kapasitas Kelas dan Menambahkan akun ke kelas (join kelas)

                    // Init SQL Query Syntax
                    let sqlsyn = ``; let sqlparams = [];

                    // Mengambil kelas yang dimaksud
                    sqlsyn += `
                    SELECT k.max_user FROM kelas k
                    WHERE k.id = ?;
                    `;
                    sqlparams.push(id_class);

                    // Mengambil kelas yang dimaksud
                    sqlsyn += `
                    SELECT p.id_owner, p.id_class FROM pengguna_class_joined p
                    WHERE p.id_class = ?;
                    `;
                    sqlparams.push(id_class);

                    // Eksekusi Query
                    pooldb.query( sqlsyn, sqlparams, (err, result_) => { 
                        if (err){ // Cek ada error atau tidak
                            
                            res.status(200).json({
                                pesan : `Kesalahan Internal (${err})`, error : 1
                            });
                            return;
                
                        } else { // Jika error tidak ditemukan
                            
                            if (result_[1].length >= result_[0][0].max_user){ // Jika kapasitas sudah penuh
                                res.status(200).json({
                                    pesan : `Kelas sudah penuh!`, error : 1
                                });
                                return;
                            }
                            
                            let sqlsyn = `
                            INSERT INTO pengguna_class_joined (id_owner, id_class) 
                            VALUES ( ?, ? )
                            `;
                            pooldb.query( sqlsyn, [akun.id, id_class], (err, result) => { 
                                
                                if (err){ // Jika Error Syntax atau semacamnya
                                    res.status(200).json({
                                        pesan : `Kesalahan Internal (${err})`, error : 1
                                    });
                                    return;
                                } else { // Menampilkan pesan berhasil
                                    
                                    res.status(200).json({
                                        pesan : `Berhasil Join!`, sukses : 1
                                    });
                                    return;

                                }
                                
                            });

                        }
                    });
                
                };
                   
            });
            
        }else{ // Jika tidak ditemukan record invite
            res.status(200).json({
                pesan : `Kode Undangan tidak ditemukan!`, error : 1
            });
            return;
        }
    });
    
});

module.exports = router;