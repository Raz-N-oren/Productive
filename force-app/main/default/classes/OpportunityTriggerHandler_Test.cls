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
private class OpportunityTriggerHandler_Test {

        @isTest
        static void testManageOpportunities() {
            // Create test data
            Account acc = new Account(Name = 'Test Account');
            insert acc;
            
            Opportunity opp1 = new Opportunity(Name = 'Test Opp 1', StageName = 'Closed Won', CloseDate = Date.today(), Amount = 1000, AccountId = acc.Id);
            Opportunity opp2 = new Opportunity(Name = 'Test Opp 2', StageName = 'Closed Won', CloseDate = Date.today(), Amount = 2000, AccountId = acc.Id);
            insert opp1;
            insert opp2;
    
            // Call the method to be tested
            Test.startTest();
            OpportunityTriggerHandler.manageOpportunities(new List<Opportunity>{ opp1, opp2 });
            Test.stopTest();
    
            // Retrieve the updated account
            Account updatedAccount = [SELECT Amount_of_opportunities__c FROM Account WHERE Id = :acc.Id];
    
            // Verify the expected behavior
            System.assertEquals(3000, updatedAccount.Amount_of_opportunities__c, 'Total amount not updated correctly');
        }
    
        @isTest
        static void testManageOpportunities_NoOpportunities() {
            // Create test data
            Account acc = new Account(Name = 'Test Account');
            insert acc;
    
            // Call the method to be tested with no opportunities
            Test.startTest();
            OpportunityTriggerHandler.manageOpportunities(new List<Opportunity>());
            Test.stopTest();
    
            // Retrieve the account
            Account updatedAccount = [SELECT Amount_of_opportunities__c FROM Account WHERE Id = :acc.Id];
    
            // Verify that the total amount is still 0
            System.assertEquals(null, updatedAccount.Amount_of_opportunities__c, 'Total amount should be null when there are no opportunities');
        }
}
    