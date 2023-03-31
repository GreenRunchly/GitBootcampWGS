const router = require('express').Router();
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const strtotime = require('nodestrtotime');
const pooldb = require('../module-db');
const auth = require('../module-auth');

router.get('/akun/verify', auth.akun, (req, res) => {

    let {akun} = req.bridge; // Mengambil data akun

    // OTP Generator
    function otpGen(){
        return Math.floor(100000 + Math.random() * 900000)
    }

    // Cek OTP Request
    let sqlsyn = `SELECT * FROM otp_request WHERE id_owner='${akun.id}' AND (status='unverified' OR status='pending')`;
    pooldb.query( sqlsyn, (err, result) => { 
        // Jika Error Syntax atau semacamnya
        if (err){ 
            console.log(`Error (${err})`);
        }
        if (result[0]){
            let idrecord = result[0].id;
            let timenow = strtotime('now');
            let updatedrecord = ((result[0].updated).getTime()/1000);
            if (timenow > updatedrecord+1){
                // Update OTP Code and status
                let sqlsyn = `UPDATE otp_request SET code='${otpGen()}', status='unverified' WHERE id='${idrecord}'`;
                pooldb.query( sqlsyn, (err, result) => { 
                    // Jika Error Syntax atau semacamnya
                    if (err){ 
                        res.status(200).json({
                            pesan : `Kesalahan Internal (${err})`, error : 1
                        });
                        return;
                    }
                    // Berhasil diubah
                    res.status(200).json({
                        pesan : `OTP akan dikirimkan ke wa, jika tidak kunjung datang, tunggu 2 menit atau lebih...`, sukses : 1
                    });
                    return;
                });
            }else{
                res.status(200).json({
                    pesan : `Tunggu 3 menit untuk meminta OTP baru`, error : 1
                });
                return;
            }
        }else{
            // Menambahkan OTP Record
            let sqlsyn = `INSERT INTO otp_request (id_owner, code) VALUES ('${akun.id}','${otpGen()}')`;
            pooldb.query( sqlsyn, (err, result) => { 
                // Jika Error Syntax atau semacamnya
                if (err){ 
                    res.status(200).json({
                        pesan : `Kesalahan Internal (${err})`, error : 1
                    });
                    return;
                }
                // Berhasil ditambahkan
                res.status(200).json({
                    pesan : `OTP akan dikirimkan ke wa, jika tidak kunjung datang, tunggu 2 menit atau lebih...`, sukses : 1
                });
                return;
            });
        }
    
    });
    
});

router.post('/akun/masuk', (req, res) => {

    let {username, password} = req.body;

    // Filter Username dan Password
    if (!username){
        res.status(200).json({
            pesan : `Username Kosong!`, error : 1
        });
        return;
    } else if (!password){
        res.status(200).json({
            pesan : `Password Kosong!`, error : 1
        });
        return;
    }
    
    // Cek User Username dan Password
    let sqlsyn = `SELECT id, password FROM pengguna WHERE username = ? `;
    pooldb.query( sqlsyn,  [username], (err, result) => { 
        // Jika Error Syntax atau semacamnya
        if (err){ 
            res.status(200).json({
                pesan : `Gagal Masuk! (${err})`, error : 1
            });
            return;
        }
        // Jika Berhasil ditemukan record pertama
        if (result[0]){
            // Cek Password User
            if (result[0].password == password){
                // Password cocok maka membuat token
                let token = jwt.sign({
                    data: {username, password:md5(password), userid:result[0].id}
                }, 'otentikasi', { expiresIn: (60*60) });
                // Set Cookie
                res.cookie('tokensesi', token, {expire:(60*60)});
                res.status(200).json({
                    pesan : `Berhasil Masuk!`, sukses : 1
                });
                return;
            }else{
                // Password tidak cocok
                res.status(200).json({
                    pesan : `Password tidak cocok!`, error : 1
                });
                return;
            }
        }else{
            // Username tidak ditemukan
            res.status(200).json({
                pesan : `User tidak ditemukan!`, error : 1
            });
            return;
        }
    });

});

router.post('/akun/keluar', (req, res) => {
    res.clearCookie('tokensesi');
    res.status(200).json({
        pesan : `Berhasil Keluar!`, sukses : 1
    });
    return;
});

module.exports = router;