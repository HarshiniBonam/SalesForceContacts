angular.module('ContactsStore')
	.controller('UpdateController',['NetworkService','$routeParams','$location',function(NetworkService,$routeParams,$location){
		console.log("Running Update Controller....");
		var controller = this;
		controller.CompleteDetails = {};
		var retrievalSuccess = function(data){
			controller.CompleteDetails = data;
			//console.log("UpdateController: Fetching details successful : " + angular.toJson(data));
		};
		var retrievalFailure = function(data){
			console.log("Update Controller: Failed fetching details that are previously in the backend");
		};
		NetworkService.getContactDetails($routeParams.id,retrievalSuccess, retrievalFailure);
		controller.goHome = function(){
			$location.path("/list");
		}
		controller.updateContact = function(){
			var contactDetails = {};
			contactDetails.FirstName = controller.CompleteDetails.FirstName;
			contactDetails.LastName = controller.CompleteDetails.LastName;
			contactDetails.Email = controller.CompleteDetails.Email;
			contactDetails.Phone = controller.CompleteDetails.Phone;
			contactDetails.Salutation = controller.CompleteDetails.Salutation;
			contactDetails.MailingStreet = controller.CompleteDetails.MailingStreet;
			contactDetails.Fax = controller.CompleteDetails.Fax;
			contactDetails.MobilePhone = controller.CompleteDetails.MobilePhone;
			contactDetails.Title = controller.CompleteDetails.Title;
            contactDetails.Department = controller.CompleteDetails.Department;
            contactDetails.LeadSource = controller.CompleteDetails.LeadSource;
            contactDetails.Birthdate = controller.CompleteDetails.Birthdate;

			NetworkService.updateContact(controller.CompleteDetails.Id, contactDetails,
				function(data){
					//Success Call back.
					controller.goHome();
				},
				function(data){
					//Failure Call back.
					console.log("Cannot update data.");
					alert("Couldn't update contact, please try later.")
			});
		}
		console.log("Exiting Update Controller....");
	}]);