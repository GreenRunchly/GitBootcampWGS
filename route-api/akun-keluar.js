const router = require('express').Router();

router.post('/', (req, res) => { // Keluar dari akun
    // Clear cookie
    res.clearCookie('tokensesi');
    res.status(200).json({
        pesan : `Berhasil Keluar!`, sukses : 1
    });
    return;
});

module.exports = router;