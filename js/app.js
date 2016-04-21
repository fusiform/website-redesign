
var angularApp = angular.module('angularApp',
[

]);


angularApp.run([ function () {
  console.log("Hello World");
}]);

angularApp.controller('testController', function($scope) {

});

angularApp.controller('signupController', function($scope) {
// create a message to display in our view
  $scope.user = {
    "name":"",
    "email": "",
    "password":"",
    "repPassword":"",
    "phone": "",
    "orgName": ""


  };
  $scope.submit = function() {
    console.log($scope.user);
  }
});
