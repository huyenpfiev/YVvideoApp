var express = require('express');
var router = express.Router();
var request = require('request');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/isLogged', function(req, res, next) {
    var formData = JSON.stringify(req.body);
    var contentLength = formData.length;
    request({
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/json'
        }, 
        uri: 'https://localhost:3001/isLogged',
        body:  formData,
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
    }, function (error, resu, body) {
        if(error)console.log('Erreur : dans users.js ' + error);
        res.send(body);
    });
});
router.post('/register', function(req, res, next) {
    var formData = JSON.stringify(req.body);
    var contentLength = formData.length;

    request({
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/json'
        },
        uri: 'https://localhost:3001/register',
        body:  formData,
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
    }, function (err, resu, body) {
        res.send(body);
    });
});
router.post('/login', function(req, res, next) {
    var formData = JSON.stringify(req.body);
    var contentLength = formData.length;

    request({
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/json'
        },
        uri: 'https://localhost:3001/login',
        body:  formData,
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
    }, function (err, resu, body) {
        res.send(body);
    });
});
router.post('/getUserSet', function(req, res, next) {
    var formData = JSON.stringify(req.body);
    var contentLength = formData.length;
    request({
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/json'
        },
        uri: 'https://localhost:3001/getUserSet',
        body:  formData,
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
    }, function (error, resu, body) {
        if(error)console.log('Erreur : dans users.js ' + error);
        res.send(body);
    });
});
router.post('/updateUser', function(req, res, next) {
    var formData = JSON.stringify(req.body);
    var contentLength = formData.length;

    request({
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/json'
        },
        uri: 'https://localhost:3001/updateUser',
        body:  formData,
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
    }, function (error, resu, body) {
        if(error)console.log('Erreur : dans users.js ' + error);
        res.send(body);
    });
});
router.post('/createPlaylist', function(req, res, next) {
    var formData = JSON.stringify(req.body);
    var contentLength = formData.length;

    request({
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/json'
        },
        uri: 'https://localhost:3001/createPlaylist',
        body:  formData,
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
    }, function (error, resu, body) {
        if(error) console.log('Erreur : dans users.js ' + error);
        res.send(body);
    });
});
router.post('/getPlaylistSet', function(req, res, next) {
    var formData = JSON.stringify(req.body);
    var contentLength = formData.length;

    request({
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/json'
        },
        uri: 'https://localhost:3001/getPlaylistSet',
        body:  formData,
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
    }, function (error, resu, body) {
        if(error) console.log('Erreur : dans users.js ' + error);
        res.send(body);
    });
});
router.post('/deletePlaylist', function(req, res, next) {
    var formData = JSON.stringify(req.body);
    var contentLength = formData.length;

    request({
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/json'
        },
        uri: 'https://localhost:3001/deletePlaylist',
        body:  formData,
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
    }, function (error, resu, body) {
        if(error) console.log('Erreur : dans users.js ' + error);
        res.send(body);
    });
});
router.post('/addVideo', function(req, res, next) {
    var formData = JSON.stringify(req.body);
    var contentLength = formData.length;
    
    request({
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/json'
        },
        uri: 'https://localhost:3001/addVideo',
        body:  formData,
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
    }, function (error, resu, body) {
        if(error) console.log('Erreur : dans users.js ' + error);
        res.send(body);
    });
});
router.post('/getVideoSet', function(req, res, next) {
    var formData = JSON.stringify(req.body);
    var contentLength = formData.length;
    
    request({
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/json'
        },
        uri: 'https://localhost:3001/getVideoSet',
        body:  formData,
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
    }, function (error, resu, body) {
        if(error) console.log('Erreur : dans users.js ' + error);
        res.send(body);
    });
});
router.post('/removeVideo', function(req, res, next) {
    var formData = JSON.stringify(req.body);
    var contentLength = formData.length;
    
    request({
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/json'
        },
        uri: 'https://localhost:3001/removeVideo',
        body:  formData,
        method: 'POST',
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
    }, function (error, resu, body) {
        if(error) console.log('Erreur : dans users.js ' + error);
        res.send(body);
    });
});
module.exports = router;
