var express = require('express');
var path = require('path');
var https = require('https');
var fs = require("fs");
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var logger = require('morgan');
var usersLayer = require('../public/dao/UserDao');

var secret = 'd034e2a12cfeb6bea9d01e88f1192be8a02d193a';

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
            usersLayer.getUser(user, function (result) {
                if (result.length > 0) {
                    res.send({
                        success: false,
                        errorSet: ['USER_ALREADY_EXIST']
                    });
                }
                else {
                    usersLayer.register(user, function () {
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

    usersLayer.login(user, function (result) {
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
                usersLayer.getUser(user, function (result) {
                    if (result.length < 0) {
                        res.send({
                            success: false,
                            errorSet: ['INVALID_TOKEN']
                        });
                    }
                    else {

                        if(result[0].role ==='admin'){
                            usersLayer.getUserSet(function (result) {
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
            usersLayer.getUser(user, function (result) {
                if (result.length === 0) {
                    res.send({
                        success: false,
                        errorSet: ['USER_NOT_FOUND']
                    });
                }
                else {
                    result[0].role = (result[0].role === 'admin') ?  'user' : 'admin';

                    usersLayer.updateUser(result[0], function(){
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
    
    usersLayer.getPlaylistName(name,userEmail,function(result){
        if(result){
            res.send({
                success:false,
                errorSet:['PLAYLIST_ALREADY_EXIST']
            })
        }
        else{
            usersLayer.createPlaylist(name,userEmail,function(){
                usersLayer.getPlaylistSet(userEmail,function(result){

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
    usersLayer.getPlaylistSet(userEmail,function(result){
        res.send({
            success:true,
            playlistSet:result
        })
    })
});
app.post('/deletePlaylist',function(req,res){
    var id=req.body.id;
    var userEmail=req.body.userEmail;
    usersLayer.deletePlaylist(id,function(result){
        usersLayer.getPlaylistSet(userEmail,function(result){
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
   
    usersLayer.findVideo(videoId,playlistId,function(result){
        if(result){
            res.send({
                success:false,
                error:['VIDEO_ALREADY_ADDED']
            })
        }
            
        else{
            usersLayer.addVideo(req.body,function(result){
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
    usersLayer.getVideoSet(playlistId,function(result){
        res.send({
            success:true,
            videoSet:result
        })
    })
})
app.post('/removeVideo',function(req,res){
    var video=req.body;
   
    usersLayer.removeVideo(video,function(result){
        usersLayer.getVideoSet(req.body.playlistId,function(re){
            res.send({
                success:true,
                videoSet:re
    
            })
        })
        
    })
})
https.createServer(options, app).listen(port);
console.log("API user started on port :" + port);