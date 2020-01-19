var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var https = require('https');
var request = require('request');
var fs = require("fs");
var jwt = require('jsonwebtoken');
var youtubeLayer = require('../public/dao/YoutubeDao');

var API_KEY = "AIzaSyAUw42AeuY-PnJvVLs8npnDamZffK8xCt4";
var secret = 'd034e2a12cfeb6bea9d01e88f1192be8a02d193a';

var app = express();
var port = normalizePort(process.env.PORT || '3002');

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

    console.log('Request URL> ' + req.method + " : " + req.headers.host + req.url);

    next();
});

/* La partie youtube */
app.get('/', function (req, res) {
    res.send('Hello FOM YOUTUBE API')
});

app.post('/getYoutubeData', function (req, res) {
    var searchText = req.body.searchText;
    var pageToken = req.body.pageToken;
    //console.log('searched text : ' + searchText);

    function callback(error, response, body) {
        var objectValue = JSON.parse(response.body);
        res.send(objectValue);
    };
    request({url: "https://www.googleapis.com/youtube/v3/search",
        qs:{ part: "id,snippet",
            key: API_KEY,
            type: 'video',
            maxResults: '12',
            pageToken: pageToken,
            fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle,nextPageToken,prevPageToken',
            q: searchText
        }
    }, callback);

});
app.post('/getVideosInfo', function (req, res) {
    var id = req.body.videoId;

    function callback(error, response, body) {
        var objectValue = JSON.parse(body);
        var likeCount='';
        var channelId='';
        var duration='';
        if ((typeof objectValue.items[0] !== "undefined") && objectValue.items[0].status.privacyStatus === "public" && (typeof objectValue.items[0].snippet.thumbnails !== "undefined")) {
            duration = objectValue.items[0].contentDetails.duration;
            var H = duration.substr(duration.indexOf("PT") + 2, duration.indexOf("H") - duration.indexOf("PT") - 2);

            var M = duration.substr(duration.indexOf("H") + 1, duration.indexOf("M") - duration.indexOf("H") - 1);
            var S = duration.substr(duration.indexOf("M") + 1, duration.indexOf("S") - duration.indexOf("M") - 1);
            duration = '';
            if (H !== '') duration = duration + H + ':';
            if (M !== '') duration = duration + M + ':';
            if (S !== '') duration = duration + S;
            duration = duration.replace("PT", "");
            likeCount = objectValue.items[0].statistics.likeCount;
            channelId = objectValue.items[0].snippet.channelId;
        }
        res.send({
            duration:duration,
            likeCount:likeCount,
            channelId:channelId
        });
    };
    request('https://www.googleapis.com/youtube/v3/videos?id=' + id + '&key=' + API_KEY + '&part=snippet,contentDetails,statistics,status', callback);
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
                youtubeLayer.addToHistory(decoded.user, searchText, function () {
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
                youtubeLayer.getHistorySet(decoded.user, function (historySet) {
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
            youtubeLayer.getHistorySet(user, function (historySet) {
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
console.log("API Youtube started on port :" + port);