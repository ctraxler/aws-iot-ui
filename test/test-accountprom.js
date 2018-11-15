var account = require('../models/account-promise');

var userInfo = { username: 'craig.traxler@comcast.net', password: 'Testpass1!', phone: '+18472743199'};

account.register(userInfo)
	.then((user) => { 
		console.log('registered user: ' + JSON.stringify(user));
	 	console.log('success');
	 	doConfirm(); 
 	})
 	.catch((err) => {
	 	console.log('failed'); 
	 	console.log('register err: ' + JSON.stringify(err));
 	});

function doConfirm() {
	var stdin = process.openStdin();
	console.log('Enter confirmation code: ');
	stdin.addListener('data', getInputCb);

	function getInputCb (input) {
		userInfo.code = input.toString().trim(); 
		account.confirmReg(userInfo)
		.then((result) => {
			console.log('success confirming');
			console.log('after result cb result is ' + JSON.stringify(result));
			doAuth(); 
			})
		.catch((err) => {
			console.log('err confirming');
			console.log('after err cb');
			});

	}
}

function doAuth(){
	account.authenticate(userInfo)
	.then((result)=>{
		console.log('authenticate successful');
		console.log('user is :' + JSON.stringify(result))
		doGetIdentityToken(result)})
	.catch((err)=>{
		console.log('authenticate error');
		console.log('err is :' + JSON.stringify(err));
	});
}


function doGetIdentityToken(user){
	account.getIdentityToken(user)
	.then((result)=>{
		console.log('get Identity Token successful');
		console.log('user info: ' + JSON.stringify(result));
		process.exit(0);
	}).catch((err) => {
		console.log('get IdentityToken error');
		console.log('err: ' + JSON.stringify(err));
		process.exit(0);	
	});
}; 