const router = require('express').Router();
// Module untuk koneksi database
const pooldb = require('../module-db');
// Module untuk Validasi input
const modval = require('../module-validator');

// Mengambil Kelas spesifik dan hanya bisa akses data penting jika sudah bergabung (jika public)
router.get('/:idkelas', [
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

    // Mengambil Kode Invite berdasarkan kelas
    sqlsyn += `
    SELECT ki.* FROM kelas_invite ki
    WHERE ki.id_class = ? ;
    `;
    sqlparams.push(idkelas);

    // Eksekusi Query
    pooldb.query( sqlsyn, sqlparams, (err, result) => { 
        if (err){ // Cek ada error atau tidak

            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;

        } else { // Jika error tidak ditemukan

            // Jika ada kode invite, maka digabung ke result kelas dengan syarat sebagai pemilik kelas
            if ((result[2][0]) && (result[0][0].id_owner == akun.id)){
                result[0][0].invite_code = result[2][0].invite_code;
            }

            // Record Query pertama ditemukan dan Cek jenis kelas
            if ((result[0][0]) && (result[0][0].visible == 'private')){ 
                // Cek ketersediaan peserta pada kelas
                if ((result[1][0])){

                    // Menampilkan kelas private yang sudah join
                    res.status(200).json({
                        pesan : `Kelas private ditemukan, anda ada dikelas, menampilkan informasi kelas`, sukses : 1,
                        hasil : result[0]
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
                    pesan : `Kelas publik ditemukan, menampilkan informasi kelas`, sukses : 1,
                    hasil : result[0]
                });
                return;

            }            

        };
    });
    
});

module.exports = router;