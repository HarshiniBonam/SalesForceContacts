angular.module('ContactsStore')
	.controller('LoadingController',['NetworkService','$location',function(NetworkService,$location){
		console.log("Entering Loading Controller...");

		NetworkService.retrieveAccessToken(
			function(){
                //Success call back.
    			$location.path("/list");
	    	},
            function(){
                //Failure call back.
			    alert("Sorry,Unable to process your request. Please try later.");
		});
        console.log("Exiting Loading Controller...");
	}]);