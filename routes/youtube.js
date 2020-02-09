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
        uri: 'https://localhost:3001/getYoutubeData',
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
router.post('/getYtVideosInfo', function(req, res, next) {
    var formData = JSON.stringify(req.body);
    var contentLength = formData.length;
    console.log('youtube.js > ' , formData);
    var options = {
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/json'
        },
        uri: 'https://localhost:3001/getYtVideosInfo',
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
router.post('/addToYtHistory', function(req, res, next) {
    var formData = JSON.stringify(req.body);
    var contentLength = formData.length;
    console.log('youtube.js > ' , formData);
    var options = {
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/json'
        },
        uri: 'https://localhost:3001/addToYtHistory',
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
router.post('/getYtHistorySet', function(req, res, next) {
    var formData = JSON.stringify(req.body);
    var contentLength = formData.length;
    console.log('youtube.js > ' , formData);
    var options = {
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/json'
        },
        uri: 'https://localhost:3001/getYtHistorySet',
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
