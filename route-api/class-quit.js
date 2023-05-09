const router = require('express').Router();
const md5 = require('md5');
// Module untuk koneksi database
const pooldb = require('../module-db');
// Module untuk Validasi input
const modval = require('../module-validator');

// Quit dari kelas
router.post('/:idkelas/quit', [
    modval.midval.param('idkelas').not().isEmpty().withMessage('ID Kelas tidak terdeteksi!').trim().escape()
], (req, res) => {

    // Cek Error pada validasi input
    if ( modval.midvalResult(req, res) ){ // Jika ditemukan masalah akan return true
        return; // Untuk menghentikan eksekusi lanjutan
    }

    let {akun} = req.bridge; // Mengambil data akun
    let {idkelas} = req.params; // Parameter kelas

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
        } else if (result[0]){ // Jika berhasil ditemukan record pertama
            
            let idpemilik = result[0].id_owner;
            
            if (idpemilik == akun.id){ // Jika anda pengguna seorang pemilik kelas, maka akan mengeluarkan seluruh siswa dari kelas

                // Menghapus seluruh record beridkelas kelas
                let sqlsyn = `
                DELETE FROM pengguna_class_joined 
                WHERE id_class= ? 
                `;
                pooldb.query( sqlsyn, [idkelas], (err, result) => { 
                    
                    if (err){ // Jika Error Syntax atau semacamnya
                        res.status(200).json({
                            pesan : `Kesalahan Internal (${err})`, error : 1
                        });
                        return;
                    } else { // Menampilkan kelas yang join
                        
                        res.status(200).json({
                            pesan : `Kelas Dihapus!`, sukses : 1
                        });
                        return;

                    }

                });

            }else{ // Jika bukan pemilik kelas (creator), maka akan hanya mengeluarkan diri sendiri
                
                // Menghapus Individu
                let sqlsyn = `
                DELETE FROM pengguna_class_joined 
                WHERE id_owner= ? AND id_class= ? 
                `;
                pooldb.query( sqlsyn, [akun.id, idkelas], (err, result) => { 
                    
                    if (err){ // Jika Error Syntax atau semacamnya
                        res.status(200).json({
                            pesan : `Kesalahan Internal (${err})`, error : 1
                        });
                        return;
                    } else { // Menampilkan kelas yang join
                        
                        res.status(200).json({
                            pesan : `Berhasil keluar dari kelas!`, sukses : 1
                        });
                        return;

                    }
                });
                
            }

        }else{
            // Menampilkan error
            res.status(200).json({
                pesan : `Anda tidak berada dikelas yang dimaksud!`, error : 1
            });
            return;
        }
    });

});

module.exports = router;