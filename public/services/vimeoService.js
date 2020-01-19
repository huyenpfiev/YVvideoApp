myApp.factory('vimeoService', ['$http', 'userService', function ($http, $userService) {
    var serv = {};

    serv.getVimeoData = function (searchText, pageNbr, callback) {
        $http.post('/vimeo/getVimeoData', { searchText: searchText, pageNbr:pageNbr }).then(function (resp) {
            callback(resp.data);
        }, function (res) {
            console.log("ERROR = " + res.data.errorSet);
        });
    };
    serv.addToHistory = function (searchText, user, callback) {
        $http.post('/vimeo/addToHistory', { token: $userService.getToken(), searchText: searchText, user: user }).then(function (resp) {
            callback(resp.data);
        }, function (res) {
            console.log("ERROR = " + res.data.errorSet);
        });
    };
    serv.getHistorySet = function (cb) {
        $http.post('/vimeo/getHistorySet', { token: $userService.getToken() }).then(function (resp) {
            cb(resp.data.historySet);
        }, function (res) {
            console.log("ERROR = " + res.data.errorSet);
        })
    };
    serv.showUserHistory = function (user, cb) {
        $http.post('/vimeo/showUserHistory', { user: user }).then(function (resp) {
            cb(resp.data.historySet);
        }, function (res) {
            console.log("ERROR = " + res.data.errorSet);
        })
    };

    return serv;
}]);
