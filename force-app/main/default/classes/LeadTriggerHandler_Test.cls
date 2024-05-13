/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 * 
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
private class LeadTriggerHandler_Test {

    @isTest
    static void testManageLeads() {
        // Create test data
        Lead testLead1 = new Lead(Salutation= 'Mr.' ,FirstName = 'Test', LastName = 'Lead1',Email= 'test@testemail.com', Company= 'Farmers Coop. of Florida' , Status = 'Open - Not Contacted' , Phone = '1234567890');
        Lead testLead2 = new Lead(Salutation= 'Mr.' ,FirstName = 'Test', LastName = 'Lead2',Email= 'test@testemail.com', Company= 'Farmers Coop. of Florida' , Status = 'Open - Not Contacted' , Phone = '1234567890');

        insert new List<Lead>{testLead1, testLead2};

        // Update Bot_Script__c field to 'ej90'
        testLead1.Bot_Script__c = 'ej90';
        testLead2.Bot_Script__c = 'ej90';
        update new List<Lead>{testLead1, testLead2};
        
        // Create a map of lead Ids to lead records
        Map<Id, Lead> leadMap = new Map<Id, Lead>();
        leadMap.put(testLead1.Id, testLead1);
        leadMap.put(testLead2.Id, testLead2);

        // Call the method to be tested
        LeadTriggerHandler.manageLeads(new List<Lead>{testLead1, testLead2},leadMap);

        // Verify the results
        System.assertEquals(2, [SELECT count() FROM EmailMessage], 'Emails should be sent for updated leads');
    }

    @isTest
    static void testSendMail() {
        // Create test leads
        Lead testLead1 = new Lead(Salutation= 'Mr.' ,FirstName = 'Test', LastName = 'Lead1', Company= 'Farmers Coop. of Florida' , Email= 'test@testemail.com',  Status = 'Open - Not Contacted' , Phone = '1234567890', Bot_Script__c = 'ej90');
        Lead testLead2 = new Lead(Salutation= 'Mr.' ,FirstName = 'Test', LastName = 'Lead2', Company= 'Farmers Coop. of Florida' , Email= 'test@testemail.com', Status = 'Open - Not Contacted' , Phone = '1234567890', Bot_Script__c = 'ej90');
        insert new List<Lead>{testLead1, testLead2};

        // Call the method to be tested
        Test.startTest();
        LeadTriggerHandler.sendMail(new List<Lead>{testLead1, testLead2});
        Test.stopTest();

        // Verify the results
        System.assertEquals(2, [SELECT count() FROM EmailMessage], 'Emails should be sent for the provided leads');
    }
    
}



