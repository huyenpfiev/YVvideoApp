var express = require('express');
var router = express.Router();
var request = require('request');


/* GET youtube listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/getVimeoData', function(req, res, next) {
    var formData = JSON.stringify(req.body);
    var contentLength = formData.length;
    console.log('vimeo.js > ' , formData);
    var options = {
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/json'
        },
        uri: 'https://localhost:3001/getVimeoData',
        method: 'POST',
        body:  formData,
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
    };
    function callback(error, response, body) {
        if(error)console.log('Erreur : dans vimeo.js ' + error);
        res.send(body);
    }
    request(options, callback);
});
router.post('/addToVimeoHistory', function(req, res, next) {
    var formData = JSON.stringify(req.body);
    var contentLength = formData.length;
    console.log('vimeo.js > ' , formData);
    var options = {
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/json'
        },
        uri: 'https://localhost:3001/addToVimeoHistory',
        method: 'POST',
        body:  formData,
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
    };
    function callback(error, response, body) {
        if(error)console.log('Erreur : dans vimeo.js ' + error);
        res.send(body);
    }
    request(options, callback);
});
router.post('/getVimeoHistorySet', function(req, res, next) {
    var formData = JSON.stringify(req.body);
    var contentLength = formData.length;
    console.log('vimeo.js > ' , formData);
    var options = {
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/json'
        },
        uri: 'https://localhost:3001/getVimeoHistorySet',
        method: 'POST',
        body:  formData,
        rejectUnauthorized: false,
        requestCert: true,
        agent: false
    };
    function callback(error, response, body) {
        if(error)console.log('Erreur : dans vimeo.js ' + error);
        res.send(body);
    }
    request(options, callback);
});



module.exports = router;
