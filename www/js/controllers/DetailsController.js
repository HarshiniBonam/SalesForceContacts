angular.module('ContactsStore')
	.controller('DetailsController',['NetworkService','$routeParams','$location',function(NetworkService,$routeParams,$location){
		console.log("Entering Details Controller...");

		var controller = this;
		controller.FullContact = {};
		var retrieveSuccess = function(data){
			controller.FullContact = data;
			//console.log("Data : " + angular.toJson(data));
		};
		var retrieveFailure = function(data){
			console.log("Cannot retrieve contact details. error - " + data);
		};
		controller.goHome = function(){
			$location.path("/list");
		};
		controller.deleteContact = function(){
			NetworkService.deleteContact(controller.FullContact.Id,
				function(data){
                    //Success call back.
					controller.goHome();
					alert("Contact Deleted Successfully.");
				},
				function(data){
                    //Failure call back.
					//alert("Cannot delete of the contact, please try later.");
					console.log("Failed to delete. Error - " + data);
				});
		};

		NetworkService.getContactDetails($routeParams.id,retrieveSuccess,retrieveFailure);
        console.log("Exiting Details Controller...");
	}]);