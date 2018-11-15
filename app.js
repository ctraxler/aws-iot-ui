// dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportCustomStrategy = require('passport-custom').Strategy;
var flash = require('connect-flash');
const uuid = require('uuid/v4')
var session = require('express-session');
const DynamoStore = require('connect-dynamodb-session')(session);
//var Account = require('./models/Account'); 
var AccountPromise = require('./models/account-promise.js');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('dsrUaZBPH6c5CHdyD8x'));

app.use(session({
    genid: (req) => {
        console.log('Getting called to create a new session id');
        console.log('sesionId: ' + req.sessionID);
        return uuid(); // use UUIDs for session IDs
        },
    secret: 'dsrUaZBPH6c5CHdyD8x',
    store: new DynamoStore({
        // Optional JSON object of AWS credentials and configuration
        AWSConfigJSON: {
            accessKeyId: 'AKIAI6WYY6BDPA2KQS5A',
            secretAccessKey: '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',
            region: 'us-east-1',
            autoCreate: true
        },
        region: 'us-east-1',
        tableName: 'iotUILoginTable',
        cleanupInterval: 100000,
        touchAfter: 0,
        autoCreate: true
        }),
    resave: true,
    saveUninitialized: false
    }));
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);


passport.use('cognito', 
    new passportCustomStrategy(
        function(req, callback) {


            console.log('in passport custom strategy callback, req.body:' + JSON.stringify(req.body));

            AccountPromise.authenticate({username: req.body.username, password: req.body.password})
            .then((creds)=>{
                console.log('creds back from authenticate: ' + JSON.stringify(creds)); 
                doGetIdentityToken(creds);
            })
            .catch((err)=>{
                console.log('authentiate User received and error: ' + err);
                callback(err)});

            function doGetIdentityToken(cognitoCreds) {
                console.log('cognitoCreds before getting Id Token: ' + JSON.stringify(cognitoCreds));
                AccountPromise.getIdentityToken(cognitoCreds)
                .then((user)=>{
                    console.log('user back from getIdentityToken: ' + JSON.stringify(user)); 
                    /* req.session.save((err) => {
                        console.log('session in session save callback: ' + JSON.stringify(req.session));
                        if (err) {
                            return next(err);
                        }}); */
                    console.log('performing passportCustomStrategy callback');
                    callback(null, user);
                });
            }
            
        })
);

passport.serializeUser(function(user, done) {
    console.log('user in serialize: ' + JSON.stringify(user));
    done(null, user); 
});

passport.deserializeUser( function(user, done) {
    console.log('user in deserialize: ' + JSON.stringify(user));
    done(null, user);
    });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
