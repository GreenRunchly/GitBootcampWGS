const router = require('express').Router();
const md5 = require('md5');
const mammoth = require('mammoth');
// Module untuk koneksi database
const pooldb = require('../module-db');
// Module untuk Validasi input
const modval = require('../module-validator');
// Module tools
const tools = require('../module-tools');

// Module JQuery dengan JSDOM
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "<body></body>" );
const $ = require( "jquery" )( window );

async function convertSoal(rawSoal) {

    // Functions Pendukung
    function tabletodiv(table){

		table.each(function(index, el) {
			$(this).children('tbody').each(function(index, el) {
				$(this).children('tr').each(function(index, el) {
					$(this).children('td').each(function(index, el) {
						replaceTag($(this),'<div class="ex-td">','</div>');
					});
					replaceTag($(this),'<div class="ex-tr">','</div>');
				});
				replaceTag($(this),'<div class="ex-tbody">','</div>');
			});
			replaceTag($(this),'<div class="ex-table">','</div>');
		});

	}
    function replaceTag(elem,begin,end) {
		s = begin;
		s += elem.html();
		s += end;
		elem.replaceWith(s);
	}
    function getCellData(parent, child, index, row, col) {
        return $(parent).eq(((index-1)*7) + col).children(child).eq(row).html();
    }

    // Mulai Pengkonversian
    $("body").html(rawSoal); // Init HTML Soal
    $("body").html(`<table>${$('body>table').html()}</table>`); // Menghapus table luar tag
    tabletodiv($('body>table'));

    // HTML jadi Soal Object
    let jumlahsoal = Math.round($('div.ex-tr').length / 7);
    let soal = [];
    for (let index = 0; index < jumlahsoal; index++) {
        
        soal[index] = {};
        soal[index].nomor = index+1;
        soal[index].pertanyaan = tools.base64Encode(getCellData('div.ex-tr', '.ex-td', index+1, 1, 0));
        soal[index].pembahasan = tools.base64Encode(getCellData('div.ex-tr', '.ex-td', index+1, 2, 1));
        soal[index].jenis = getCellData('div.ex-tr', '.ex-td', index+1, 0, 1).replace('<p>','').replace('</p>','').replace('<strong>','').replace('</strong>','');
        soal[index].poin = parseInt(getCellData('div.ex-tr', '.ex-td', index+1, 0, 2).replace('<p>','').replace('</p>','').replace('<strong>','').replace('</strong>',''));

        soal[index].pilihan = {};
        for (let i = 0; i < 5; i++) {
            switch (soal[index].jenis) {
                case 'ESSAY':
                    soal[index].pilihan[i] = getCellData('div.ex-tr', '.ex-td', index+1, 2, (2 + i)).replace('<p>','').replace('</p>','');
                    break;
                default:
                    soal[index].pilihan[i] = tools.base64Encode( getCellData('div.ex-tr', '.ex-td', index+1, 2, (2 + i)) );
                    break;
            }
        }
        soal[index].jawaban = [];
        for (let i = 0; i < 5; i++) {
            let jawaban = getCellData('div.ex-tr', '.ex-td', index+1, 1, (2 + i)).replace('<p>','').replace('</p>','');
            if (!jawaban.indexOf('<strong>')){
                soal[index].jawaban.push(i);
            };
        }
        
    }
    
    console.log(soal);
    //return ($("body").html());
    return JSON.stringify(soal);

}


// Menambahkan informasi pada kelas yang sudah ditentukan
router.post('/:idkelas/informasi/do', [
    modval.midval.param('idkelas').not().isEmpty().withMessage('ID Kelas tidak terdeteksi!').trim().escape(),
    modval.midval.body('title').isLength({min : 4, max: 60}).withMessage('Judul tidak boleh kosong! Minimal 4 karakter dan maksimal 60 karakter!').trim().escape(),
    modval.midval.body('topic').not().isEmpty().withMessage('Topik postingan tidak terdeteksi!').trim().escape(),
    modval.midval.body('format').not().isEmpty().withMessage('Format postingan tidak terdeteksi!').trim().escape(),
], (req, res) => {

    // Cek Error pada validasi input
    if ( modval.midvalResult(req, res) ){ // Jika ditemukan masalah akan return true
        return; // Untuk menghentikan eksekusi lanjutan
    }

    let {akun} = req.bridge; // Mengambil data akun
    let {idkelas} = req.params; // Mengambil data parameter
    let {title, idinformasi, topic, format} = req.body; // Mengambil data upload

    // Cek validasi topik postingan
    if (modval.validator.isAlpha(topic)){
        console.log(topic);
        if ((topic == 'all')){}else{
            // Jika berisi selain all
            res.status(200).json({
                pesan : `Isi topik kelas invalid`, error : 1
            });
            return; 
        }
    }

    // Cek validasi format postingan
    if (modval.validator.isAlpha(format)){
        console.log(format);
        if ((format == 'material') || (format == 'evaluation')){}else{
            // Jika berisi selain material atau evaluation
            res.status(200).json({
                pesan : `Isi format kelas invalid`, error : 1
            });
            return; 
        }
    }
    
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
                                    convertSoal(input_content).then((jsondata) => {
                                        input_content = jsondata;
                                        lanjut();
                                    });

                                    function lanjut() {
                                        // Melakukan Update Postingan
                                        let sqlsyn = `
                                        UPDATE informasi SET title= ? , topic= ? , format= ? , content= ? WHERE id= ? 
                                        `;
                                        let sqlsyninput = [modval.validator.escape(title), modval.validator.escape(topic), modval.validator.escape(format), input_content, idrecord];
                                        
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
                                    }

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
                            UPDATE informasi SET title= ? , topic= ? , format= ? WHERE id= ? 
                            `;
                            let sqlsyninput = [modval.validator.escape(title), modval.validator.escape(topic), modval.validator.escape(format), idrecord];

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
                            INSERT INTO informasi (id_owner, id_class, title, topic, format, content) 
                            VALUES ( ?, ?, ?, ?, ?, ? )
                            `;
                            pooldb.query( sqlsyn, [akun.id, idkelas, modval.validator.escape(title), modval.validator.escape(topic), modval.validator.escape(format), input_content], (err, result) => { 
                            
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