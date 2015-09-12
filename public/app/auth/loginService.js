var app = angular.module('QueuePlate')

app.service('loginService', function($http, $q, authTokenService) {

	var loginService = {};

	loginService.login = function(username, password) {

		return $http.post('/api/login', {
			username: username, 
			password: password

		})
		.success(function(data) {
			authTokenService.setToken(data.token)
			return data;
		})
	}

	loginService.logout = function() {
		authTokenService.setToken();
	}

	loginService.isLoggedIn = function() {
		if(authTokenService.getToken())
				return true;
		else
			return false;
	}

	loginService.getUser = function() {
		if(authTokenService.getToken())
			return $http.get('/api/me');
		else
			return $q.reject({message: "User has no token"})
	}

	return loginService;

});

app.service('authTokenService', function($window) {

	var authTokenService = {};

	authTokenService.getToken = function() {
		return $window.localStorage.getItem('token');
	}

	authTokenService.setToken = function(token) {

		if(token)
			$window.localStorage.setItem('token', token);
		else
			$window.localStorage.removeItem('token');

	}

	return authTokenService;
})

app.service('AuthInterceptor', function($q, $location, authTokenService) {

	var interceptorService = {};

	interceptorService.request = function(config) {

		var token = authTokenService.getToken();

		if(token) {

			config.headers['x-access-token'] = token;
		}
		return config;
	};

	interceptorService.responseError = function(response) {
		if(response.status == 403)
			$location.path('/login');

		return $q.reject(response);

	}

	return interceptorService;
});



















