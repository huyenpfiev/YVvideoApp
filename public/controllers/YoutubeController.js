myApp.controller('youtubeController', ['$scope', 'youtubeService',
 '$rootScope', '$state','tradService','Notification',
function ($scope, $youtubeService, $rootScope,$state,$tradService,Notification) {

    $scope.youtubeData = [];
    $scope.nextPage = "";
    $scope.youtubeSearchText = "";

    $scope.getYoutubeData = function(searchText){
        var pageToken = $scope.nextPage ? $scope.nextPage : '';
        $youtubeService.getYoutubeData(searchText, pageToken, function (res) {
            var data = res.items;
           
            if (data.length === 0) {
                $scope.youtubeData = 'No results were found!';
            }
            $scope.youtubeData = data;
            $scope.nextPageToken = res.nextPageToken;
            $scope.prevPageToken = res.prevPageToken;
            getVideosInfo();
        });
        $youtubeService.addToHistory(searchText, $scope.user.email, function(res){
            if(res){
              
            }
        });
    };
    $scope.initPage = function(){
        $scope.nextPage = "";
    };

    getVideosInfo = function(){
        $scope.youtubeData.forEach(function(video) {
            $youtubeService.getVideosInfo(video.id.videoId, function (res) {
                var data = res;
                video.duration = data.duration;
                video.likeCount = data.likeCount;
                video.channelId = data.channelId;
            });
        });

    };
    $scope.checkDataLength = function(data){
        return (data.length >=1);
    };

    $scope.callNextPageFn = function(nextPage){
        $scope.nextPage = nextPage;
        $scope.getYoutubeData($scope.youtubeSearchText);
    };
    $scope.$on('$viewContentLoaded', function(event) {
        $rootScope.$broadcast('getHistorySet');
        $youtubeService.getHistorySet(function(res){
            $scope.youtubeHistorySet = res;
        });
    });
    $scope.createNew=function(){
        // $state.go('playlist');
    };
    
    $('#videoPlayer').on('show.bs.modal', function (e) {
        var bookId = $(e.relatedTarget).data('book-id');
        document.getElementById('videoId').src = 'https://www.youtube.com/embed/' + bookId.id.videoId;
        $scope.videoInfos=bookId;
        // document.getElementById('modalTitle').innerHTML = bookId.snippet.title;
        // document.getElementById('modalAuthor').innerHTML = bookId.snippet.channelTitle;
        // document.getElementById('modalAuthor').href = "https://www.youtube.com/channel/"+ bookId.channelId;
        // document.getElementById('modalLikeCount').innerHTML = bookId.likeCount + " Like";
    });
    $('#videoPlayer').on('hidden.bs.modal', function () {
        document.getElementById('videoId').src = "about:blank";
    });

    $scope.addVideo = function (playlistId){
        $youtubeService.addVideo($scope.videoInfos,playlistId,function(res){
            if(res.success){
                Notification.success({ message: $tradService.get('user', res.res) });
            }
            else
                Notification.error({ message: $tradService.get('user', res.error) });
        });
    }
}]);