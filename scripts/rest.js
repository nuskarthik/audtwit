var app = angular.module('AudTwit', []);



app.factory('dataService', function($http){
	var dataService	= {};
	var url = '/followers';
	var url1 = '/followers/1';
  var url2

	dataService.loadData = function(){
		return $http.get(url);
	}

	dataService.moreData = function(){
		return $http.get(url1);
	}

	return dataService;
});

app.controller('FollowCtrl', ['$scope', 'dataService', function($scope, dataService){
	dataService.loadData()
 		.success(function(data){
 			$scope.followers = data;
      $scope.$apply();
 		}).error(function(error){
 			$scope.status = 'Error loading data: ' + error.message;
 		});

 	$scope.moreButton = false;	


 	 $scope.loadMore = function(){
 		//toReturn = $scope.followers.users[index];
 		dataService.moreData()
 		.success(function(data){
 			$scope.more = data;
 			if($scope.more.users.length==0){
 				$scope.moreButton = true;
 			}
 			else{
 				$scope.followers.users = $scope.followers.users.concat($scope.more.users);
 			}
 		}).error(function(error){
 			$scope.status = 'Error loading data: ' + error.message;
 		});
 	}


    }]);

app.filter('unique', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });

      return output;
   };
});