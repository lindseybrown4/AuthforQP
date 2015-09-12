var app = angular.module('QueuePlate')

app.service('loginService', function($http, $q, AuthToken) {

	var authService = {};

	authService.login = function(username, password) {

		return $http.post('/api/login', {
			username: username, 
			password: password

		})
		.success(function)
			AuthToken.setToken(data.token)
			return data;
		})
	}

	authService.logout = function() {
		Authtoken.setToken();
	}

	authService.isLoggedIn = function() {
		if(AuthToken.getToken())
				return true;
		else
			return false;
	}

	authService.getUser = function() {
		if(AuthToken.getToken())
			return $http.get('/api/me');
		else
			return $q.reject({message: "User has no token"})
	}

	return authService;

});

app.service('AuthToken', function($window) {

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

app.service('AuthInterceptor', function($q, $location, AuthToken) {

	var interceptorService = {};

	interceptorService.request = function(config) {

		var token = AuthToken.getToken();

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



















