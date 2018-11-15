
AWS = require('aws-sdk');

AWS.config.update({region:'us-east-1'});



var userParams = {
  TableName : 'iotUIClaimedDevice',
  Item: {
     id: '79c4fe33-1f46-4fc4-b67f-f8223784b569',
     content: {userId: "craig.traxler@comcast.net", name: "Garage Door"}
  }
};

var documentClient1 = new AWS.DynamoDB.DocumentClient();

documentClient1.put(userParams, function(err, data) {
  if (err) console.log(err);
  else console.log(data);
});

var deviceParams = {
  TableName : 'iotDeviceMaster',
  Item: {
     id: '79c4fe33-1f46-4fc4-b67f-f8223784b569',
     content: {thingName: "home-garage-door", serialnum: "SN-1234-45", MAC: "something", ARN: "arn:aws:iot:us-east-1:502261806016:thing/home-garage-door", IoTEndPoint: "a3riiqm5a27d7f-ats.iot.us-east-1.amazonaws.com"}
  }
};

var documentClient2 = new AWS.DynamoDB.DocumentClient();

documentClient2.put(deviceParams, function(err, data) {
  if (err) console.log(err);
  else console.log(data);
});


var docClient1 = new AWS.DynamoDB.DocumentClient();

var params1 = {
    Key: {
        id: '79c4fe33-1f46-4fc4-b67f-f8223784b569',
    },
    TableName: 'iotUIClaimedDevice'
};

docClient1.get(params1, function(err, data){
    if (err) console.log(err);
    else console.log(data); 
});


var docClient2 = new AWS.DynamoDB.DocumentClient();

var params2 = {
    Key: {
        id: '79c4fe33-1f46-4fc4-b67f-f8223784b569',
    },
    TableName: 'iotDeviceMaster'
};

docClient2.get(params2, function(err, data){
    if (err) console.log(err);
    else console.log(data); 
});
