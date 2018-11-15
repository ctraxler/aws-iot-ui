var account = require('../models/Account');

var userInfo = { username: 'craig.traxler@comcast.net', password: 'Testpass1!', phone: '+18472743199'};

 account.register(userInfo, regCb); 

 function regCb(err, response) {
	if (err) {
		console.log('register err: ' + JSON.stringify(err));
		console.log('register response (s/b null): ' + JSON.stringify(response));
	} else {
		console.log('registered user: ' + JSON.stringify(response));
	}
}