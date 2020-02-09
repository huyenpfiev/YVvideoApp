var express = require('express');
var path = require('path');
var https = require('https');
var fs = require("fs");
var request = require('request');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var logger = require('morgan');
var DB_Layer = require('../public/DB/DbLayer');

var secret = 'd034e2a12cfeb6bea9d01e88f1192be8a02d193a';
var Vimeo_access_token = '4f9372ee96fe094b1179d1b128845d2b';
var API_KEY = "AIzaSyAUw42AeuY-PnJvVLs8npnDamZffK8xCt4";

var app = express();
var port = normalizePort(process.env.PORT || '3001');

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

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

var options = {
    key: fs.readFileSync('../SSL/privatekey.pem'),
    cert: fs.readFileSync('../SSL/certificate.pem')
};

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

/* La partie utilisateurs */

app.post('/register', function (req, res) {
    var user = req.body.user;
    
    if (!user) {
        res.send({
            success: false,
            errorSet: ['USER_EMPTY']
        });
    }
    else {
        var errorSet = [];
        if (!user.userfirstname || !user.userlastname || !user.email || !user.password || !user.confirmPassword) {
            errorSet.push('CHAMP_VIDE');
        }else if (user.password != user.confirmPassword) {
            errorSet.push('PASSWORD_DIFFERENT');
        }
        if (errorSet.length == 0) {
            DB_Layer.getUser(user, function (result) {
                if (result.length > 0) {
                    res.send({
                        success: false,
                        errorSet: ['USER_ALREADY_EXIST']
                    });
                }
                else {
                    DB_Layer.register(user, function () {
                        var obj = {
                            success: true,
                        }

                        res.send(obj);
                    });
                }
            });
        }
        else {
            res.send({
                success: false,
                errorSet: errorSet
            });
        }
    }
});

app.post('/login', function (req, res) {
    var user = req.body.user;

    DB_Layer.login(user, function (result) {
        if (!result) {

            var obj = {
                success: false,
                errorSet: ['LOGIN_FAIL'],
            }
        }
        else {
            const payload = {
                id: result._id,
                user: {
                    userfirstname: result.userfirstname,
                    userlastname: result.userlastname,
                    email: result.email,
                }
            };

            var token = jwt.sign(payload, secret, {
                expiresIn: "7 days"
            });

            var obj = {
                success: true,
                token: token,
                user: payload.user
            }
        }
        res.send(obj);
    })
});

app.post('/isLogged', function (req, res) {
    if (req.body.token) {
        jwt.verify(req.body.token, secret, function (err, decoded) {
            if (err) {
                res.json({
                    success: false,
                    errorSet: ['INVALID_TOKEN']
                });
            }
            else {
                var obj = {
                    success: true,
                    user: decoded.user
                }

                res.send(obj);
            }
        });
    }
    else {
        var obj = {
            success: false,
            errorSet: ['NOT_LOGGED']
        }
        res.send(obj);
    }
});
app.post('/getUserSet', function (req, res) {
    
    if (req.body.token) {
        jwt.verify(req.body.token, secret, function (err, decoded) {
            if (err) {
                res.json({
                    success: false,
                    errorSet: ['INVALID_TOKEN']
                });
            }
            else {
                var user = decoded.user;
                DB_Layer.getUser(user, function (result) {
                    if (result.length < 0) {
                        res.send({
                            success: false,
                            errorSet: ['INVALID_TOKEN']
                        });
                    }
                    else {

                        if(result[0].role ==='admin'){
                            DB_Layer.getUserSet(function (result) {
                                if (!result) {

                                    var obj = {
                                        success: false,
                                        errorSet: ['USERS_SET_EMPTY'],
                                    }
                                }
                                else {
                                    var userMap = {};

                                    result.forEach(function(user) {
                                        userMap[user.email] = user;
                                    });
                                    var obj = {
                                        success: true,
                                        users: userMap
                                    }
                                    res.send(obj);
                                }
                            })
                        }
                        else{
                            var obj = {
                                success: false,
                                errorSet: ['USERS_MUST_BE_ADMIN'],
                            }
                            res.send(obj);
                        }
                    }
                });
            }
        });
    }
    else {
        var obj = {
            success: false,
            errorSet: ['NOT_LOGGED']
        }
        res.send(obj);
    }
});
app.post('/updateUser', function (req, res) {
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
            DB_Layer.getUser(user, function (result) {
                if (result.length === 0) {
                    res.send({
                        success: false,
                        errorSet: ['USER_NOT_FOUND']
                    });
                }
                else {
                    result[0].role = (result[0].role === 'admin') ?  'user' : 'admin';

                    DB_Layer.updateUser(result[0], function(){
                        res.send({ success:true });
                    });
                }
            });
        }
        else {
            res.send({
                success: false,
                errorSet: errorSet
            });
        }
    }
});
app.post('/createPlaylist',function(req,res){
    var name=req.body.name;
    var userEmail=req.body.userEmail;
    
    DB_Layer.getPlaylistName(name,userEmail,function(result){
        if(result){
            res.send({
                success:false,
                errorSet:['PLAYLIST_ALREADY_EXIST']
            })
        }
        else{
            DB_Layer.createPlaylist(name,userEmail,function(){
                DB_Layer.getPlaylistSet(userEmail,function(result){

                        res.send({
                            success:true,
                            playlistSet:result
                        })
                    
                })
            })
        }
    });
});
app.post('/getPlaylistSet',function(req,res){
    var userEmail=req.body.userEmail;
    DB_Layer.getPlaylistSet(userEmail,function(result){
        res.send({
            success:true,
            playlistSet:result
        })
    })
});
app.post('/deletePlaylist',function(req,res){
    var id=req.body.id;
    var userEmail=req.body.userEmail;
    DB_Layer.deletePlaylist(id,function(result){
        DB_Layer.getPlaylistSet(userEmail,function(result){
            res.send({
                success:true,
                playlistSet:result
            })
        })
    })
})
app.post('/addVideo',function(req,res){
    var videoId=req.body.videoId;
    var playlistId=req.body.playlistId;
   
    DB_Layer.findVideo(videoId,playlistId,function(result){
        if(result){
            res.send({
                success:false,
                error:['VIDEO_ALREADY_ADDED']
            })
        }
            
        else{
            DB_Layer.addVideo(req.body,function(result){
                res.send({
                    success:true,
                    res:['ADD_VIDEO_SUCCESS']
                })
            })
        }
    })
})
app.post('/getVideoSet',function(req,res){
  
    var playlistId=req.body.playlistId;
    DB_Layer.getVideoSet(playlistId,function(result){
        res.send({
            success:true,
            videoSet:result
        })
    })
})
app.post('/removeVideo',function(req,res){
    var video=req.body;
   
    DB_Layer.removeVideo(video,function(result){
        DB_Layer.getVideoSet(req.body.playlistId,function(re){
            res.send({
                success:true,
                videoSet:re
    
            })
        })
        
    })
});
//========================Youtube=================
app.post('/getYoutubeData', function (req, res) {
    var searchText = req.body.searchText;
    var pageToken = req.body.pageToken;
    

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
app.post('/getYtVideosInfo', function (req, res) {
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

app.post('/addToYtHistory', function (req, res) {
    var searchText = req.body.searchText;
 
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
             
                DB_Layer.addToYoutubeHistory(decoded.user, searchText, function () {
                    var obj = {
                        success: true
                    }
                    res.send(obj);
                });
            }
        });
    }
});
app.post('/getYtHistorySet', function (req, res) {
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
                DB_Layer.getYoutubeHistorySet(decoded.user, function (historySet) {
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
//==========================Vimeo=================
app.post('/getVimeoData', function (req, res) {
    var searchText = req.body.searchText;
    var pageNbr = req.body.pageNbr;
    
    function callback(error, response, body) {
        var objectValue = JSON.parse(response.body);
        res.send(objectValue);
    };

    var url = "https://api.vimeo.com/videos?query='" + searchText + "'";

    request({url: url,
        qs:{ access_token: Vimeo_access_token,
            per_page:12,
            page:pageNbr
        }
    }, callback);

});
app.post('/addToVimeoHistory', function (req, res) {
    var searchText = req.body.searchText;
  
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
                
                DB_Layer.addToVimeoHistory(decoded.user, searchText, function () {
                    var obj = {
                        success: true
                    }
                    res.send(obj);
                });
            }
        });
    }
});
app.post('/getVimeoHistorySet', function (req, res) {
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
                DB_Layer.getVimeoHistorySet(decoded.user, function (historySet) {
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
https.createServer(options, app).listen(port);
console.log("API started on port :" + port);