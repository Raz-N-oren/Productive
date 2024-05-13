trigger LeadTrigger on Lead (after update) {
    LeadTriggerHandler.manageLeads(Trigger.New,Trigger.oldMap);
}