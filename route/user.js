const exp = require('express');
const route = exp.Router();

var datajson = [{
	id:1,username:"dhani",
	email:"dhani.rahmadsukar@email.com",
	name:"Rahmad Dhani"
},{
	id:2,username:"anisah",
	email:"anisah@email.com",
	name:"Anisah Putri"
}];

var datajson_restrict = [{
	id:1,username:"dhani",
	tanggal_lahir:"06/06/1999",
	ktp:"0002882917929"
},{
	id:2,username:"anisah",
	tanggal_lahir:"06/09/6969",
	ktp:"0002882917929"
}];

// Ambil semua user
route.get('/', (req, res) => {
	datarespon = {
		status:200,
		pesan:`Menampilkan semua users`,
		data:datajson
	};
	res.json(datarespon);
});

// Ambil sebagian user dengan id
route.get('/:iduser', (req, res) => {
	const iduser = req.params.iduser;
	var datarespon = {};
	if (datajson[iduser-1]){
		datarespon = {
			status:200,
			pesan:`User dengan id ${iduser} berhasil ditemukan`,
			data:datajson[iduser-1]
		};
	}else{
		datarespon = {
			status:404,
			pesan:`User dengan id ${iduser} tidak ditemukan`
		};
	}
	res.json(datarespon);
});

// Menambah user dengan id
route.put('/', (req, res) => {
	const {username, email} = req.body;
	var datarespon = {};
	datarespon = {
		status:200,
		pesan:`User baru dengan username [${username}] dan terdaftar dengan email [${email}] telah ditambahkan dengan id ke sekian!`
	};
	res.json(datarespon);
});

// Delete sebagian user dengan id
route.delete('/', (req, res) => {
	const {username, id} = req.body;
	var datarespon = {};
	if (username != undefined){
		datarespon = {
			status:200,
			pesan:`User dengan username ${username} telah dihapus!`
		};
	}else{
		if (id != undefined){
			datarespon = {
				status:200,
				pesan:`User dengan id ${id} telah dihapus!`
			};
		}else{
			datarespon = {
				status:500,
				pesan:`Beberapa data tidak lengkap!`
			};
		}
	}
	res.json(datarespon);
});

// Akses data rahasia
route.post('/', (req, res) => {
	const {token} = req.body;
	var datarespon = {};
	if ( (token != undefined) && (token == "HAYDAY")){
		const userid = 1;
		datarespon = {
			status:200,
			pesan:`Data rahasia untuk user ${datajson[userid-1].username} berhasil diambil!`,
			data:datajson_restrict[userid-1]
		};
	}else{
		datarespon = {
			status:500,
			pesan:`Akses ditolak`
		};
	}
	res.json(datarespon);
});

module.exports = route;