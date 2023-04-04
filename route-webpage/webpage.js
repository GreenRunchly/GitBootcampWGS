const router = require('express').Router();
const auth = require('../module-auth');
const md5 = require('md5');


router.get('/', auth.noneedlogin, (req, res) => {

    res.status(200).render('pages/index.html');
    return;

});

router.get('/portal', auth.noneedlogin, (req, res) => {

    res.status(200).render('pages/portal.html');
    return;
    
});

router.get('/dashboard', auth.passwebpage, auth.akun, (req, res) => {

    if (req.passwebpage){
        let {akun} = req.bridge; // Mengambil data akun

        res.redirect('/kelas');
        return;    
    }else{
        res.redirect('/portal');
        return;
    }

});

router.get('/kelas', auth.passwebpage, auth.akun, (req, res) => {

    if (req.passwebpage){
        let {akun} = req.bridge; // Mengambil data akun

        res.status(200).render('pages/kelas.html', {akun});
        return;    
    }else{
        res.redirect('/portal');
        return;
    }

});

router.get('/kelas/:idkelas', auth.passwebpage, auth.akun, (req, res) => {

    if (req.passwebpage){
        let {akun} = req.bridge; // Mengambil data akun
        let {idkelas} = req.params;

        res.status(200).render('pages/kelas-single.html', {akun, idkelas});
        return;    
    }else{
        res.redirect('/portal');
        return;
    }

});

router.get('/kelas/:idkelas/informasi/:idinformasi', auth.passwebpage, auth.akun, (req, res) => {

    if (req.passwebpage){
        let {akun} = req.bridge; // Mengambil data akun
        let {idkelas, idinformasi} = req.params;
        let id_informasihash = md5(parseInt(idinformasi)+'postingan'); // Hash File Posting
        
        res.status(200).render('pages/informasi-single.html', {akun, idkelas, idinformasi, id_informasihash});
        return;    
    }else{
        res.redirect('/portal');
        return;
    }

});

router.get('/pengaturan', auth.passwebpage, auth.akun, (req, res) => {

    if (req.passwebpage){
        let {akun} = req.bridge; // Mengambil data akun

        res.status(200).render('pages/comingsoon.html');
        return;    
    }else{
        res.redirect('/portal');
        return;
    }

});

router.get('/rewards', auth.passwebpage, auth.akun, (req, res) => {

    if (req.passwebpage){
        let {akun} = req.bridge; // Mengambil data akun

        res.status(200).render('pages/comingsoon.html');
        return;    
    }else{
        res.redirect('/portal');
        return;
    }

});

module.exports = router;