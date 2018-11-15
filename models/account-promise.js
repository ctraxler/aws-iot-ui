const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');

const region = 'us-east-1';
const userPoolId = 'us-east-1_jco7Qcj9W';
const clientId = '3ql02rlb3hh4tban9pe8711i4f';
const identityPoolId = 'us-east-1:a0992334-eab0-49f3-95d2-dfdac24b8ba8';
const loginEndPoint =  'cognito-idp.' + region + '.amazonaws.com/' + userPoolId; 

const poolData = {
  UserPoolId: userPoolId, // your user pool ID
  ClientId: clientId, // generated in the AWS console
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// AWS.config.logger = console;

var AccountPromise = {


	register: function (attrs) {
		return new Promise (performReg); 

		function performReg(resolve, reject) { 

		    var dataEmail = {
		        Name : 'email',
		        Value : attrs.username // your email here
		    };
		    
		    var dataPhoneNumber = {
		        Name : 'phone_number',
		        Value : attrs.phone // your phone number here with +country code and no delimiters in front
		    }; 
		    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
		    var attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(dataPhoneNumber); 
		    

		    var attributeList = [];
		    attributeList.push(attributeEmail);
		    attributeList.push(attributePhoneNumber);

		    console.log('calling signup');

		    userPool.signUp(attrs.username, attrs.password, attributeList, null, (err, response) => {
		    	// console.log('in signUp callback');
				if (err) {
					// console.log('singUp callback received an error');
					return reject(err); 
				} 
				// console.log('singUp callback did not find an error');
				resolve(response); 
			});
		} 
	},


	confirmReg: function (attrs) {

		return new Promise (performConfirm);

		function performConfirm(resolve, reject) {
			console.log('in performConfirm');

			var userData = {
		        Username : attrs.username,
		        Pool : userPool
		    };
		    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
		    cognitoUser.confirmRegistration(attrs.code, true, (err, response) => {
		        console.log('in callback from signupConfirm');
		        console.log('err: ' + JSON.stringify(err));
		        console.log('res: ' + JSON.stringify(response));
		        if (err) {
		        	return reject(err);
		        } 
		        resolve(response);	
	    	});
		}
	},


	authenticate: function (attrs) {

		return new Promise (performAuth);

		function performAuth(resolve, reject) {

			console.log('in performAuth function'); 

			var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
			    Username : attrs.username,
			    Password : attrs.password
			});

			var userData = {
			    Username : attrs.username,
			    Pool : userPool
			};

			var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);


			console.log('calling authenticateUser'); 
			cognitoUser.authenticateUser(authenticationDetails, {onSuccess: (response) => {resolve(response)}, onFailure: (err)=>{reject(err)}});
		}
	},

	getIdentityToken: function(user) {
		return new Promise (performGetIdToken);

		function performGetIdToken(resolve, reject) {

			console.log('logged in user ' + user.accessToken.payload.username + '.');
            var identityPoolInfo = 
	            {
	            	IdentityPoolId: identityPoolId,
	            	Logins: {}
	            };
			console.log('built identityPoolInfo shell');
	        identityPoolInfo.Logins[loginEndPoint] = user.idToken.jwtToken;
	        console.log('built identityPoolInfo Login');
	        AWS.config.credentials = new AWS.CognitoIdentityCredentials(identityPoolInfo, {region: region});
	        console.log('created new AWS.config.credentials object');
	        AWS.config.credentials.get(function() {
	        	console.log('established awsCredentials for user');
	        	 resolve({
            		Username: user.accessToken.payload.username, 
        			CognitoSession: user, 
            		AWSCredentials: {
            			accessKeyId: AWS.config.credentials.accessKeyId,
            			secretAccessKey:  AWS.config.credentials.secretAccessKey,
            			sessionToken: AWS.config.credentials.sessionToken
            			}
            		}); 
	        });
		}

	}	

}; 

module.exports = AccountPromise; 
