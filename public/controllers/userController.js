myApp.controller('userController', ['$scope', 'userService', 'youtubeService',
'vimeoService', '$state', '$rootScope', 'Notification', 'tradService', 
function ($scope, $userService, $youtubeService, 
$vimeoService, $state, $rootScope, Notification, $tradService) {
    //========
    $scope.user = {};

    $scope.isLogged = false;
    $scope.newPlaylist="";
    $scope.plName="";

    $rootScope.$on('userLoad', function (event, opt) {
        $scope.user = opt.user;
        $scope.isLogged = opt.isLogged;
    });

    $rootScope.$on('userUnload', function (event, opt) {
        $scope.user = {};
        $scope.isLogged = false;
    });

    // Trigger when scope is loaded
    $scope.$on('$viewContentLoaded', function (event) {
        $userService.isLogged(function (resp) {
            $rootScope.$broadcast('userLoad', { user: resp.user, isLogged: resp.isAuth });
            $userService.getPlaylistSet($scope.user,function(res){
                $scope.playlistSet=res.playlistSet;
            });
        });
        
    });

    $scope.userLogged = function () {
        $userService.isLogged(function (resp) {
            $scope.user = resp.user;

            $scope.isLogged = resp.isAuth;
            $rootScope.$broadcast('userLoad', { user: $scope.user });
        });
    }

    $scope.register = function () {
        $userService.register($scope.user, function (res) {
            if (res.success) {
                $state.go('login');
                Notification.success({ message: $tradService.get('user', 'USER_CREATE_SUCCESS') });
            }
            else {
                res.errorSet.forEach(element => {
                    Notification.error({ message: $tradService.get('user', element) });
                });
            }
        });
    }

    $scope.login = function () {
        $userService.login($scope.user, function (res) {
            if (res.success == true) {
                $scope.user = res.user;
                // Update navbar
                $rootScope.$broadcast('userLoad', { user: $scope.user, isLogged: true });

                // Store login token
                $userService.storeToken(res.token);

                $state.go('youtube');
                Notification.success({ message: $tradService.get('user', 'LOGIN_SUCCESS') });
            }
            else {
                res.errorSet.forEach(element => {
                    Notification.error({ message: $tradService.get('user', element) });
                });
            }
        });
    };
    $scope.$on('$viewContentLoaded', function(event) {
        //console.log('user set loaded');
        $userService.getUserSet(function(res){
            $scope.userSet = res;
        });
       
    });

    $scope.updateUser = function(user){
        $userService.updateUser(user, function (res) {
            if (res.success == true) {
                Notification.success({ message: $tradService.get('user', 'USER_UPDATED') });
            }
        });
    };
    $scope.showUserHistory = function(user){
        $youtubeService.showUserHistory(user, function(res){
            $scope.userYoutubeHistorySet = res;
        });
        $vimeoService.showUserHistory(user, function(res){
            $scope.userYimeoHistorySet = res;
        });
    };
    $scope.createPlaylist=function(newPlaylist){
        
        $userService.createPlaylist(newPlaylist,$scope.user,function(res){
            if (res.success) {
                $scope.playlistSet=res.playlistSet;
                $scope.newPlaylist="";
            }
            else {
               
                Notification.error({ message: $tradService.get('user', res.errorSet) });
               
            }
        });
    };
    $scope.deletePlaylist=function(id){
        $userService.deletePlaylist(id,$scope.user,function(res){
            $scope.playlistSet=res.playlistSet;
            $scope.videoSet=[];
            $scope.plName="";
        })
    }
    $scope.getVideoSet=function(plId,plName){
        $scope.plName=plName;
        $userService.getVideoSet(plId,function(res){
            $scope.videoSet=res.videoSet;
        })
    }
    $('#videoPlayer').on('show.bs.modal', function (e) {
        var bookId = $(e.relatedTarget).data('book-id');
        document.getElementById('videoId').src = 'https://www.youtube.com/embed/' + bookId.videoId;
        $scope.videoInfos=bookId;
    });
    $('#videoPlayer').on('hidden.bs.modal', function () {
        document.getElementById('videoId').src = "about:blank";
    });
    $scope.removeVideo=function(){
        $userService.removeVideo($scope.videoInfos,function(res){
            if(res.success){
                $scope.videoSet=res.videoSet;
                Notification.success({ message: $tradService.get('user', ['REMOVE_VIDEO_SUCCESS']) });
            }
            
        });
    }
    $scope.userLogged();
}]);