angular.module('ContactsStore')
	.controller('AddController',['NetworkService','$location',function(NetworkService,$location){
		
		console.log("AddController");
		var controller=this;
		controller.contact={
			FirstName:"",
			LastName:"",
			Email:"",
			Phone:"",
            Salutation: "",
            MailingStreet: "",
            Fax: "",
            MobilePhone: "",
            Title: "",
            Department: "",
            LeadSource: "",
            Birthdate: ""
		};

		controller.goHome = function(){
			$location.path("/list");
		};

        var additionSuccess = function(data){
            //Success Call back.
            controller.goHome();
            alert("Successfully added contact.");
        };

        var additionFailure = function(data){
            //Failure call back.

            console.log("Cannot add new contact. Error - " + angular.toJson(data));
        }

		controller.addContact = function(){
			NetworkService.addNewContact(controller.contact, additionSuccess,additionFailure );
		};
	}]);