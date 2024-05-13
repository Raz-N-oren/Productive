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
private class SubscriberController_Test {


    @isTest
    static void testGetSubscribers() {
        // Create test data
        List<Subscriber__c> testSubscribers = new List<Subscriber__c>();
        for(Integer i = 0; i < 5; i++) {
            testSubscribers.add(new Subscriber__c(
                Name__c = 'Test Subscriber ' ,
                Data_Used__c = '1000' + i,
                Country__c = 'Israel',
                Date_Joined__c = Date.today(),
                Status__c = 'Active'
            ));
        }
        insert testSubscribers;

        // Call the controller method
        Test.startTest();
        List<Subscriber__c> resultSubscribers = SubscriberController.getSubscribers();
        Test.stopTest();

        // Assert the results
        System.assertEquals(5, resultSubscribers.size(), 'Number of subscribers retrieved should be 5');

        // You can add more assertions based on your specific requirements
    }
}