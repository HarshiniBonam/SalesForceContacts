describe('ContactsSpec', function(){

    beforeEach(module("ContactsStore"));

    var $httpBackend;
    var $currentService;
    var contacts = [
        {
            "Id":"0032800000AKLpvAAH",
            "LastName":"Gonzalez",
            "FirstName":"Rose",
            "Salutation":"Ms.",
            "Name":"Rose Gonzalez",
            "MailingStreet":"313 Constitution Place\nAustin, TX 78767\nUSA",
            "Phone":"(512) 757-6000",
            "Fax":"(512) 757-9000",
            "MobilePhone":"(512) 757-9340",
            "Email":"rose_g@edge.com",
            "Title":"SVP, Procurement",
            "Department":"Procurement",
            "LeadSource":"Trade Show",
            "Birthdate":"1963-11-19"
        },
        {
            "Id":"0032800000AKLpvAAI",
            "LastName":"Bosein",
            "FirstName":"Tim",
            "Salutation":"Mr.",
            "Name":"Tim Bosein",
            "MailingStreet":"313 Constitution Place\nAustin, TX 78767\nUSA",
            "Phone":"(512) 757-6000",
            "Fax":"(512) 757-9000",
            "MobilePhone":"(512) 757-9340",
            "Email":"timB@edge.com",
            "Title":"VP, Procurement",
            "Department":"Procurement",
            "LeadSource":"Trade Show",
            "Birthdate":"1960-03-22"
        },
        {
            "Id":"0032800000AKLpvAAJ",
            "LastName":"Forbes",
            "FirstName":"Sean",
            "Salutation":"Mr.",
            "Name":"Sean Forbes",
            "MailingStreet":"12 Constitution Place\nAustin, TX 78767\nUSA",
            "Phone":"(512) 757-6000",
            "Fax":"(512) 757-9000",
            "MobilePhone":"(512) 757-9340",
            "Email":"sean@edge.com",
            "Title":"CFO",
            "Department":"Finance",
            "LeadSource":"Trade Show",
            "Birthdate":"1942-08-17"
        },
        {
            "Id":"0032800000AKLpvAAK",
            "LastName":"Bond",
            "FirstName":"John",
            "Salutation":"Mr.",
            "Name":"John Bond",
            "MailingStreet":"2334 N. Michigan Avenue, Suite 1500\nChicago, IL 60601, USA",
            "Phone":"(312) 596-1000",
            "Fax":"(512) 757-9854",
            "MobilePhone":"(512) 757-9340",
            "Email":"bond_john@grandhotels.com",
            "Title":"VP, Facilities",
            "Department":"Facilities",
            "LeadSource":"External Referral",
            "Birthdate":"1951-09-26"
        },
        {
            "Id":"0032800000AKLpvAAL",
            "LastName":"Grey",
            "FirstName":"Jane",
            "Salutation":"Ms.",
            "Name":"Jane Grey",
            "MailingStreet":"313 Constitution Place\nAustin, TX 78767\nUSA",
            "Phone":"(512) 757-6000",
            "Fax":"(512) 757-9000",
            "MobilePhone":"(512) 757-9340",
            "Email":"jane_gray@uoa.edu",
            "Title":"Dean of Administration",
            "Department":"Administration",
            "LeadSource":"Word of mouth",
            "Birthdate":"1940-01-07"
        }
    ];

    //Function that returns an array of JSON that contains the response
    //for the simple URL query to retrieve Name, Account ID and Phone Number
    //of the list of contacts available at Salesforce.
    var getNameIdPhone = function () {
        var tempArray = [];
        for (var i = 0; i < contacts.length; i++) {
            tempArray
                .push({
                    Name: contacts[i].Name,
                    Phone: contacts[i].Phone,
                    Id: contacts[i].Id
                });
        }
        return tempArray;
    };

    //To create a deep copy of the received object.
    /*var clone = function(responseObject) {
        if (responseObject === null || typeof (responseObject) !== 'object' || 'isActiveClone' in responseObject)
            return responseObject;

        var temp = responseObject.constructor();

        for (var key in responseObject) {
            if (Object.prototype.hasOwnProperty.call(responseObject, key)) {
                responseObject['isActiveClone'] = null;
                temp[key] = clone(responseObject[key]);
                delete responseObject['isActiveClone'];
            }
        }

        return temp;
    };
    */

    beforeEach(inject(function (_NetworkService_, $injector) {

        $currentService = _NetworkService_;

        $httpBackend = $injector.get('$httpBackend');

        $httpBackend
            .whenPOST( 'https://login.salesforce.com/services/oauth2/token')
            .respond({access_token: 'ContactsAccessToken'},{});

        $httpBackend
            .whenGET( 'https://ap2.salesforce.com/services/data/v34.0/query/?q=SELECT+Name,Id,Phone+FROM+Contact')
            .respond({records: getNameIdPhone()}, {});
   }));

    afterEach(function(){
        //$httpBackend.verifyNoOutstandingExpectation();
        //$httpBackend.verifyNoOutstandingRequest();
        $httpBackend.flush();
    });

    it('must retrieve access token and then retrieve List of Contacts with Name, Id and Phone Number', function () {

        $httpBackend
            .expectPOST("https://login.salesforce.com/services/oauth2/token");
        $currentService
            .retrieveAccessToken(
                function (){
                    //Success Call back for token access.
                    console.log("Retrieved access_token.");
                    $httpBackend
                        .expectGET('https://ap2.salesforce.com/services/data/v34.0/query/?q=SELECT+Name,Id,Phone+FROM+Contact');
                    $currentService
                        .getContactsList(
                            function (contacts) {
                                //Success call back for getting contacts list.
                                expect(JSON.stringify(getNameIdPhone()))
                                    .toBe(JSON.stringify(contacts))
                            },
                             function (errorData) {
                                //Failure Call Back for getting contacts list
                                console.log("Failed to list contacts..." + errorData);
                            }
                        );
                },
                function () {
                    //Failure callback for token access.
                    console.log("Cannot retrieve access_token, please try later...");
            });
    });

    it("must retrieve access token and then retrieve contact details based on Contact ID", function () {
        for (var j = 0; j < contacts.length; j++) {
            $httpBackend
                .expectGET( /https:\/\/ap2.salesforce.com\/services\/data\/v34.0\/sobjects\/Contact\/(.+)/
                    , undefined, ['id'])
                .respond(
                    function (method, url, data, headers, parameters) {

                        console.log("Retrived parameters are - "+parameters);

                        for (var i = 0; i < contacts.length; i++) {
                            if (parameters.id === contacts[i].Id) {
                                return [200, contacts[i]];
                            }
                        }
                        return [400, {data: "Bad Request, Invalid Account ID"}];
                    });
            (function () {
                var currentContact = contacts[j];
                $currentService
                    .retrieveAccessToken(
                        function () {
                            //Success Call Back for access Token
                            $currentService
                                .getContactDetails(currentContact.Id,
                                    function (contactDetails) {
                                        //Success Call Back for retrieving contact details based on contact ID.
                                        console.log("Retrived Contact Details : " + JSON.stringify(contactDetails));
                                        expect(JSON.stringify(contactDetails))
                                        .toBe(JSON.stringify(currentContact));
                                    },
                                function (errorData) {
                                //Failure Call Back for retrieving contact details based on Contact ID.
                                console.log("Error in retrieving Contact Details : " + errorData);
                            });
                    },
                    function(){
                        //Failure Callback for retrieving access tokens.
                        console.log("Cannot retrieve AccessToken, please try later");
                });
            })();
        }//end of for loop.
        //Completed testing the details of all contacts given the contact ID.
    });

    it("must retrieve access token and then add a new contact to available data in backend.", function () {

        var contactsCopy = [];

        angular.copy(contacts, contactsCopy);
        $httpBackend
            .expectPOST(/https:\/\/ap2.salesforce.com\/services\/data\/v34.0\/sobjects\/Contact\//,
                undefined, undefined, undefined)
            .respond(function (method, url, data, headers, parameters) {

                data.Id = "0032800000AKLpvAAM";
                contactsCopy.push(JSON.parse(data));
                return [200, {Id: "0032800000AKLpvAAM"}];
            });
        $currentService
            .retrieveAccessToken(
                function () {
                    //Success Call Back for access tokens.
                    var newContact = {
                        FirstName: "Richard",
                        LastName: "Paul",
                        Email: "Richard_Paul@organfarm.com",
                        Phone: "(512)-08-9000",
                        Salutation: "Mr.",
                        MailingStreet:"313 Constitution Place\nAustin, TX 78767\nUSA",
                        Title:"Head",
                        Department:"Procurement",
                        LeadSource:"Trade Show",
                        Birthdate:"1962-10-29"
                    };
                    $currentService
                        .addNewContact(newContact,
                            function () {
                                //Success call back for adding new contact.
                                expect(JSON.stringify(contactsCopy[contactsCopy.length - 1])).toBe(JSON.stringify(newContact));
                            },
                            function (errorData) {
                                //Failure call back for adding contact.
                                console.log("Could not new contact. Error - " + errorData);
                        });
                },
                function(){
                    //Failure call back for access token.
                    console.log("Error in retrieving access_token.");
            });
    });

    it("must delete a contact given its contact ID.", function () {
        var contactsCopy = [];
        angular.copy(contacts, contactsCopy);
        contactsCopy
            .push({
                    FirstName: "Aurora",
                    LastName: "Clad",
                    Email: "aurora@trip.com",
                    Phone: "(423)-88-3487",
                    Id: "0032800000AKLpvAAN"
            });
        $httpBackend
            .expectDELETE(/https:\/\/ap2.salesforce.com\/services\/data\/v34.0\/sobjects\/Contact\/(.+)/,undefined, ['id'])
            .respond(function (method, url, data, headers, parameters) {

                for (var i = 0; i < contactsCopy.length; i++) {
                    if (contactsCopy[i].Id === parameters.id) {
                        //Deletes the contact at the index i, and fills it with the next cascadingly.
                        contactsCopy.splice(i, 1);
                        return [200, {}];
                    }
                }
                return [400, {errorData: "Bad Request, Invalid Account ID"}];
            });

        $currentService
            .deleteContact("0032800000AKLpvAAN",
                function () {
                    //Success call back for deleting a contact.
                    var contactIndex = 0;
                    for (; contactIndex < contactsCopy.length; contactIndex++) {
                        if (contactsCopy[contactIndex].Id === "0032800000AKLpvAAN")
                            break;
                    }
                    expect(contactsCopy.length).toBe(contactIndex);
                    //doesn't send any response.
                },
                function(errorData){
                    //Failure Call Back for deleting a contact.
                    console.log("Cannot delete the contact. Error - " + errorData);
                });
    });

    it("must update a contact given its contact ID.", function () {
        var contactsCopy = [];
        angular.copy(contacts, contactsCopy);

        contactsCopy
            .push({
                    FirstName: "John",
                    LastName: "Marks",
                    Email: "JMarks@tricks.com",
                    Phone: "(544)-54-9855",
                    Id: "0032800000AKLpvAA0"
            });
        $httpBackend
            .expectPOST( /https:\/\/ap2.salesforce.com\/services\/data\/v34.0\/sobjects\/Contact\/(.+)/, undefined, undefined, ['id'])
            .respond(function (method, url, data, headers, parameters) {

                var contactsIndex = 0;
                //Split the url and extract the contact ID.
                var contactId = parameters.id.split('?')[0];

                for (contactsIndex = 0; contactsIndex < contactsCopy.length; contactsIndex++) {
                    if (contactsCopy[contactsIndex].Id === contactId) {
                        var newData = JSON.parse(data);
                        for (key in newData)
                            contactsCopy[contactsIndex][key] = newData[key];
                        return [200, {}];
                    }
                }
                return [400, {}];
            });
        var updatedData = {
            Phone:"(231)-99-0909",
            Email: "JohnM@tricks.com",
        };
        $currentService
            .updateContact("0032800000AKLpvAA0",updatedData,
                    function () {
                        //Success call back for updating contacts.
                        var contactsIndex = 0;
                        for (; contactsIndex < contactsCopy.length; contactsIndex++) {
                            if (contactsCopy[contactsIndex].Id === "0032800000AKLpvAA0") {
                                expect(contactsCopy[contactsIndex].Phone).toBe("(231)-99-0909");
                                expect(contactsCopy[contactsIndex].Email).toBe("JohnM@tricks.com");
                            }
                        }
                },
            function(errorData){
                //Failure Call back for updating contacts.
                console.log("Cannot update the contact. Error - "+ errorData);
        });
    });

});
