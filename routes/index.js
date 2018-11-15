const express = require('express');
const passport = require('passport');
//const Account = require('../models/account');
const AccountPromise = require('../models/account-promise.js');
const Device = require('../models/device');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('Got a get request at /');
//    console.log('req session: ' + JSON.stringify(req.session));
//    console.log('req user: ' + JSON.stringify(req.user));
    res.render('index', { user : req.user });
});


router.post('/login', passport.authenticate('cognito', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
    console.log('authenticate callback passport info: ' + JSON.stringify(req.passport));

    req.session.save((err) => {
        console.log('session in session save callback: ' + JSON.stringify(req.session));
        if (err) {
            return next(err);
        }
        //console.log('user info after authenticate: ' + JSON.stringify(req.user));
        res.redirect('/');
    }); 
});

router.post('/auth/login', passport.authenticate('cognito'), function (req, res) {
    console.log('in /auth/login callback, req.body: ' + JSON.stringify(req.body));
    res.json(req.user.Username);
    console.log('req.session.id: ' + JSON.stringify(req.session.id));
});

router.post('/auth/registration', function(req,res,next) {
    console.log('req body: ' + JSON.stringify(req.body));

    AccountPromise.register(req.body)
    .then((user)=>{
        res.json(user.username)})
    .catch((err)=>{res.json(err)}); 
});

router.post('/auth/confirmUser', function(req,res,next) {
    console.log('in confirmUser callback');
    console.log('req body: ' + JSON.stringify(req.body));


    AccountPromise.confirmReg(req.body)
    .then((user)=>{res.json('SUCCESS')})
    .catch((err)=>{res.json(err)});
});

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/ping', (req, res) => {
    res.status(200).send("pong!");
});

router.get('/devicelist', (req, res) => {
    Device.getMyDevices()
    .then((deviceArray)=>{

    })
    .catch((err)=> {

    });

});


router.get('/device/:id', (req, res, next) => {
    console.log('req.params: ' + JSON.stringify(req.params)); 
    console.log('req.user.username: ' + JSON.stringify(req.user.Username));

    Device.getbyId(req.params.id, req.user.Username,
        function(data) {
            console.log('success callback get by id: ' + JSON.stringify(data)); 
            return res.json(data); 
        },
        function (err) {
            console.log('error callback get by id: ' + JSON.stringify(err)); 
            return res.json(data);
        });
});

module.exports = router;
