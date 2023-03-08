const exp = require('express');
const route = exp.Router();

var datajson = {
	status:200,
	pesan:"Welcome to EShop Endpoint!"
};

// User
route.get('/', (req, res) => {
	res.json(datajson);
});

module.exports = route;