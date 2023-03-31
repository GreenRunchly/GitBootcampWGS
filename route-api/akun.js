const router = require('express').Router();

router.get('/saya', (req, res) => {

    let {akun} = req.bridge; // Mengambil data akun 
    
    res.status(200).json({
        pesan : `Berhasil!`, sukses : 1,
        hasil : [akun]
    });
    return;
});

module.exports = router;