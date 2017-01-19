(function(){
	'use strict';
	angular.module('node-auth',['ui.router'])
	
	.config(function($stateProvider, $urlRouterProvider){
		$urlRouterProvider.otherwise("/");

		$stateProvider
			.state('index', {
				url: "/",
				templateUrl: "partials/dashboard.html"
			})
			.state('user-dashboard', {
				url: "/userdashboard",
				templateUrl: "partials/user-dashboard.html",
				resolve: {
					loginCheck : checkLoggedIn
				}
			})
			.state('login', {
				url: "/login",
				templateUrl: "partials/login.html"
			})
			.state('signup', {
				url: "/signup",
				templateUrl: "partials/signup.html"
			})
			.state('logout', {
				url: "/logout"
			})
		/*$stateProvider
		    .state('index', {
		      url: "/",
		      templateUrl: "partials/dashboard.html",
		      controller: "UserDashboardCtrl",
			    data: {
		        requireLogin: false,
		        title: 'smartData Cultural League'
		      }
		})*/
	})

	.controller('mainCtrl', function($http, $state, $rootScope) { 
		var self = this;
		self.logout = function() {
			$state.go('logout');
		}
	})

	.controller('loginCtrl', function($q, $http, $state, $rootScope) {
		var self = this;
		var deferred = $q.defer();
		this.login = function() {
			$http.post('/login', {'username':self.username,'password':self.password})
				.then(response => {
			    	// don't do this!
			    	console.log(response);
			    	$q.resolve(response);
			    	$state.go('user-dashboard');
			    }, reason => {
			    	console.log(reason);
			      	// don't do this!
			      	$q.reject(reason);
			    });
		} //login
	});

	var checkLoggedIn = function($q, $timeout, $http, $location, $rootScope, $state) {
	  var deferred = $q.defer();

	  $http.get('/loggedin').success(function(user) {
	    $rootScope.errorMessage = null;
	    //User is Authenticated
	    if (user !== '0') {
	      $rootScope.currentUser = user;
	      deferred.resolve();
	    } else { //User is not Authenticated
	      $rootScope.errorMessage = 'You need to log in.';
	      deferred.reject();
	      $state.go('login');
	      //$location.url('/login');
	    }
	  });
	  return deferred.promise;
	}

})();
