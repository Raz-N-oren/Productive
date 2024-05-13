trigger OpportunityTrigger on Opportunity (after update) {
    OpportunityTriggerHandler.manageOpportunities(Trigger.New);
}