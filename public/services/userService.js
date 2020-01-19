myApp.factory('userService', ['$http', '$state', '$rootScope', function ($http, $state, $rootScope) {
    var serv = {};

    serv.register = function (user, callback) {
        $http.post('/users/register', { user: user }).then(function (resp) {
            callback(resp.data);
        }, function (res) {
            console.log("ERROR = " + res.data.errorSet);
        });
    };

    serv.login = function (user, callback) {
        $http.post('/users/login', { user: user }).then(function (resp) {
            callback(resp.data);
        }, function (res) {
            console.log("ERROR = " + res.data.errorSet);
        });
    };

    serv.isLogged = function (callback) {
        if (serv.hasToken()) {
            var token = localStorage.getItem('token');
            $http.post('/users/isLogged', { token: token }).then(function (resp) {
                var obj = {
                    isAuth: resp.data.success,
                    user: resp.data.user
                }
                callback(obj);
            }, function (res) {  
                console.log("ERROR = " + res.data.errorSet);
            });
        }
    }
    serv.getUserSet = function (callback) {
        if (serv.hasToken()) {
            var token = localStorage.getItem('token');
            $http.post('/users/getUserSet', { token: token }).then(function (resp) {
                callback(resp.data.users);
            }, function (res) {
                console.log("ERROR = " + res.data.errorSet);
            });
        }
    }

    serv.updateUser = function (user, callback) {
        $http.post('/users/updateUser', { user: user }).then(function (resp) {
            callback(resp.data);
        }, function (res) {
            console.log("ERROR = " + res.data.errorSet);
        });
    };
    serv.hasToken = function () {
        if (localStorage.getItem('token') == null) {
            return false;
        }
        else {
            return true;
        }
    }

    serv.getToken = function () {
        return localStorage.getItem('token');
    }

    serv.removeToken = function () {
        localStorage.removeItem('token');
    }

    serv.storeToken = function (token) {
        localStorage.setItem('token', token);
    }

    serv.logout = function () {
        serv.removeToken();
        $rootScope.$broadcast('userUnload');
        $state.go('home');
    }
    serv.createPlaylist=function(newPlaylist,user,cb){
        
        $http.post('/users/createPlaylist', { name: newPlaylist,userEmail:user.email }).then(function (resp) {
           
            cb(resp.data);

        },function (res) {
            console.log("ERROR = " + res.data.errorSet);
        });
    }
    serv.getPlaylistSet=function(user,cb){
        $http.post('/users/getPlaylistSet', { userEmail:user.email }).then(function (resp) {
          
            cb(resp.data);

        });
    }
    serv.deletePlaylist=function(id,user,cb){
        $http.post('/users/deletePlaylist',{id:id,userEmail:user.email}).then(function(resp){
            cb(resp.data);
        })
    }
    serv.getVideoSet=function(plId,cb){
        
        $http.post('/users/getVideoSet',{playlistId:plId}).then(function(resp){
            cb(resp.data);
        })
    }
    serv.removeVideo=function(video,cb){
        $http.post('/users/removeVideo',video).then(function(resp){
            cb(resp.data);
        })
    }
    return serv;
}]);
