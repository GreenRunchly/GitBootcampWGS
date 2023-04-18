const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cors = require('cors');
const useragent = require('express-useragent');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// const jwt = require('jsonwebtoken');
// const morgan = require('morgan');
const auth = require('./module-auth');
const alat = require('./module-tools');

// Init Express App
const app = express();

// Agar saat crash web tidak shutdown
app.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node Still Running...");
});

// Set the view engine to ejs
app.engine('html', require('ejs').renderFile); //diganti biar bisa pakai ekstensi html dari app.set('view engine', 'ejs');
app.set("view options", {
    openDelimiter: "<",
    delimiter: "?",
    closeDelimiter: ">",
});
app.set('etag', false); // Biar tidak tercache per page

// Use Cookie
app.use(cookieParser());

// // Use Session
// app.set('trust proxy', 1) // trust first proxy
// app.use(session({
//     name: 'appsession',
//     secret: 'appsession',
//     resave: true,
//     saveUninitialized: false,
//     cookie: { secure: true }
// })) 

// Use UserAgent
app.use(useragent.express());

// Use files upload
app.use(fileUpload({
    createParentPath: true
}));

// Use JSON
app.use(express.json());

// Form Data
app.use(express.urlencoded({
    extended: true
}));

//add other middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(morgan('dev'));

// Set CORS local dan null (file)
app.use(cors({
    origin: ['http://127.0.0.1', 'null']
}));

// Static Files untuk style dan lainnya
app.use("/assets", express.static('web-assets'));

// Static Files untuk style dan lainnya
app.use("/postingan", express.static('uploads/postingan'));


/* Router API */
<<<<<<< Updated upstream
app.use('/api/akses', auth.next, require('./route-api/akses'));
app.use('/api/akun', auth.akun, require('./route-api/akun'));
app.use('/api/kelas', auth.akun, require('./route-api/kelas'));
=======

// Akun /akun/:idakun
app.use('/api/akun/daftar', auth.next, require('./route-api/akun-daftar'));
app.use('/api/akun/masuk', auth.next, require('./route-api/akun-masuk'));
app.use('/api/akun/keluar', auth.akun, require('./route-api/akun-keluar'));
app.use('/api/akun/saya', auth.akun, require('./route-api/akun-saya'));
app.use('/api/akun/', auth.akun, require('./route-api/akun'));

// Evaluation
app.use('/api/kelas/', auth.akun, require('./route-api/class-posts-evaluation-start'));

// Postingan Kelas /kelas/:idkelas/informasi/:idinformasi
app.use('/api/kelas/', auth.akun, require('./route-api/class-posts-saya'));
app.use('/api/kelas/', auth.akun, require('./route-api/class-posts-do'));
app.use('/api/kelas/', auth.akun, require('./route-api/class-posts-delete'));
app.use('/api/kelas/', auth.akun, require('./route-api/class-posts'));

// Kelas /kelas/:idkelas/
app.use('/api/kelas/', auth.akun, require('./route-api/class-saya'));
app.use('/api/kelas/', auth.akun, require('./route-api/class-create'));
app.use('/api/kelas/', auth.akun, require('./route-api/class-edit'));
app.use('/api/kelas/', auth.akun, require('./route-api/class-invite'));
app.use('/api/kelas/', auth.akun, require('./route-api/class-join'));
app.use('/api/kelas/', auth.akun, require('./route-api/class-all-peserta'));
app.use('/api/kelas/', auth.akun, require('./route-api/class-quit'));
app.use('/api/kelas/', auth.akun, require('./route-api/class'));
>>>>>>> Stashed changes

/* Router Web Page */
app.use('/', require('./route-webpage/webpage'));


// 404 Not Found
app.use('/*', (req, res, next) => {
    res.status(404).render('pages/404.html');
    return;
});

// Web Server
const WEB_PORT = 1878;
app.listen(WEB_PORT, () => {
    console.log(`Server port ${WEB_PORT} running...`);
});

// WA OTP Module
//require('./module-otp');