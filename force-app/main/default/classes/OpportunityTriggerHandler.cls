
public with sharing class OpportunityTriggerHandler {
    public static void manageOpportunities(List<Opportunity> opportunities){
        System.debug('OpportunityTriggerHandler.run is now running...');

        Set<Id> accountIds = new Set<Id>();
        Map<Id, Decimal> accountTotalAmountMap = new Map<Id, Decimal>();
        

        for(Opportunity opportunity : opportunities){
            accountIds.add(opportunity.AccountId);
        }

        // Query to sum the amount field values of the related Opportunities
        List<Account> accountsList = [SELECT Id, Amount_of_opportunities__c FROM Account WHERE Id IN :accountIds];                
        List<Opportunity> listOfOpportunities = [SELECT AccountId , Amount FROM Opportunity WHERE AccountId IN :accountIds];

        for(Opportunity opp:listOfOpportunities){
            if (accountTotalAmountMap.get(opp.AccountId) == null ) {
                accountTotalAmountMap.put(opp.AccountId,(Decimal)opp.Amount);
            }
            else{
                Decimal amount = accountTotalAmountMap.get(opp.AccountId);
                amount += opp.Amount;
                accountTotalAmountMap.put(opp.AccountId,amount);

            }
        }

        List<Account> accountsToUpdate = new List<Account>();
        // Update the total amount field (custom field) in the related Account records
        for (Account acc : accountsList) {
            if (accountTotalAmountMap.containsKey(acc.Id)) {
                acc.Amount_of_opportunities__c = accountTotalAmountMap.get(acc.Id);
                accountsToUpdate.add(acc);
            }
        }

        // Perform the update
        if (!accountsToUpdate.isEmpty()) {
            update accountsToUpdate;
        }
    }
}