
var angularApp = angular.module('angularApp',
[

]);


angularApp.run([ function () {
  console.log("Hello World");
}]);

angularApp.controller('testController', function($scope) {

});

angularApp.controller('signupController', function($scope, $http) {
// create a message to display in our view
  $scope.user = {
    "name":"",
    "email": "",
    "password":"",
    "repPassword":"",
    "phone": "",
    "orgName": "",
    "csc":"",
    "zip":""


  };
  $scope.submit = function() {
    console.log($scope.user);
  }

  $scope.test = function() {
    console.log("Phone number changed");
    $http({
      method: 'POST',
      url: 'https://api.fusiform.co/tvaccess/register/verify/phone',
      data: {
        phone:$scope.user.phone
      }
    }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        console.log(response)
        if (response.data.success) {
          $scope.user.phone = response.data.formatted;
        } else {
          console.log("invalid")
        }
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
          console.log("invalid")
      });
  }
});
