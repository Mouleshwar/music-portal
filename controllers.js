'use strict';

/* Controllers */

var app = angular.module('app', []);

app.controller('DataController', ['$scope', '$http',
  function($scope, $http) {
    $http.get('http://127.0.1.1:8080/api/users').success(function(data) {
      $scope.data = data;
    });

    $scope.sendData = function(username,password) {
      $scope.username = username;
      $scope.password = password;
      console.log($scope.username + " "+ $scope.password);
       var request = $http({
              method: 'post',
              url: 'http://127.0.1.1:8080/api/users',
              headers:{'Content-type':'application/json'},
              data: {
              username:$scope.username,
              password:$scope.password
              }
          }); 
      request.success(function(data){
        $scope.data = data;
        console.log(data);
      })
    }
  }]);
