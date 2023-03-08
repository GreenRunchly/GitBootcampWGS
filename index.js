console.log('=== Start App Execution ===');

const exp = require('express');
const app = exp();
appport = 1878;

app.use(exp.json());
// app.use('/', require('./route/main'));
// app.use('/user', require('./route/user'));

/* 

Fast Quest query and parametter

*/
// Query
app.get('/', (req, res) => {
	const {u, a} = req.query;
	datarespon = {
		status:200,
		pesan:`Melakukan eksekusi ${a} pada user ${u} menggunakan query`
	};
	res.status(200).json(datarespon);
});

// Parameter
app.get('/:username/:aksi', (req, res) => {
	const {username, aksi} = req.params;
	datarespon = {
		status:200,
		pesan:`Melakukan eksekusi ${aksi} pada user ${username} menggunakan parameter`
	};
	res.status(200).json(datarespon);
});

app.listen(appport, () => {
	console.log('App is listening...');
});

console.log('===  End App Execution  ===');