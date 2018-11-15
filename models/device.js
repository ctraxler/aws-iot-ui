
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');
const region = 'us-east-1';

//AWS.config.logger = console;


var Device = {
	getbyId: function (idParam, username, successCb, errCb) {

		console.log('in Device getbyId function'); 
		if (idParam) {
			var lambda = new AWS.Lambda(
				{
					region: region, 
					accessKeyId: user.AWSCredentials.accessKeyId, 
					secretAccessKey: user.AWSCredentials.secretAccessKey,
					sessionToken: user.AWSCredentials.sessionToken
				});

			payload = {action: 'getbyId', id: idParam, username: username}; 

			var params = {
				FunctionName: "iotUIAPIHandlerHttps", 
				LogType: "None", 
				Payload: JSON.stringify(payload)
			};

			lambda.invoke(params, function(err, data) {
			    if (err) { 
				   	console.log(err, err.stack); // an error occurred
				   	errCb(err); 
			    }
			    else {     // successful response  
					successCb(JSON.parse(data.Payload)); 
			   }
			});
		} else {
			console.log('error, no user credentials for aws');
			errCb({error: "Internal system error, No backend credentials"});
		}
	}, 



	getbyUser: function (username, successCb, errCb) {

		console.log('in Device getbyId function'); 
		if (idParam) {
			var lambda = new AWS.Lambda({region: region});

			payload = {action: 'getbyUser', username: username}; 

			var params = {
				FunctionName: "iotUIAPIHandlerHttps", 
				LogType: "None", 
				Payload: JSON.stringify(payload) 
			};

			lambda.invoke(params, function(err, data) {
			    if (err) { 
				   	console.log(err, err.stack); // an error occurred
				   	errCb(err); 
			    }
			    else {     // successful response  
					successCb(JSON.parse(data.Payload)); 
			   }
			});
		} else {
			console.log('error, no user credentials for aws');
			errCb({error: "Internal system error, No backend credentials"});
		}
	}
}


module.exports = Device;
