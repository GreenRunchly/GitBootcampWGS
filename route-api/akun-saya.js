const router = require('express').Router();

router.get('/', (req, res) => { // Mengambil data akun lengkap

    let {akun} = req.bridge; // Mengambil data akun 
    
    res.status(200).json({
        pesan : `Berhasil!`, sukses : 1,
        hasil : [akun] // Agar menjadi array bukan object
    });
    return;
    
});

module.exports = router;