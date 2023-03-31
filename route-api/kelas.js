const router = require('express').Router();
const md5 = require('md5');
const crypto = require("crypto");
const pooldb = require('../module-db');
const mammoth = require('mammoth');
const { body, validationResult } = require('express-validator');

// Mengambil semua kelas yang sudah bergabung
router.get('/saya', (req, res) => {

    let {akun} = req.bridge; // Mengambil data akun

    // Cek User Username dan Password
    let sqlsyn = `SELECT k.*,peng.name as owner_name FROM pengguna_class_joined p JOIN kelas k ON k.id=p.id_class JOIN pengguna peng ON peng.id=k.id_owner WHERE p.id_owner='${akun.id}' ORDER BY p.created ASC`;
    pooldb.query( sqlsyn, (err, result) => { 
        // Jika Error Syntax atau semacamnya
        if (err){ 
            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;
        }
        // Jika Berhasil ditemukan record pertama
        if (result){
            // Menampilkan kelas yang join
            res.status(200).json({
                pesan : `Berhasil!`, sukses : 1,
                hasil : result
            });
            return;
        }
    });
    
});

// Mengambil Kelas spesifik yang sudah bergabung
router.get('/:idkelas', (req, res) => {

    let {akun} = req.bridge; // Mengambil data akun
    let idkelas = req.params.idkelas;

    // Cek User Joined Class
    let sqlsyn = `SELECT k.*,peng.name as owner_name FROM pengguna_class_joined p JOIN kelas k ON k.id=p.id_class JOIN pengguna peng ON k.id_owner=peng.id WHERE p.id_owner='${akun.id}' AND p.id_class='${idkelas}'`;
    pooldb.query( sqlsyn, (err, result) => { 
        // Jika Error Syntax atau semacamnya
        if (err){ 
            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;
        }
        // Jika Berhasil ditemukan record pertama
        if (result[0]){
            let idpemilik = result[0].id_owner;
            if (idpemilik == akun.id){
                // Cek Invite Code
                let sqlsyn = `SELECT k.* FROM pengguna_class_joined p JOIN kelas k ON k.id=p.id_class WHERE p.id_owner='${akun.id}' AND p.id_class='${idkelas}'`;
                pooldb.query( sqlsyn, (err, result) => { 
                    // Jika Error Syntax atau semacamnya
                    if (err){ 
                        res.status(200).json({
                            pesan : `Kesalahan Internal (${err})`, error : 1
                        });
                        return;
                    }
                    // Menampilkan kelas yang join
                    res.status(200).json({
                        pesan : `Berhasil! Owner`, sukses : 1,
                        hasil : result
                    });
                    return;
                });
            }else{
                // Menampilkan kelas yang join
                res.status(200).json({
                    pesan : `Berhasil!`, sukses : 1,
                    hasil : result
                });
                return;
            }
        }else{    
            // Menampilkan kelas yang join
            res.status(200).json({
                pesan : `Berhasil!`, sukses : 1,
                hasil : result
            });
            return;
        }
    });
    
});

// Mengambil daftar informasi pada kelas yang sudah ditentukan OBSOLETE
router.get('/:idkelas/informasi/saya', (req, res) => {

    let {akun} = req.bridge; // Mengambil data akun
    let {idkelas, idinformasi} = req.params;

    // Cek Ada di kelas tersebut atau tidak dan informasi tersebut ada atau tidak
    let sqlsyn = `SELECT i.id, i.id_owner, i.id_class, i.title, i.created, i.updated FROM pengguna_class_joined p JOIN kelas k ON k.id=p.id_class JOIN informasi i ON k.id=i.id_class WHERE p.id_owner='${akun.id}' AND p.id_class='${idkelas}'`;
    pooldb.query( sqlsyn, (err, result) => { 
        // Jika Error Syntax atau semacamnya
        if (err){ 
            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;
        }
        // Jika Berhasil ditemukan record pertama
        if (result[0]){
            // Menampilkan kelas yang join
            res.status(200).json({
                pesan : `Berhasil!`, sukses : 1,
                hasil : result
            });
            return;
        }else{
            // Menampilkan data kosong
            res.status(200).json({
                pesan : `Kosong!`, error : 1
            });
            return;
        }
    });
    
});

// Menambahkan informasi pada kelas yang sudah ditentukan
router.post('/:idkelas/informasi/do', (req, res) => {

    let {akun} = req.bridge; // Mengambil data akun
    let {idkelas} = req.params;
    let {title, id_informasi} = req.body; // Mengambil data upload

    // Filter Title
    if (!title){
        res.status(200).json({
            pesan : `Judul Kosong!`, error : 1
        });
        return;
    }
    
    // Cek Ada di kelas tersebut atau tidak dan informasi tersebut ada atau tidak
    let sqlsyn = `SELECT k.* FROM pengguna_class_joined p JOIN kelas k ON k.id=p.id_class WHERE p.id_owner='${akun.id}' AND p.id_class='${idkelas}'`;
    pooldb.query( sqlsyn, (err, result) => { 
        // Jika Error Syntax atau semacamnya
        if (err){ 
            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;
        }
        // Jika Berhasil ditemukan record pertama
        if (result[0]){
            let idpemilik = result[0].id_owner;
            if (idpemilik != akun.id){
                // Menolak akses menambah
                res.status(200).json({
                    pesan : `Akses ditolak`, error : 1
                });
                return;
            }
            // Mencoba mengolah file
            try {
                if(!req.files) {
                    // Menolak akses menambah
                    res.status(200).json({
                        pesan : `File Informasi belum diupload!`, error : 1
                    });
                    return;
                }else{
                    // Mengambil file informasi
                    let filekonten = req.files.content; 
                    // Cek Tipe file, jika MS Word, maka lanjut!
                    if (filekonten.mimetype == `application/vnd.openxmlformats-officedocument.wordprocessingml.document`){
                        mammoth.convertToHtml({buffer:filekonten.data}).then(function(result){
                            let input_content = result.value; // The generated HTML
                            
                            if (!id_informasi){
                                // Menambahkan Informasi ke kelas
                                let sqlsyn = `INSERT INTO informasi (id_owner, id_class, title, content) VALUES ('${akun.id}', '${idkelas}', '${title}', '${input_content}')`;
                                pooldb.query( sqlsyn, (err, result) => { 
                                    // Jika Error Syntax atau semacamnya
                                    if (err){ 
                                        res.status(200).json({
                                            pesan : `Kesalahan Internal (${err})`, error : 1
                                        });
                                        return;
                                    }
                                    let id_informasihash = md5(parseInt(result.insertId)+'postingan');
                                    // Menyalin data agar bisa dipakai lagi (dipindah)
                                    filekonten.mv('./uploads/postingan/' + (id_informasihash) + '.docx');
                                    // Menampilkan kelas yang join
                                    res.status(200).json({
                                        pesan : `Berhasil nambahkan informasi!`, sukses : 1
                                    });
                                    return;
                                });
                            }else{
                                // Mencari informasi ada atau tidak
                                let sqlsyn = `SELECT * FROM informasi WHERE id_owner='${akun.id}' AND id_class='${idkelas}' AND id='${id_informasi}'`;
                                pooldb.query( sqlsyn, (err, result) => { 
                                    // Jika Error Syntax atau semacamnya
                                    if (err){ 
                                        res.status(200).json({
                                            pesan : `Kesalahan Internal (${err})`, error : 1
                                        });
                                        return;
                                    }
                                    if (result){
                                        let idrecord = result[0].id;
                                        // Update Invite Link
                                        let sqlsyn = `UPDATE informasi SET title='${title}',content='${input_content}' WHERE id='${idrecord}'`;
                                        pooldb.query( sqlsyn, (err, result) => { 
                                            // Jika Error Syntax atau semacamnya
                                            if (err){ 
                                                res.status(200).json({
                                                    pesan : `Kesalahan Internal (${err})`, error : 1
                                                });
                                                return;
                                            }

                                            let id_informasihash = md5(parseInt(id_informasi)+'postingan');
                                            //console.log(id_informasihash);
                                            // Menyalin data agar bisa dipakai lagi (dipindah)
                                            filekonten.mv('./uploads/postingan/' + (id_informasihash) + '.docx');

                                            // Menampilkan kelas yang join
                                            res.status(200).json({
                                                pesan : `Berhasil di update!`, sukses : 1
                                            });
                                            return;
                                        });
                                    }else{
                                        // Menampilkan data kosong
                                        res.status(200).json({
                                            pesan : `Informasi yang dimaksud tidak ditemukan`, error : 1
                                        });
                                        return;
                                    }
                                });
                            }

                        }).catch(function(error) {
                            res.status(200).json({
                                pesan : `Kesalahan Internal (${error})`, error : 1
                            });
                            return;
                        });
                    }else{
                        res.status(200).json({
                            pesan : `File tidak didukung, harus MS Word!`, error : 1
                        });
                        return;
                    }
                }
            } catch (err){
                res.status(200).json({
                    pesan : `Kesalahan Internal (${err})`, error : 1
                });
                return;
            }
        }else{
            // Menampilkan data kosong
            res.status(200).json({
                pesan : `Kelas tidak ditemukan`, error : 1
            });
            return;
        }
    });
    
});

// Mengambil informasi spesifik pada kelas yang ditentukan OBSOLETE
router.get('/:idkelas/informasi/:idinformasi', (req, res) => {

    let {akun} = req.bridge; // Mengambil data akun
    let {idkelas, idinformasi} = req.params;

    // Cek Ada di kelas tersebut atau tidak dan informasi tersebut ada atau tidak
    let sqlsyn = `SELECT i.* FROM pengguna_class_joined p JOIN kelas k ON k.id=p.id_class JOIN informasi i ON k.id=i.id_class WHERE p.id_owner='${akun.id}' AND p.id_class='${idkelas}' AND i.id='${idinformasi}'`;
    pooldb.query( sqlsyn, (err, result) => { 
        // Jika Error Syntax atau semacamnya
        if (err){ 
            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;
        }
        // Jika Berhasil ditemukan record pertama
        if (result[0]){
            // Encode konten jadi base64
            result[0].content = Buffer.from(result[0].content).toString('base64');
            // Menampilkan kelas yang join
            res.status(200).json({
                pesan : `Berhasil!`, sukses : 1,
                hasil : result
            });
            return;
        }else{
            // Menampilkan data kosong
            res.status(200).json({
                pesan : `Informasi yang dimaksud tidak ada!`, error : 1
            });
            return;
        }
    });
    
});

// Edit kelas
router.post('/:idkelas/edit',[
    body('name').isLength({ min: 5, max: 30 }).withMessage('Karakter Nama harus minimal 5 dan maksimal 30!').trim().escape(),
    body('subject').isLength({ min: 1 }).withMessage('Subject tidak boleh kosong!').trim().escape(),
    body('room').isLength({ min: 1 }).withMessage('Ruangan tidak boleh kosong!').trim().escape(),
],(req, res) => {

    let {akun} = req.bridge; // Mengambil data akun
    let {name, desc, subject, room} = req.body; // Mengambil data kelas
    let {idkelas} = req.params; // Parameter kelas

    if (!idkelas) {
        res.status(200).json({
            pesan : `id kelas kosong!`, error : 1
        });
        return;
    }

    // Cek Ada di kelas tersebut atau tidak
    let sqlsyn = `SELECT k.* FROM pengguna_class_joined p JOIN kelas k ON k.id=p.id_class WHERE p.id_owner='${akun.id}' AND p.id_class='${idkelas}'`;
    pooldb.query( sqlsyn, (err, result) => { 
        // Jika Error Syntax atau semacamnya
        if (err){ 
            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;
        }
        // Jika Berhasil ditemukan record pertama
        if (result[0]){
            let idpemilik = result[0].id_owner;
            if (idpemilik != akun.id){
                // Menolak akses berbagi
                res.status(200).json({
                    pesan : `Akses ditolak`, error : 1
                });
                return;
            }
            // Remove record from db
            let sqlsyn = `UPDATE kelas SET class_name='${name}',class_desc='${desc}',subject='${subject}',room='${room}' WHERE id='${idkelas}'`;
            pooldb.query( sqlsyn, (err, result) => { 
                // Jika Error Syntax atau semacamnya
                if (err){ 
                    res.status(200).json({
                        pesan : `Kesalahan Internal (${err})`, error : 1
                    });
                    return;
                }
                // Menampilkan kelas yang join
                res.status(200).json({
                    pesan : `Berhasil mengedit kelas`, sukses : 1
                });
                return;
            });
        }else{
            // Menampilkan data kosong
            res.status(200).json({
                pesan : `Kelas tidak ditemukan`, error : 1
            });
            return;
        }
    });

});

// Quit dari kelas
router.post('/:idkelas/quit', (req, res) => {

    let {akun} = req.bridge; // Mengambil data akun
    let {idkelas} = req.params; // Parameter kelas

    // Cek Ada di kelas tersebut atau tidak
    let sqlsyn = `SELECT k.* FROM pengguna_class_joined p JOIN kelas k ON k.id=p.id_class WHERE p.id_owner='${akun.id}' AND p.id_class='${idkelas}'`;
    pooldb.query( sqlsyn, (err, result) => { 
        // Jika Error Syntax atau semacamnya
        if (err){ 
            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;
        }
        // Jika Berhasil ditemukan record pertama
        if (result[0]){
            let idpemilik = result[0].id_owner;
            if (idpemilik != akun.id){
                // Menghapus Individu
                let sqlsyn = `DELETE FROM pengguna_class_joined WHERE id_owner='${akun.id}' AND id_class='${idkelas}'`;
                pooldb.query( sqlsyn, (err, result) => { 
                    // Jika Error Syntax atau semacamnya
                    if (err){ 
                        res.status(200).json({
                            pesan : `Kesalahan Internal (${err})`, error : 1
                        });
                        return;
                    }
                    if (result){
                        // Menampilkan kelas yang join
                        res.status(200).json({
                            pesan : `Berhasil keluar dari kelas!`, sukses : 1
                        });
                        return;
                    }
                });
            }else{
                // Remove record from db (Keseluruhan)
                let sqlsyn = `DELETE FROM pengguna_class_joined WHERE id_class='${idkelas}'`;
                pooldb.query( sqlsyn, (err, result) => { 
                    // Jika Error Syntax atau semacamnya
                    if (err){ 
                        res.status(200).json({
                            pesan : `Kesalahan Internal (${err})`, error : 1
                        });
                        return;
                    }
                    // Menampilkan kelas yang join
                    res.status(200).json({
                        pesan : `Kelas Dihapus!`, sukses : 1
                    });
                    return;
                });
            }
        }else{
            // Menampilkan data kosong
            res.status(200).json({
                pesan : `Kelas tidak ditemukan`, error : 1
            });
            return;
        }
    });

});

// Invite link kelas sebagai owner
router.post('/:idkelas/invite', (req, res) => {

    let {akun} = req.bridge; // Mengambil data akun
    let {idkelas} = req.params;
    let kodeinvite = Math.floor(100000000000 + Math.random() * 900000000000);

    // Cek Ada di kelas tersebut atau tidak
    let sqlsyn = `SELECT k.* FROM pengguna_class_joined p JOIN kelas k ON k.id=p.id_class WHERE p.id_owner='${akun.id}' AND p.id_class='${idkelas}'`;
    pooldb.query( sqlsyn, (err, result) => { 
        // Jika Error Syntax atau semacamnya
        if (err){ 
            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;
        }
        // Jika Berhasil ditemukan record pertama
        if (result[0]){
            let idpemilik = result[0].id_owner;
            if (idpemilik != akun.id){
                // Menolak akses berbagi
                res.status(200).json({
                    pesan : `Akses ditolak`, error : 1
                });
                return;
            }
            // Cek Invite Link ada atau tidak
            let sqlsyn = `SELECT * FROM kelas_invite WHERE id_owner='${akun.id}' AND id_class='${idkelas}'`;
            pooldb.query( sqlsyn, (err, result) => { 
                if (err){
                    res.status(200).json({
                        pesan : `Kesalahan Internal (${err})`, error : 1
                    });
                    return;
                }
                if (result[0]){
                    let recordid = result[0].id;
                    // Update Invite Link
                    let sqlsyn = `UPDATE kelas_invite SET invite_code='${kodeinvite}' WHERE id='${recordid}'`;
                    pooldb.query( sqlsyn, (err, result) => { 
                        // Jika Error Syntax atau semacamnya
                        if (err){ 
                            res.status(200).json({
                                pesan : `Kesalahan Internal (${err})`, error : 1
                            });
                            return;
                        }
                        // Menampilkan kelas yang join
                        res.status(200).json({
                            pesan : `Invite link berhasil diubah!`, sukses : 1,
                            hasil : kodeinvite
                        });
                        return;
                    });
                }else{
                    // Menambahkan Invite link ke record
                    let sqlsyn = `INSERT INTO kelas_invite (id_owner, id_class, invite_code) VALUES ('${akun.id}', '${idkelas}', '${kodeinvite}')`;
                    pooldb.query( sqlsyn, (err, result) => { 
                        // Jika Error Syntax atau semacamnya
                        if (err){ 
                            res.status(200).json({
                                pesan : `Kesalahan Internal (${err})`, error : 1
                            });
                            return;
                        }
                        // Menampilkan kelas yang join
                        res.status(200).json({
                            pesan : `Invite link berhasil dibuat!`, sukses : 1,
                            hasil : kodeinvite
                        });
                        return;
                    });
                }
            });
        }else{
            // Menampilkan data kosong
            res.status(200).json({
                pesan : `Kelas tidak ditemukan`, error : 1
            });
            return;
        }
    });

});

// Membuat kelas
router.post('/create',[
    body('name').isLength({ min: 5, max: 30 }).withMessage('Karakter Nama harus minimal 5 dan maksimal 30!').trim().escape(),
    body('subject').isLength({ min: 1 }).withMessage('Subject tidak boleh kosong!').trim().escape(),
    body('room').isLength({ min: 1 }).withMessage('Ruangan tidak boleh kosong!').trim().escape(),
], (req, res) => {
    //body('desc').isLength({ min: 5, max: 100 }).withMessage('Karakter Deskripsi harus minimal 5 dan maksimal 100!').trim().escape(),
    // Cek Error pada validasi input
    const err = validationResult(req);
    if (!err.isEmpty()) {
        res.status(200).json({
            pesan : err.errors[0].msg, error : 1
        });
        return;
    }

    let {akun} = req.bridge; // Mengambil data akun
    let {name, desc, subject, room} = req.body; // Mengambil kode kelas

    // Menambahkan Kelas
    let sqlsyn = `INSERT INTO kelas (id_owner, class_name, class_desc, subject, room) VALUES ('${akun.id}', '${name}', '${desc}', '${subject}', '${room}')`;
    pooldb.query( sqlsyn, (err, result) => { 
        // Jika Error Syntax atau semacamnya
        if (err){ 
            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;
        }
        if (result){
            // Menambahkan akun ke kelas
            let sqlsyn = `INSERT INTO pengguna_class_joined (id_owner, id_class) VALUES ('${akun.id}', '${result.insertId}')`;
            pooldb.query( sqlsyn, (err, result) => { 
                // Jika Error Syntax atau semacamnya
                if (err){ 
                    res.status(200).json({
                        pesan : `Kesalahan Internal (${err})`, error : 1
                    });
                    return;
                }
                // Menampilkan kelas yang join
                res.status(200).json({
                    pesan : `Berhasil Membuat Kelas!`, sukses : 1
                });
                return;
            });
        }
    });

});

// Bergabung ke kelas
router.post('/join', [
    body('invitecode').isLength({ min: 12, max: 12 }).withMessage('Masukan 12 digit kode undangan!').trim().escape().isNumeric().withMessage('Kode tidak valid!')
], (req, res) => {

    // Cek Error pada validasi input
    const err = validationResult(req);
    if (!err.isEmpty()) {
        res.status(200).json({
            pesan : err.errors[0].msg, error : 1
        });
        return;
    }

    let {akun} = req.bridge; // Mengambil data akun
    let {invitecode} = req.body; // Mengambil kode kelas

    // Cek Kode Invite yang dimaksud
    let sqlsyn = `SELECT ki.* FROM kelas_invite ki JOIN kelas k ON k.id=ki.id_class WHERE invite_code='${invitecode}'`;
    pooldb.query( sqlsyn, (err, result) => { 
        // Jika Error Syntax atau semacamnya
        if (err){ 
            res.status(200).json({
                pesan : `Kesalahan Internal (${err})`, error : 1
            });
            return;
        }
        // Jika Berhasil ditemukan record pertama
        if (result[0]){

            let {id_class} = result[0]; 

            // Cek Apakah sudah join
            let sqlsyn = `SELECT id_owner, id_class FROM pengguna_class_joined WHERE id_owner='${akun.id}' AND id_class='${id_class}'`;
            pooldb.query( sqlsyn, (err, result) => { 
                // Jika Error Syntax atau semacamnya
                if (err){ 
                    res.status(200).json({
                        pesan : `Kesalahan Internal (${err})`, error : 1
                    });
                    return;
                }
                // Jika Berhasil ditemukan record pertama
                if (result[0]){
                    // Menampilkan kelas yang join
                    res.status(200).json({
                        pesan : `Anda sudah join!`, sukses : 1
                    });
                    return;
                }else{
                    // Menambahkan akun ke kelas
                    let sqlsyn = `INSERT INTO pengguna_class_joined (id_owner, id_class) VALUES ('${akun.id}', '${id_class}')`;
                    pooldb.query( sqlsyn, (err, result) => { 
                        // Jika Error Syntax atau semacamnya
                        if (err){ 
                            res.status(200).json({
                                pesan : `Kesalahan Internal (${err})`, error : 1
                            });
                            return;
                        }
                        // Menampilkan kelas yang join
                        res.status(200).json({
                            pesan : `Berhasil Join!`, sukses : 1
                        });
                        return;
                    });
                };
                   
            });
            
        }else{
            res.status(200).json({
                pesan : `Kode Undangan tidak ditemukan!`, error : 1
            });
            return;
        }
    });
    
});

module.exports = router;