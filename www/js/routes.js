angular.module('ContactsStore')
	.config(function($routeProvider){
		console.log("Configuring routes");
		$routeProvider
			.when('/',{
				templateUrl: "./templates/LoadingContacts.html",
				controller: "LoadingController",
				controllerAs: "loader"
			})
			.when('/list',{
				templateUrl: "./templates/ListContacts.html",
				controller: "ListController",
				controllerAs: "lister"
			})
            .when('/add',{
                templateUrl: "./templates/AddContact.html",
                controller: "AddController",
                controllerAs: "adder"
            })
			.when('/details/:id',{
				templateUrl: "./templates/DetailsContact.html",
				controller: "DetailsController",
				controllerAs: "details"
			})
			.when('/edit/:id',{
				templateUrl: "./templates/UpdateContact.html",
				controller: "UpdateController",
				controllerAs: "updater"
			})


			.otherwise({
				redirectTo:'/'
			});
	});
