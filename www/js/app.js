(function(){
    var app = angular.module('reddit', ['ionic', 'angularMoment']);

    app.controller('RedditCtrl', function($scope, $http){
        $scope.stories = [];

        function loadStories(params, callback) {
            var stories = [];

            $http.get('http://www.reddit.com/r/gaming/new/.json', { params: params })
                
                .success(function(response){
                    angular.forEach(response.data.children, function(child){
                        stories.push(child.data);
                    });

                    callback(stories);
                });
        }

        $scope.loadOlderStories = function() {
            var params = {};

            if( $scope.stories.length > 0 ) {
                params['after'] = $scope.stories[0].name;
            }

            loadStories(params, function(stories){
                $scope.stories = $scope.stories.concat(stories);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };

        $scope.loadNewerStories = function() {
            var params = { 'before': $scope.stories[0].name };

            loadStories(params, function(stories){
                $scope.stories = stories.concat($scope.stories);
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.openLink = function(url) {
            window.open(url, '_blank');
        };
    });

    app.run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.cordova && window.cordova.InAppBrowser) {
                window.open = window.cordova.InAppBrowser.open;
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    });
})();
