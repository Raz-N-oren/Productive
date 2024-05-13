public with sharing class SubscriberController {

        @AuraEnabled(cacheable=true)
        public static List<Subscriber__c> getSubscribers() {
            return [SELECT Id, Name, Name__c, Phone__c , Email__c , Data_Used__c , Country__c, Date_Joined__c , Status__c FROM Subscriber__c];
        } 
}