angular.module('ContactsStore')
	.factory('NetworkService',function($http){
		console.log("Running network service...");

        var credentials={

            hasToken:false,
            accessToken: null,
            clientId : '3MVG9ZL0ppGP5UrAARQauHqMCb4RqDz6VrcI61aekVjp3YXCG1R1cSnys.E7l3M9IsK1GFM4R_3GOc0dOxA_I',
            clientSecret :'2163507849321771750',
            userName : 'harshini.bonam@kony.com',
            password : 'Salesforce11',
            securityToken : 'oRqHITW6LrqY6oKaXZephiBL'
        };

        var urls = {
            forAccessToken: 'https://login.salesforce.com/services/oauth2/token',
            forContactsList: 'https://ap2.salesforce.com/services/data/v34.0/query/?q=SELECT+Name,Id,Phone+FROM+Contact',
            forContactAddDeleteDetail: 'https://ap2.salesforce.com/services/data/v34.0/sobjects/Contact/',
            forContactUpdation: '?_HttpMethod=PATCH'
        };

        var parametersToPOSTAccessToken = {
            method: 'POST',
            url: urls.forAccessToken,
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            data:"grant_type=password"+
            "&client_id="+credentials.clientId+
            "&client_secret="+credentials.clientSecret+
            "&username="+credentials.userName+
            "&password="+credentials.password+credentials.securityToken
        };

        var parametersToGETList = {
            method: 'GET',
            url: urls.forContactsList,
            headers: {'Authorization': 'Bearer '}
        };

        var parametersToGETDetails = {
            method: 'GET',
            url: urls.forContactAddDeleteDetail,
            headers: {'Authorization': 'Bearer '}
        };

        var parametersToAddContact = {
            method: 'POST',
            url: urls.forContactAddDeleteDetail,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer '
            },
            data: null
        };

        var parametersToPATCHDetails = {
            method: 'POST',
            url: urls.forContactAddDeleteDetail,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ',
                'X-HTTP-Method-Override': "PATCH"
            },
            data: null
        };

        var parametersToDELETEDetails = {
            method: 'DELETE',
            url: urls.forContactAddDeleteDetail,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ',
                'Accept': 'application/json'
            }
        };


       //method to retrieve access token
		credentials.retrieveAccessToken = function(successCallback,failureCallback){
            if(credentials.hasToken)
            {
                //console.log("Retrieved Access Tokens...")
                successCallback();
                return;
            }
            $http(parametersToPOSTAccessToken)
                .then(function(response){
            	    credentials.hasToken = true;
            	    credentials.accessToken=response.data.access_token;
            	    //console.log("Retrieved Access Token: "+ credentials.accessToken);

                    //Assign to all parameters
                    parametersToGETList.headers.Authorization = 'Bearer ' + credentials.accessToken;
                    parametersToGETDetails.headers.Authorization = parametersToGETList.headers.Authorization;
                    parametersToDELETEDetails.headers.Authorization = parametersToGETList.headers.Authorization;
                    parametersToAddContact.headers.Authorization = parametersToGETList.headers.Authorization;
                    parametersToPATCHDetails.headers.Authorization = parametersToGETDetails.headers.Authorization;

                    successCallback();
                },
                function(response){
                    failureCallback();
                	//console.log("Error getting token: "+ angular.toJson(response));
                });
            };

        //method to add new contact in Salesforce DB
        credentials.addNewContact = function(contact,successCallback,failureCallback){
            parametersToAddContact.data = contact;
            console.log("*** contact - " + contact + "\n** - " + angular.toJson(contact));
            console.log("***credentials + " + parametersToAddContact.headers.Authorization);
            $http(parametersToAddContact)
                .then(successCallback,failureCallback);
        }

        //method to delete a contact from Salesforce DB
        credentials.deleteContact = function(id,successCallback,failureCallback){

            parametersToDELETEDetails.url = parametersToDELETEDetails.url + id;
            $http(parametersToDELETEDetails)
                .then(successCallback,failureCallback);

            parametersToDELETEDetails.url = urls.forContactAddDeleteDetail;

        }

        //method to retrieve Contacts List
		credentials.getContactsList = function(successCallback,failureCallback){

			if(!credentials.hasToken)
			{
				console.log("Token not yet available");
				return;
			}
			else{

                //console.log("****Access Token in get Basic Contacts : " + credentials.accessToken + "\n" + parametersToGETList.headers.Authorization);

            	$http(parametersToGETList)
                    .then(function(response){
            		    successCallback(response.data.records);
            	    }, failureCallback);
            }
		};

		//method to retrieve Complete Contact details based on the Contact ID
		credentials.getContactDetails = function(id,successCallback,failureCallback){

            parametersToGETDetails.url = parametersToGETDetails.url+ id;

            //console.log("****Access Token in get Details Contacts : " + credentials.accessToken + "\n" + parametersToGETList.headers.Authorization);
            //console.log("***URL :  " + parametersToGETDetails.url);
			$http(parametersToGETDetails)
                .then(function(response){
            	    successCallback(response.data);
                },failureCallback);
            parametersToGETDetails.url = urls.forContactAddDeleteDetail;
		};

		//method to edit and update Contact details based on Contact ID
		credentials.updateContact = function(id,newData,successCallback,failureCallback){

            parametersToPATCHDetails.url = parametersToPATCHDetails.url + id + urls.forContactUpdation;
           // console.log("***parameters to patch : " + angular.toJson(parametersToPATCHDetails));
            parametersToPATCHDetails.data = newData;
			$http(parametersToPATCHDetails)
                .then(function(response){
            	    successCallback(response.data);
                },failureCallback);
            parametersToPATCHDetails.url = urls.forContactAddDeleteDetail;
		}

		console.log("Exiting Network Services...")
		return credentials;
	});