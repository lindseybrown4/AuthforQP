var app = angular.module('QueuePlate')

app.controller('loginCtrl', function($rootScope, $state, loginService, $scope) {

	$scope.loggedIn = loginService.isLoggedIn();

	$rootScope.$on('$routeChangeStart', function() {

		$scope.loggedIn = loginService.isLoggedIn();

		loginService.getUser()
			.then(function(data) {
				$scope.user = data.data;
			});
	});


	$scope.doLogin = function() {

		$scope.processing = true;

		$scope.error = '';

		loginService.login($scope.loginData.username, $scope.loginData.password)
			.success(function(data) {
				$scope.processing = false;

				loginService.getUser()
					.then(function(data) {
						$scope.user = data.data;
					});

				if(data.success)
					$state.go('dashboard'); //home????
				else
					$scope.error = data.message;
			});
	}

	$scope.doLogout = function() {
		loginService.logout();
		$state.go('home'); //// maybe a 'logout page'
	}


});


