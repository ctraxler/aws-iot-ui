var account = require('../models/Account');

var userInfo = { username: 'craig.traxler@comcast.net', password: 'Testpass1!', phone: '+18472743199'};


function regCb(err, response) {
	if (err) {
		console.log('register err: ' + JSON.stringify(err));
		console.log('register response (s/b null): ' + JSON.stringify(response)); 
	} else {
		console.log('registered user: ' + JSON.stringify(response));

		var stdin = process.openStdin();
		console.log('Enter confirmation code: ');
		stdin.addListener('data', getInputCb); 
	}
}

function getInputCb (data) {
	userInfo.code = data.toString().trim(); 
	account.confirmReg(userInfo, confirmCb);
}

function confirmCb(err, response) {
	if (err) {
		console.log('err back from confirm reg: ' + JSON.stringify(err));
		return err;
	} else {
		console.log('Response back from confirmation call: ' + JSON.stringify(response));
		account.authenticate(userInfo, successCb, errCb); 
	}
}


function successCb(user) {
	console.log('userInfo back from authenticate: ' + JSON.stringify(userInfo));
	return userInfo;
}

function errCb(err) {
	console.log('err back from authentication: ' + JSON.stringify(err));
	return err;
}
console.log('calling account.register');

var result = account.register(userInfo, regCb); 

