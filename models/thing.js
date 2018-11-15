                        var iotData = new AWS.IotData({endpoint: "a3riiqm5a27d7f.iot.us-east-1.amazonaws.com", credentials: awsCredentials , region: region});
                        if (iotData) {
                            var params = { "thingName" : "home-garage-door" };
                            iotData.getThingShadow(params, function(err, data) {
                                console.log('Inside of getThingShadow callback');
                                if (err){
                                    //Handle the error here
                                    console.log('Problem getting the thing shadow');
                                    console.log(err, err.stack);
                                }
                                else {
                                    console.log("Data back from shadow", JSON.stringify(data));
                                }
                            });
                        }