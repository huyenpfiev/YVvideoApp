var myApp = angular.module('videoApp', ['ui.router', 'ui-notification']);

myApp.config(function ($stateProvider){
    //$urlRouterProvider.otherwise("home");
    var homeState = {
        name : 'home',
        url: '/home',
        templateUrl: 'home.html'
    };
    var indexState = {
        name : 'index',
        url: '/',
        templateUrl: 'index.html',
        controller: "userController"
    };
    var youtube = {
        name : 'youtube',
        url:'/youtube',
        authenticate: false,
        templateUrl: 'youtube.html',
        controller: 'youtubeController'
    };
    var vimeo = {
        name : 'vimeo',
        authenticate: false,
        templateUrl: 'vimeo.html',
        controller: 'vimeoController'
    };
    var history = {
        name : 'history',
        authenticate: true,
        templateUrl: 'showHistory.html',
        controller: 'youtubeController'
    };
    var login = {
        name : 'login',
        url:'/login',
        authenticate: false,
        templateUrl: 'login.html',
        controller: 'userController'
    };
    var signup = {
        name : 'signup',
        authenticate: false,
        templateUrl: 'signup.html',
        controller: 'userController'
    };
    var playlist = {
        name : 'playlist',
        authenticate: true,
        templateUrl: 'playlist.html',
        controller: 'userController'
    };
    var logoutState = {
        name: 'logout',
        url: '/logout',
        authenticate: false,
        templateUrl: '<ui-view/>',
        resolve: {
            logout: function (userService, Notification, tradService) {
                Notification.success({ message: tradService.get('user', 'USER_LOGOUT') });
                return userService.logout();
            }
        }
    };

     var otherwise = {
        name : '404',
         url: "*path",
        authenticate: false,
        templateUrl : '404.html',
    };

    $stateProvider.state(homeState);
    $stateProvider.state(indexState);
    $stateProvider.state(youtube);
    $stateProvider.state(vimeo);
    $stateProvider.state(logoutState);
    $stateProvider.state(history);
    $stateProvider.state(login);
    $stateProvider.state(signup);
    $stateProvider.state(playlist);

    //$stateProvider.state(otherwise);

});
// Notification module setting
myApp.config(function (NotificationProvider) {
    NotificationProvider.setOptions({
        delay: 5000,
        startTop: 100,
        startRight: 10,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'right',
        positionY: 'top',
        closeOnClick: true
    });
});
myApp.run(['$rootScope', '$transitions', 'userService', 'Notification', 'tradService', function ($rootScope, $transitions, userService, Notification, tradService) {
    $transitions.onBefore({}, function (transition) {
        var state = transition.$to();

        var isAuth = userService.hasToken();

        if (state.authenticate == true) {
            if (!isAuth) {
                Notification.info({ message: tradService.get('user', 'MUST_LOGGED') });
                return transition.router.stateService.target('home');
            }
        }

    });
}]);