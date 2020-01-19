myApp.factory('youtubeService', ['$http', 'userService', function ($http, $userService) {
    var serv = {};

    serv.getYoutubeData = function (searchText, pageToken, callback) {
        $http.post('/youtube/getYoutubeData', { searchText: searchText, pageToken:pageToken }).then(function (resp) {
            callback(resp.data);
        }, function (res) {
            console.log("ERROR = " + res.data.errorSet);
        });
    };
    serv.getVideosInfo = function (videoId, callback) {
        $http.post('/youtube/getVideosInfo', { videoId: videoId }).then(function (resp) {
            callback(resp.data);
        }, function (res) {
            console.log("ERROR = " + res.data.errorSet);
        });
    };
    serv.addToHistory = function (searchText, user, callback) {
        $http.post('/youtube/addToHistory', { token: $userService.getToken(), searchText: searchText, user: user }).then(function (resp) {
            callback(resp.data);
        }, function (res) {
            console.log("ERROR = " + res.data.errorSet);
        });
    };
    serv.getHistorySet = function (cb) {
        $http.post('/youtube/getHistorySet', { token: $userService.getToken() }).then(function (resp) {
            cb(resp.data.historySet);
        }, function (res) {
            console.log("ERROR = " + res.data.errorSet);
        })
    };
    serv.showUserHistory = function (user, cb) {
        $http.post('/youtube/showUserHistory', { user: user }).then(function (resp) {
            cb(resp.data.historySet);
        }, function (res) {
            console.log("ERROR = " + res.data.errorSet);
        })
    };
    serv.addVideo=function(info,playlistId,cb){
        
        var obj={
            videoId:info.id.videoId,
            title:info.snippet.title,
            url:info.snippet.thumbnails.default.url,
            playlistId:playlistId
        }
        $http.post('/users/addVideo',obj).then(function(resp){
            cb(resp.data);
        })
    }
    return serv;
}]);
