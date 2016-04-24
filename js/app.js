var angularApp = angular.module('angularApp', [
    'ngAnimate'
]);


angularApp.run([function() {}]);

angularApp.controller('testController', function($scope) {

});

angularApp.controller('signupController', function($scope, $rootScope, $http) {
    // create a message to display in our view
    $scope.user = {
        "firstName": "",
        "lastName": "",
        "email": "",
        "password": "",
        "repPassword": "",
        "phone": "",
        "orgName": "",
        "street": "",
        "city": "",
        "state": "",
        "zip": ""


    };
    $scope.processing = false;
    $scope.submit = function(valid) {
        $scope.submitted = true;
        if (valid && $scope.passwordsMatch && $scope.usernameAvailable) {
            console.log($scope.user);
            $scope.processing = true;
        }
    }
    $scope.test = function() {
        if ($scope.user.phone) {
            $scope.user.phone = $rootScope.phone
        } else {}
    }
    $scope.passwordsMatch = true;
    $scope.testPasswords = function() {
        // console.log("checking")
        // console.log($scope.user.password)
        // console.log($scope.user.repPassword)
        $scope.passwordsMatch = $scope.user.password==$scope.user.repPassword
        return $scope.user.password==$scope.user.repPassword;
    }
    $scope.usernameAvailable = true;
    $scope.testEmail = function () {
        if ($scope.user.email && $scope.user.email != '') {
            $http({
                method: 'POST',
                url: 'https://api.fusiform.co/tvaccess/register/verify/username',
                data: {
                    username: $scope.user.email
                }
            }).then(function successCallback(response) {
                if (response.data.success) {
                    console.log("valid email")
                    $scope.usernameAvailable = true;
                } else {
                    console.log("INVALID email")
                    $scope.usernameAvailable = false;
                }
            }, function errorCallback(response) {
                console.log("Error checking username.")
                $scope.usernameAvailable = false;
            });
        }


    }
    $scope.focusing = function() {
        $rootScope.needToVerify = true
    }

});

angularApp.directive('phone', function($q, $timeout, $http, $rootScope) {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {

            ctrl.$asyncValidators.phone = function(modelValue, viewValue) {

                if (ctrl.$isEmpty(modelValue)) {
                    // consider empty model valid
                    return $q.when();
                }


                var def = $q.defer();

                if (!$rootScope.needToVerify) {
                    def.resolve();
                    return def.promise;
                }

                $http({
                    method: 'POST',
                    url: 'https://api.fusiform.co/tvaccess/register/verify/phone',
                    data: {
                        phone: modelValue
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
