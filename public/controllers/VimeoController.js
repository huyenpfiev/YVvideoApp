myApp.controller('vimeoController', ['$scope', 'vimeoService', '$rootScope', function($scope, $vimeoService, $rootScope) {

    $scope.vimeoData = [];
    $scope.nextPage = "";
    $scope.vimeoSearchText = "";

    $scope.getVimeoData = function(searchText){
        if(searchText !== ''){
            var pageNbr = $scope.nextPage ? $scope.nextPage : '1';
            $vimeoService.getVimeoData(searchText, pageNbr, function (res) {
                var data = res.data;
                if (data.length === 0) {
                    $scope.vimeoData = 'No results were found!';
                }
                $scope.vimeoData = data;
                $scope.nextPageToken = res.paging.next;
                $scope.prevPageToken = res.paging.previous;
            });

            $vimeoService.addToHistory(searchText, $scope.user.email, function(res){
                if(res){
                    //console.log("search added" + searchText);
                }
            });
        }
        else{
            $scope.vimeoData = [];
            $scope.nextPage = "";
        }

    };
    $scope.initPage = function(){
        $scope.nextPage = "";
    };
    $scope.getTime = function(input){
        function z(n) { return (n < 10 ? '0' : '') + n; }
        var seconds = input % 60;
        var minutes = Math.floor(input % 3600 / 60);
        var hours = Math.floor(input / 3600);
        return (z(hours) + ':' + z(minutes) + ':' + z(seconds));
    };
    $scope.checkDataLength = function(data){
        return (data.length >=1);
    };
    
    $scope.callNextPageFn = function(nextPage){
        var url = new URL('http://www.example.com/' + nextPage);
        var page = url.searchParams.get("page");
        $scope.nextPage = page;
        $scope.getVimeoData($scope.vimeoSearchText);
    };
    $scope.$on('$viewContentLoaded', function(event) {
        $vimeoService.getHistorySet(function(res){
            $scope.vimeoHistorySet = res;
        });
    });
    $rootScope.$on('getHistorySet', function (event) {
        $vimeoService.getHistorySet(function(res){
            $scope.vimeoHistorySet = res;
        });
    });
}]);
