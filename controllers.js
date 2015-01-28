'use strict';

/* Controllers */

var app = angular.module('app', []);

app.controller('DataController', ['$scope', '$http',
  function($scope, $http) {
    $http.get('http://127.0.1.1:8080/api/gigs').success(function(data) {
      $scope.gig_data = data;
      console.log(data);
    });

    $scope.sendData = function(date, time, band, venue) {
      $scope.date = date;
      $scope.time = time;
      $scope.band = band;
      $scope.venue = venue;
      console.log($scope.time);
       var request = $http({
              method: 'post',
              url: 'http://127.0.1.1:8080/api/gigs/add',
              headers:{'Content-type':'application/json'},
              data: {
                date:$scope.date,
                time:$scope.time,
                band:$scope.band,
                venue:$scope.venue
              }
          }); 
      request.success(function(data){
        $scope.data = data;
        console.log(data);
      })
    }
  }]);
