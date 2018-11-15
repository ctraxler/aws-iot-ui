var Device = require('../models/Device');

Device.getbyId('79c4fe33-1f46-4fc4-b67f-f8223784b569', 
	function(data) {
		console.log('success with data: ' + JSON.stringify(data)); 
	},

	function(err) {
		console.log('error with err: ' + JSON.stringify(err));
	}
);


