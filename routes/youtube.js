var express = require('express');
var router = express.Router();
var request = require('request');


/* GET youtube listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/getYoutubeData', function(req, res, next) {
    var formData = JSON.stringify(req.body);
    var contentLength = formData.length;
    console.log('youtube.js > ' , formData);
    var options = {
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/json'
        },
        uri: 'https://localhost:3002/getYoutubeData',
        method: 'POST',
        body:  formData,
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
    };
    function callback(error, response, body) {
        if(error)console.log('Erreur : dans Youtube.js ' + error);
        res.send(body);
    }
    request(options, callback);
});
router.post('/getVideosInfo', function(req, res, next) {
    var formData = JSON.stringify(req.body);
    var contentLength = formData.length;
    console.log('youtube.js > ' , formData);
    var options = {
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/json'
        },
        uri: 'https://localhost:3002/getVideosInfo',
        method: 'POST',
        body:  formData,
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
    };
    function callback(error, response, body) {
        if(error)console.log('Erreur : dans Youtube.js ' + error);
        res.send(body);
    }
    request(options, callback);
});
router.post('/addToHistory', function(req, res, next) {
    var formData = JSON.stringify(req.body);
    var contentLength = formData.length;
    console.log('youtube.js > ' , formData);
    var options = {
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/json'
        },
        uri: 'https://localhost:3002/addToHistory',
        method: 'POST',
        body:  formData,
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
    };
    function callback(error, response, body) {
        if(error)console.log('Erreur : dans Youtube.js ' + error);
        res.send(body);
    }
    request(options, callback);
});
router.post('/getHistorySet', function(req, res, next) {
    var formData = JSON.stringify(req.body);
    var contentLength = formData.length;
    console.log('youtube.js > ' , formData);
    var options = {
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/json'
        },
        uri: 'https://localhost:3002/getHistorySet',
        method: 'POST',
        body:  formData,
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
    };
    function callback(error, response, body) {
        if(error)console.log('Erreur : dans Youtube.js ' + error);
        res.send(body);
    }
    request(options, callback);
});
router.post('/showUserHistory', function(req, res, next) {
    var formData = JSON.stringify(req.body);
    var contentLength = formData.length;
    console.log('youtube.js > ' , formData);
    var options = {
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/json'
        },
        uri: 'https://localhost:3002/showUserHistory',
        method: 'POST',
        body:  formData,
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
    };
    function callback(error, response, body) {
        if(error)console.log('Erreur : dans Youtube.js ' + error);
        res.send(body);
    }
    request(options, callback);
});

module.exports = router;
