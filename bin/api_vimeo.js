var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var https = require('https');
var fs = require("fs");
var request = require('request');
var jwt = require('jsonwebtoken');
var vimeoLayer = require('../public/dao/VimeoDao');

var _access_token = '4f9372ee96fe094b1179d1b128845d2b';//'f82a8d54b661e5c61fde6317e74b5c1a';
var secret = 'd034e2a12cfeb6bea9d01e88f1192be8a02d193a';

var app = express();
var port = normalizePort(process.env.PORT || '3003');

function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}

var options = {
    key: fs.readFileSync('../SSL/privatekey.pem'),
    cert: fs.readFileSync('../SSL/certificate.pem')
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    res.setHeader('Access-Control-Allow-Credentials', true);

    //console.log('Request URL> ' + req.method + " : " + req.headers.host + req.url);

    next();
});

/* La partie VIMEO */
app.get('/', function (req, res) {
    res.send('Hello FOM VIMEO API')
});

app.post('/getVimeoData', function (req, res) {
    var searchText = req.body.searchText;
    var pageNbr = req.body.pageNbr;
    //console.log('searched text : ' + searchText);

    function callback(error, response, body) {
        var objectValue = JSON.parse(response.body);
        res.send(objectValue);
    };

    var url = "https://api.vimeo.com/videos?query='" + searchText + "'";

    request({url: url,
        qs:{ access_token: _access_token,
            per_page:12,
            page:pageNbr
        }
    }, callback);

});
app.post('/addToHistory', function (req, res) {
    var searchText = req.body.searchText;
    //var user = req.body.user;


    if (!searchText) {
        res.send({
            success: false,
            errorSet: ['VALUE_EMPTY']
        });
    }
    else {
        jwt.verify(req.body.token, secret, function (err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    errorSet: ['INVALID_TOKEN']
                });
            }
            else {
                //console.log('current user : ' + decoded.user.email);
                vimeoLayer.addToHistory(decoded.user, searchText, function () {
                    var obj = {
                        success: true
                    }
                    res.send(obj);
                });
            }
        });
    }
});
app.post('/getHistorySet', function (req, res) {
    if (!req.body.token) {
        res.send({
            success: false,
            errorSet: ['NO_TOKEN']
        });
    }
    else {
        jwt.verify(req.body.token, secret, function (err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    errorSet: ['INVALID_TOKEN']
                });
            }
            else {
                vimeoLayer.getHistorySet(decoded.user, function (historySet) {
                    var obj = {
                        success: true,
                        historySet: historySet
                    }

                    res.send(obj);
                });
            }
        });
    }
});
app.post('/showUserHistory', function (req, res) {
    var user = req.body.user;
    if (!user) {
        res.send({
            success: false,
            errorSet: ['USER_EMPTY']
        });
    }
    else {
        var errorSet = [];
        if (!user.userfirstname || !user.userlastname || !user.email) {
            errorSet.push('CHAMP_VIDE');
        }
        if (errorSet.length == 0) {
            vimeoLayer.getHistorySet(user, function (historySet) {
                var obj = {
                    success: true,
                    historySet: historySet
                }

                res.send(obj);
            });
        }
    }
});
https.createServer(options, app).listen(port);
console.log("API Vimeo started on port :" + port);