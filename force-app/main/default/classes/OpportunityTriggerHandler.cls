/* Created By: Raz
* Params: -
* Description: Handles the logic for OpportunityTrigger.
*/
public with sharing class OpportunityTriggerHandler {

    // Method to manage opportunities.
    public static void manageOpportunities(List<Opportunity> opportunities) {
        // Debug statement to indicate that the method has started running.
        System.debug('OpportunityTriggerHandler.run is now running...');

        // Set to hold Account Ids.
        Set<Id> accountIds = new Set<Id>();
        
        // Map to hold Account Ids and their total amount of related Opportunities.
        Map<Id, Decimal> accountTotalAmountMap = new Map<Id, Decimal>();

        // Iterate through the provided opportunities to collect Account Ids.
        for (Opportunity opportunity : opportunities) {
            accountIds.add(opportunity.AccountId);
        }

        // Query to retrieve Accounts with specified Account Ids.
        List<Account> accountsList = [SELECT Id, Amount_of_opportunities__c FROM Account WHERE Id IN :accountIds];
        
        // Query to retrieve Opportunities related to the collected Account Ids.
        List<Opportunity> listOfOpportunities = [SELECT AccountId, Amount FROM Opportunity WHERE AccountId IN :accountIds];

        // Loop through the retrieved Opportunities.
        for (Opportunity opp : listOfOpportunities) {
            // Update the map with the total amount for each Account.
            if (accountTotalAmountMap.get(opp.AccountId) == null) {
                accountTotalAmountMap.put(opp.AccountId, (Decimal) opp.Amount);
            } else {
                Decimal amount = accountTotalAmountMap.get(opp.AccountId);
                amount += opp.Amount;
                accountTotalAmountMap.put(opp.AccountId, amount);
            }
        }

        // List to hold Accounts that need to be updated.
        List<Account> accountsToUpdate = new List<Account>();

        // Update the Amount_of_opportunities__c field in the related Account records.
        for (Account acc : accountsList) {
            if (accountTotalAmountMap.containsKey(acc.Id)) {
                acc.Amount_of_opportunities__c = accountTotalAmountMap.get(acc.Id);
                accountsToUpdate.add(acc);
            }
        }

        // Perform the update if there are Accounts to update.
        if (!accountsToUpdate.isEmpty()) {
            update accountsToUpdate;
        }
    }
}
