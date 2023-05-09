const router = require('express').Router();
const md5 = require('md5');
const alat = require('../module-tools');
// Module untuk koneksi database
const pooldb = require('../module-db');
// Module untuk Validasi input
const modval = require('../module-validator');

// Invite link kelas sebagai owner
router.post('/:idkelas/invite', [
    modval.midval.param('idkelas').not().isEmpty().withMessage('ID Kelas tidak terdeteksi!').trim().escape()
], (req, res) => {

    // Cek Error pada validasi input
    if ( modval.midvalResult(req, res) ){ // Jika ditemukan masalah akan return true
        return; // Untuk menghentikan eksekusi lanjutan
    }

    let {akun} = req.bridge; // Mengambil data akun
    let {idkelas} = req.params;
    let kodeinvite = alat.numberGen(12);

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
            // Cek Invite Link ada atau tidak
            let sqlsyn = `
            SELECT * FROM kelas_invite 
            WHERE id_owner= ? AND id_class= ?
            `;
            pooldb.query( sqlsyn, [akun.id, idkelas], (err, result) => { 
                if (err){
                    res.status(200).json({
                        pesan : `Kesalahan Internal (${err})`, error : 1
                    });
                    return;
                } else if (result[0]){ // Jika ditemukan record pertama

                    let recordid = result[0].id; // Mengambil record id kelas
                    // Update Invite Link
                    let sqlsyn = `
                    UPDATE kelas_invite SET invite_code= ? 
                    WHERE id= ? `;
                    pooldb.query( sqlsyn, [kodeinvite, recordid], (err, result) => { 
                        
                        if (err){ // Jika Error Syntax atau semacamnya
                            res.status(200).json({
                                pesan : `Kesalahan Internal (${err})`, error : 1
                            });
                            return;
                        } else { // Menampilkan kode invite
                        
                            res.status(200).json({
                                pesan : `Invite link berhasil diubah!`, sukses : 1,
                                hasil : kodeinvite
                            });
                            return;
                        
                        }
                    });

                }else{ // Menambahkan Invite link ke record
                    
                    let sqlsyn = `
                    INSERT INTO kelas_invite (id_owner, id_class, invite_code) 
                    VALUES ( ?, ?, ? )
                    `;
                    pooldb.query( sqlsyn, [akun.id, idkelas, kodeinvite], (err, result) => { 
                        
                        if (err){ // Jika Error Syntax atau semacamnya
                            res.status(200).json({
                                pesan : `Kesalahan Internal (${err})`, error : 1
                            });
                            return;
                        } else { // Menampilkan kode undangan
                            
                            res.status(200).json({
                                pesan : `Invite link berhasil dibuat!`, sukses : 1,
                                hasil : kodeinvite
                            });
                            return;

                        }
                        
                    });
                }
            });

        }else{
            // Menampilkan pesan error
            res.status(200).json({
                pesan : `Anda tidak berada dikelas yang dimaksud!`, error : 1
            });
            return;
        }
    });

});

module.exports = router;