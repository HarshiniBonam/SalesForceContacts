angular.module('ContactsStore')
	.controller('ListController',['NetworkService','$scope' ,function(NetworkService, $scope){
		console.log("Running List Controller...");

		var contacts = this;
		contacts.list=[];
		var retrievalSuccess = function(list){
			//console.log("List Controller: Fetched the contacts - " + angular.toJson(list));
			contacts.list = list;

            angular.forEach(contacts.list, function(value, key){

                value.show = true;
                value.showDelete = false;
                //console.log(angular.toJson(value));
            });
		};
		var retrievalFailure = function(errorData){
			console.log("List Controller: Error fetching contacts - " + angular.toJson(errorData));
		};
		contacts.getContacts = function(){
			NetworkService.getContactsList(retrievalSuccess, retrievalFailure);
		};

		contacts.deleteContact = function(contact){
			NetworkService.deleteContact(contact.Id,
				function(data){
					//Success call back.
                    alert("Contact Deleted.");
					controller.goHome();
				},
				function(data){
                    //Failure call back.
					alert("Cannot delete of the contact, please try later.");
					//console.log("deletion failed");
				});

            return contact.show =! contact.show;
		};

        $scope.hover = function(contact) {
            // Shows/hides the delete button on hover
            return contact.showDelete =! contact.showDelete;
        };

		contacts.getContacts();
		console.log("Exiting List Controller...");
	}]);