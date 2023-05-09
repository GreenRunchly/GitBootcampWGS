const router = require('express').Router();
const md5 = require('md5');
// Module untuk koneksi database
const pooldb = require('../module-db');
// Module untuk Validasi input
const modval = require('../module-validator');

// Mengambil daftar peserta dalam kelas yang ditentukan
router.get('/:idkelas/all-peserta', [
    modval.midval.param('idkelas').not().isEmpty().withMessage('ID Kelas tidak terdeteksi!').trim().escape()
], (req, res) => {

    // Cek Error pada validasi input
    if ( modval.midvalResult(req, res) ){ // Jika ditemukan masalah akan return true
        return; // Untuk menghentikan eksekusi lanjutan
    }

    let {akun} = req.bridge; // Mengambil data akun
    let idkelas = req.params.idkelas; // Mengambil id kelas sesuai request
    
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

    // Cek daftar nama siswa yang join di kelas tersebut
    sqlsyn += `
    SELECT peng.id, peng.name, p.updated FROM pengguna_class_joined p
    JOIN pengguna peng ON peng.id = p.id_owner
    JOIN kelas k ON k.id = p.id_class
    WHERE p.id_class= ? ORDER BY p.updated DESC;
    `;
    sqlparams.push(idkelas);

    // Eksekusi Query
    pooldb.query( sqlsyn, sqlparams, (err, result) => { 
        if (err){ // Cek ada error atau tidak

            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;

        } else {

            // Cek jenis kelas
            if ((result[0][0]) && (result[0][0].visible == 'private')){ 
                // Cek ketersediaan peserta pada kelas
                if ((result[1][0])){

                    // Menampilkan kelas private yang sudah join
                    res.status(200).json({
                        pesan : `Kelas private ditemukan, anda ada dikelas, menampilkan peserta`, sukses : 1,
                        hasil : result[2],
                        max_user : result[0][0].max_user,
                        current_user : result[2].length
                    });
                    return;
                    
                }else{

                    // Menampilkan pesan ditolak
                    res.status(200).json({
                        pesan : `Kamu tidak berada didalam kelas tersebut!`, error : 1
                    });
                    return;

                }
            } else if ((result[0][0]) && (result[0][0].visible == 'public')){ 

                // Menampilkan kelas public yang sudah join
                res.status(200).json({
                    pesan : `Kelas publik ditemukan, anda ada dikelas, menampilkan peserta`, sukses : 1,
                    hasil : result[2],
                    max_user : result[0][0].max_user,
                    current_user : result[2].length
                });
                return;

            }else{

                // Menampilkan kelas yang sudah join
                res.status(200).json({
                    pesan : `Kelas yang dimaksud tidak ditemukan!`, error : 1
                });
                return;

            }

        };
    });
    
});

module.exports = router;