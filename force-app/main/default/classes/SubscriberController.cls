/* Created By: Raz
* Params: -
* Description: Retrieves a list of subscribers with specific fields.
*/
public with sharing class SubscriberController {
    
    // Method to retrieve subscribers.
    @AuraEnabled(cacheable=true)
    public static List<Subscriber__c> getSubscribers() {
        // Perform a SOQL query to retrieve Subscribers records with specific fields.
        return [SELECT Name, Name__c, Phone__c , Email__c , Data_Used__c , Country__c, Date_Joined__c , Status__c FROM Subscriber__c];
    } 
}