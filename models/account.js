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

AWS.config.logger = console;


var Account = {

	authenticate: function (attrs, successCb, errCb) {

		console.log('in authenticate function'); 

	    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
	        Username : attrs.username,
	        Password : attrs.password
	    });

	    var userData = {
	        Username : username,
	        Pool : userPool
	    };
	    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

	    cognitoUser.authenticateUser(authenticationDetails, {
	        onSuccess: function (result) {
	            var cognitoUser = userPool.getCurrentUser();
	            if (cognitoUser != null) {
	                cognitoUser.getSession(function(err, result) {
	                    if (result) {
	                        console.log('logged in user ' + username + '.');
	                        var identityPoolInfo = {
	                        	IdentityPoolId: identityPoolId,
	                        	Logins: {}
	                        };

	                        identityPoolInfo.Logins[loginEndPoint] = result.getIdToken().getJwtToken(); 

//	                        console.log('identityPoolInfo for use in CognitoIdentityCredentials constructor: ' + JSON.stringify(identityPoolInfo));

	                        // Add the User's Id Token to the Cognito credentials login map.
	                        AWS.config.credentials = new AWS.CognitoIdentityCredentials(identityPoolInfo,
	                 			{
	                               // optionally provide configuration to apply to the underlying service clients
	                               // if configuration is not provided, then configuration will be pulled from AWS.config
	                               // region should match the region your identity pool is located in
	                               region: region,
	                        	});

	                        // Make the call to obtain credentials
	                        AWS.config.credentials.get(function(){
		                        	console.log('established awsCredentials for user ' + username + '.');
		                        	successCb({
		                        		Username: username, 
	                        			CognitoSession: result, 
		                        		AWSCredentials: {
		                        			accessKeyId: AWS.config.credentials.accessKeyId,
		                        			secretAccessKey:  AWS.config.credentials.secretAccessKey,
		                        			sessionToken: AWS.config.credentials.sessionToken
		                        			}});
		                        	});
	                        } else errCb(err);
	                	});
	            	}
	        	},

	        onFailure: function(err) {
	            console.log('within onFailure with err: ' + JSON.stringify(err));
	            errCb(err); 
	        },

	    });
	},

	register: function (attrs, cb) {

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

	    console.log('performing signup');
	    
        userPool.signUp(attrs.username, attrs.password, attributeList, null, regCb);


        function regCb (err, result) {
        	console.log('err from signup: ' + JSON.stringify(err));
        	console.log('result from signup: ' + JSON.stringify(result));
            if (err) {
            	console.log('signup err within err check: ' + JSON.stringify(err));
                return cb(err);
            } 
            console.log('signup result: ' + JSON.stringify(result));
            return cb(null, result.user);
        }

        console.log('exiting register function');
	}


	confirmReg: function (attrs, cb) {

		console.log('in confirmReg'); 


	    var userData = {
	        Username : attrs.username,
	        Pool : userPool
	    };
	    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);


	    cognitoUser.confirmRegistration(attrs.code, true, innerCb);

	    function innerCb(err,response) {
	        console.log('in callback from signupConfirm');
	        console.log('err: ' + JSON.stringify(err));
	        console.log('res: ' + JSON.stringify(response));
	        if (err) {
	        	return cb(err);
	        } 
	        cb(null, response);
		}
	}
	
};

module.exports = Account;
