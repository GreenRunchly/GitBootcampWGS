const router = require('express').Router();
const md5 = require('md5');
const alat = require('../module-tools');
// const crypto = require("crypto");
const pooldb = require('../module-db');
const mammoth = require('mammoth');

// Module untuk Validasi input
const validator = require('validator');
const midval = require('express-validator');
function midvalResult(req, res, next) {
    // Validasi Input
    const errorValidasiInput = midval.validationResult(req);
    if (!errorValidasiInput.isEmpty()) { // Jika tidak ada error
        res.status(200).json({
            pesan : errorValidasiInput.errors[0].msg, error : 1
        });
        return true;
    }else{
        return false;
    }
}

// Mengambil semua kelas pengguna
router.get('/saya', (req, res) => {

    let {akun} = req.bridge; // Mengambil data akun

    // Cek kelas yang diikuti oleh pengguna
    let sqlsyn = `
    SELECT k.*,peng.name as owner_name FROM pengguna_class_joined p 
    JOIN kelas k ON k.id=p.id_class 
    JOIN pengguna peng ON peng.id=k.id_owner 
    WHERE p.id_owner= ? ORDER BY p.created ASC
    `;
    pooldb.query(sqlsyn, [akun.id], (err, result) => {

        if (err){ // Cek error atau tidak
            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;
        } else if (result[0]){ // Jika Berhasil ditemukan record pertama
            // Menampilkan kelas yang join
            res.status(200).json({
                pesan : `Berhasil!`, sukses : 1,
                hasil : result
            });
            return;
        }

    });
    
});

// Mengambil Kelas spesifik dan hanya bisa akses data penting jika sudah bergabung (jika public)
router.get('/:idkelas', [
    midval.param('idkelas').not().isEmpty().withMessage('ID Kelas tidak terdeteksi!').trim().escape()
], (req, res) => {

    // Cek Error pada validasi input
    if ( midvalResult(req, res) ){ // Jika ditemukan masalah akan return true
        return; // Untuk menghentikan eksekusi lanjutan
    }

    let {akun} = req.bridge; // Mengambil data akun
    let idkelas = req.params.idkelas; // Mengambil id kelas sesuai request

    // Cek kelas dengan status
    let sqlsyn = `
    SELECT k.*,peng.name as owner_name FROM pengguna_class_joined p 
    JOIN kelas k ON k.id=p.id_class 
    JOIN pengguna peng ON k.id_owner=peng.id 
    WHERE p.id_owner= ? AND p.id_class= ?
    `;
    pooldb.query( sqlsyn, [akun.id, idkelas], (err, result) => { 
        
        if (err){ // Cek ada error atau tidak
            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;
        }else if (result[0]){ // Jika ditemukan record pertama

            let idpemilik = result[0].id_owner; // Mengetahui id pemilik kelas tersebut

            if (idpemilik == akun.id){ // Jika pengguna adalah pemilik
                // Do something harusnya kyk hapus beberapa artibut, tapi nanti lah, blm kelar lainnya
            }

            // Return data kelas
            res.status(200).json({
                pesan : `Berhasil! Owner`, sukses : 1,
                hasil : result
            });
            return;

        }else{ // Jika tidak ditemukan
           
            // Menampilkan kelas yang join
            res.status(200).json({
                pesan : `Kelas yang dimaksud tidak ditemukan`, error : 1,
                hasil : result
            });
            return;

        }

    });
    
});

// Mengambil semua data postingan yang bisa dilihat oleh pengguna pada kelas yang dimaksud
router.get('/:idkelas/informasi/saya', [
    midval.param('idkelas').not().isEmpty().withMessage('ID Kelas tidak terdeteksi!').trim().escape()
], (req, res) => {

    // Cek Error pada validasi input
    if ( midvalResult(req, res) ){ // Jika ditemukan masalah akan return true
        return; // Untuk menghentikan eksekusi lanjutan
    }

    let {akun} = req.bridge; // Mengambil data akun
    let {idkelas, idinformasi} = req.params; // Mengambil data parameter

    // Cek semua data (listing) postingan pada kelas yang dimaksud
    let sqlsyn = `
    SELECT i.id, i.id_owner, i.id_class, i.title, i.created, i.updated FROM pengguna_class_joined p 
    JOIN kelas k ON k.id=p.id_class 
    JOIN informasi i ON k.id=i.id_class 
    WHERE p.id_owner= ? AND p.id_class= ?
    `;
    pooldb.query(sqlsyn, [akun.id, idkelas], (err, result) => { 
        
        if (err){ // Cek ada error atau tidak
            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;
        } else if (result[0]) {
            // Encode konten jadi html entiies
            result[0].title = validator.unescape(result[0].title);

            // Menampilkan kelas yang join
            res.status(200).json({
                pesan : `Postingan kelas berhasil diambil!`, sukses : 1,
                hasil : result
            });
            return;
        } else {
            // Menampilkan data kosong
            res.status(200).json({
                pesan : `Belum ada postingan samsek!`, error : 1
            });
            return;
        }
    });
    
});

// Mengambil Postingan berdasar id [postingan] pada kelas yang ditentukan
router.get('/:idkelas/informasi/:idinformasi', [
    midval.param('idkelas').not().isEmpty().withMessage('ID Kelas tidak terdeteksi!').trim().escape(),
    midval.param('idinformasi').not().isEmpty().withMessage('ID Postingan tidak terdeteksi!').trim().escape(),
], (req, res) => {

    // Cek Error pada validasi input
    if ( midvalResult(req, res) ){ // Jika ditemukan masalah akan return true
        return; // Untuk menghentikan eksekusi lanjutan
    }

    let {akun} = req.bridge; // Mengambil data akun
    let {idkelas, idinformasi} = req.params;

    // Mengecek apakah pengguna ada di kelas atau tidak dan mengambil postingan
    let sqlsyn = `
    SELECT i.* FROM pengguna_class_joined p 
    JOIN kelas k ON k.id=p.id_class 
    JOIN informasi i ON k.id=i.id_class 
    WHERE p.id_owner= ? AND p.id_class= ? AND i.id= ?
    `;
    pooldb.query( sqlsyn, [akun.id, idkelas, idinformasi], (err, result) => { 
        
        if (err){ // Jika Error Syntax atau semacamnya
            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;
        } else if (result[0]){ // Jika Berhasil ditemukan record pertama

            // Encode konten jadi base64 dan ubah title entities
            result[0].title = validator.unescape(result[0].title);
            result[0].content = Buffer.from( result[0].content, 'utf8').toString('base64');
            // Menampilkan kelas yang join
            res.status(200).json({
                pesan : `Berhasil!`, sukses : 1,
                hasil : result
            });
            return;

        }else{
            // Menampilkan data kosong
            res.status(200).json({
                pesan : `Postingan yang dimaksud tidak ada!`, error : 1
            });
            return;
        }
    });
    
});

// Edit kelas
router.post('/:idkelas/edit',[
    midval.param('idkelas').not().isEmpty().withMessage('ID Kelas tidak terdeteksi!').trim().escape(),
    midval.body('name').isLength({ min: 5, max: 30 }).withMessage('Karakter Nama harus minimal 5 dan maksimal 30!').trim().escape(),
    midval.body('subject').isLength({ min: 1 }).withMessage('Subject tidak boleh kosong!').trim().escape(),
    midval.body('room').isLength({ min: 1 }).withMessage('Ruangan tidak boleh kosong!').trim().escape(),
], (req, res) => {

    // Cek Error pada validasi input
    if ( midvalResult(req, res) ){ // Jika ditemukan masalah akan return true
        return; // Untuk menghentikan eksekusi lanjutan
    }

    let {akun} = req.bridge; // Mengambil data akun
    let {name, desc, subject, room} = req.body; // Mengambil data kelas
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
            UPDATE kelas SET class_name= ? ,class_desc= ? ,subject= ? ,room= ? 
            WHERE id= ?
            `;
            pooldb.query( sqlsyn, [name, desc, subject, room, idkelas], (err, result) => { 
                
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

});

// Quit dari kelas
router.post('/:idkelas/quit', [
    midval.param('idkelas').not().isEmpty().withMessage('ID Kelas tidak terdeteksi!').trim().escape()
], (req, res) => {

    // Cek Error pada validasi input
    if ( midvalResult(req, res) ){ // Jika ditemukan masalah akan return true
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

// Invite link kelas sebagai owner
router.post('/:idkelas/invite', [
    midval.param('idkelas').not().isEmpty().withMessage('ID Kelas tidak terdeteksi!').trim().escape()
], (req, res) => {

    // Cek Error pada validasi input
    if ( midvalResult(req, res) ){ // Jika ditemukan masalah akan return true
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

// Membuat kelas
router.post('/create',[
    midval.body('name').isLength({ min: 5, max: 30 }).withMessage('Karakter Nama harus minimal 5 dan maksimal 30!').trim().escape(),
    midval.body('desc').isLength({ min: 0, max: 150 }).withMessage('Karakter Deskripsi harus minimal 5 dan maksimal 100!').trim().escape(),
    midval.body('subject').not().isEmpty().withMessage('Subject tidak boleh kosong!').trim().escape(),
    midval.body('room').not().isEmpty().withMessage('Ruangan tidak boleh kosong!').trim().escape(),
], (req, res) => {
    
    // Cek Error pada validasi input
    if ( midvalResult(req, res) ){ // Jika ditemukan masalah akan return true
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

// Bergabung ke kelas
router.post('/join', [
    midval.body('invitecode').isLength({ min: 12, max: 12 }).withMessage('Masukan 12 digit kode undangan!').trim().escape().isNumeric().withMessage('Kode tidak valid!')
], (req, res) => {

    // Cek Error pada validasi input
    if ( midvalResult(req, res) ){ // Jika ditemukan masalah akan return true
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
                        pesan : `Karena anda sudah berada dikelas tersebut!`, error : 1
                    });
                    return;

                }else{ // Menambahkan akun ke kelas (join kelas)
                    
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

// Menambahkan informasi pada kelas yang sudah ditentukan
router.post('/:idkelas/informasi/do', [
    midval.param('idkelas').not().isEmpty().withMessage('ID Kelas tidak terdeteksi!').trim().escape(),
    midval.body('title').isLength({min : 4, max: 60}).withMessage('Judul tidak boleh kosong! Minimal 4 karakter dan maksimal 60 karakter!').trim().escape()
], (req, res) => {

    // Cek Error pada validasi input
    if ( midvalResult(req, res) ){ // Jika ditemukan masalah akan return true
        return; // Untuk menghentikan eksekusi lanjutan
    }

    let {akun} = req.bridge; // Mengambil data akun
    let {idkelas} = req.params; // Mengambil data parameter
    let {title, idinformasi} = req.body; // Mengambil data upload
    
    // Cek Ada di kelas tersebut atau tidak dan informasi tersebut ada atau tidak
    let sqlsyn = `
    SELECT k.* FROM pengguna_class_joined p 
    JOIN kelas k ON k.id=p.id_class 
    WHERE p.id_owner= ? AND p.id_class= ?
    `;
    pooldb.query(sqlsyn, [akun.id, idkelas], (err, result) => { 
        
        if (err){ // Cek ada error atau tidak
            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;
        } else if (result[0]) { // Jika Berhasil ditemukan record pertama
            
            // Cek kepemilikan kelas
            let idpemilik = result[0].id_owner;
            if (idpemilik != akun.id){
                // Menolak akses menambah
                res.status(200).json({
                    pesan : `Akses ditolak`, error : 1
                });
                return;
            }

            if (idinformasi){ // Jika idinformasi ada, maka akan melakukan UPDATE

                // Mencari record informasi ada atau tidak
                let sqlsyn = `
                SELECT * FROM informasi 
                WHERE id_owner= ? AND id_class= ? AND id= ? 
                `;
                pooldb.query( sqlsyn, [akun.id, idkelas, idinformasi], (err, result) => { 
                    
                    if (err){ // Cek ada error atau tidak 
                        res.status(200).json({
                            pesan : `Kesalahan Internal (${err})`, error : 1
                        });
                        return;
                    } else if (result[0]){ // Jika menemukan record pertama

                        let idrecord = result[0].id; // Mengambil id record informasi yang ditemukan

                        if (req.files){

                            // Mengambil object file content
                            let filekonten = req.files.content; 
        
                            // Cek Tipe file, jika MS Word, maka lanjut!
                            if (filekonten.mimetype == `application/vnd.openxmlformats-officedocument.wordprocessingml.document`){
                                // Konversikan MS Word ke HTML dengan mammoth
                                mammoth.convertToHtml({buffer:filekonten.data}).then(function(result){
                                    
                                    let input_content = result.value; // HTML Output

                                    // Melakukan Update Postingan
                                    let sqlsyn = `
                                    UPDATE informasi SET title= ? ,content= ? WHERE id= ? 
                                    `;
                                    let sqlsyninput = [validator.escape(title), input_content, idrecord];
                                    

                                    pooldb.query( sqlsyn, sqlsyninput, (err, result) => { 
                                        
                                        if (err){ // Cek ada error atau tidak
                                            res.status(200).json({
                                                pesan : `Kesalahan Internal (${err})`, error : 1
                                            });
                                            return;
                                        } else {

                                            // Membuat hash file konten agar bisa dikenali / daur ulang file
                                            let idinformasihash = md5(parseInt(idrecord)+'postingan');

                                            // Menyalin data agar bisa dipakai lagi (dipindah)
                                            filekonten.mv('./uploads/postingan/' + (idinformasihash) + '.docx');
                                        
                                            // Menampilkan kelas yang join
                                            res.status(200).json({
                                                pesan : `Berhasil di update!`, sukses : 1
                                            });
                                            return;

                                        }

                                    });

                                })
                            } else { // File tidak didukung karena hanya bisa menggunakan MS Word
                                res.status(200).json({
                                    pesan : `File tidak didukung, harus MS Word!`, error : 1
                                });
                                return;
                            }
                        
                        }else{

                            // Melakukan Update Postingan
                            let sqlsyn = `
                            UPDATE informasi SET title= ? WHERE id= ? 
                            `;
                            let sqlsyninput = [validator.escape(title), idrecord];

                            pooldb.query( sqlsyn, sqlsyninput, (err, result) => { 
                                
                                if (err){ // Cek ada error atau tidak
                                    res.status(200).json({
                                        pesan : `Kesalahan Internal (${err})`, error : 1
                                    });
                                    return;
                                } else {
                                
                                    // Menampilkan kelas yang join
                                    res.status(200).json({
                                        pesan : `Berhasil di update!`, sukses : 1
                                    });
                                    return;

                                }

                            });

                        }

                    } else {
                        // Menampilkan data kosong
                        res.status(200).json({
                            pesan : `Postingan yang dimaksud tidak ditemukan`, error : 1
                        });
                        return;
                    }
                    
                });

            } else { // Jika idinformasi tidak ada INSERT

                if (req.files){

                    // Mengambil object file content
                    let filekonten = req.files.content; 

                    // Cek Tipe file, jika MS Word, maka lanjut!
                    if (filekonten.mimetype == `application/vnd.openxmlformats-officedocument.wordprocessingml.document`){
                        // Konversikan MS Word ke HTML dengan mammoth
                        mammoth.convertToHtml({buffer:filekonten.data}).then(function(result){
                            
                            let input_content = result.value; // HTML Output

                            // Menambahkan Postingan 
                            let sqlsyn = `
                            INSERT INTO informasi (id_owner, id_class, title, content) 
                            VALUES ( ?, ?, ?, ? )
                            `;
                            pooldb.query( sqlsyn, [akun.id, idkelas, validator.escape(title), input_content], (err, result) => { 
                            
                                if (err){ // Cek ada error atau tidak
                                    res.status(200).json({
                                        pesan : `Kesalahan Internal (${err})`, error : 1
                                    });
                                    return;
                                } else {

                                    // Membuat hash file konten agar bisa dikenali / daur ulang file
                                    let idinformasihash = md5(parseInt(result.insertId)+'postingan');

                                    // Menyalin data agar bisa dipakai lagi (dipindah)
                                    filekonten.mv('./uploads/postingan/' + (idinformasihash) + '.docx');

                                    // Menampilkan Pesan berhasil
                                    res.status(200).json({
                                        pesan : `Berhasil nambahkan postingan!`, sukses : 1
                                    });
                                    return;
                                    
                                }
                                
                            });
                            
                        })
                    } else { // File tidak didukung karena hanya bisa menggunakan MS Word
                        res.status(200).json({
                            pesan : `File tidak didukung, harus MS Word!`, error : 1
                        });
                        return;
                    }

                }else{

                    // Konten tidak terdeteksi
                    res.status(200).json({
                        pesan : `Konten tidak terdeteksi (Pastikan sudah memilih file)`, error : 1
                    });
                    return;

                }

            }

        } else {
            // Menampilkan bahwa kelas tidak ditemukan dan ditak bisa mengpublish/ update postingan
            res.status(200).json({
                pesan : `Kelas tidak ditemukan`, error : 1
            });
            return;
        }
        
    });
    
});

module.exports = router;