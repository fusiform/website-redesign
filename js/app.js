
var angularApp = angular.module('angularApp',
[

]);


angularApp.run([ function () {
}]);

angularApp.controller('testController', function($scope) {

});

angularApp.controller('signupController', function($scope, $rootScope, $http) {
// create a message to display in our view
  $scope.user = {
    "firstName":"",
    "lastName":"",
    "email": "",
    "password":"",
    "phone": "",
    "orgName": "",
    "street":"",
    "cityState":"",
    "zip":""


  };
  $scope.submit = function() {
    console.log($scope.user);
  }
  $scope.test = function(){
    if($scope.user.phone) {
      $scope.user.phone = $rootScope.phone
    } else {
    }
  }
  $scope.focusing = function () {
    $rootScope.needToVerify = true
  }

});

angularApp.directive('phone', function($q, $timeout, $http, $rootScope) {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      var usernames = ['Jim', 'John', 'Jill', 'Jackie'];

      ctrl.$asyncValidators.phone = function(modelValue, viewValue) {

        if (ctrl.$isEmpty(modelValue)) {
          // consider empty model valid
          return $q.when();
        }


        var def = $q.defer();

        if (!$rootScope.needToVerify ) {
          def.resolve();
          return def.promise;
        }

          // Mock a delayed response
          $http({
            method: 'POST',
            url: 'https://api.fusiform.co/tvaccess/register/verify/phone',
            data: {
              phone:modelValue
            }
          }).then(function successCallback(response) {
              if (response.data.success) {
                $rootScope.$broadcast('phoneFormatted', response.data.formatted);
                $rootScope.phone = response.data.formatted
                $rootScope.needToVerify = false
                def.resolve();
              } else {
                  def.reject();
              }
            }, function errorCallback(response) {
                  def.reject();
            });

        return def.promise;
      };
    }
  };
});
