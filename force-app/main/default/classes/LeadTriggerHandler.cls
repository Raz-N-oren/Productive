public with sharing class LeadTriggerHandler {
    public static void manageLeads(List<Lead> leads,Map<Id,Lead> leadMap){
        List<Lead> updatedLeadsBotScript = new List<Lead>();

        for (Lead lead : leads) {
            if(lead.Bot_Script__c == 'ej90' && lead.Bot_Script__c != leadMap.get(lead.Id).Bot_Script__c){
                updatedLeadsBotScript.add(lead);
            }
        }

        sendMail(updatedLeadsBotScript);
    }


    public static void sendMail(List<Lead> leads) {


        Messaging.SingleEmailMessage[] messages = new List<Messaging.SingleEmailMessage>();
        for(Lead lead : leads){
            String body = 'First Name: ' + lead.FirstName + '\n' + 'Last Name: ' + lead.LastName + '\n' + 'Email: ' + lead.Email + '\n' + 'Phone Number: ' + lead.Phone;
            String address = 'razoren2394@gmail.com';
            String subject = 'Lead Bot Script Updated';
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            String[] toAddresses = new String[] {address};
            mail.setToAddresses(toAddresses);
            mail.setSubject(subject);
            mail.setPlainTextBody(body);
            messages.add(mail);
        }
        
        if (!messages.isEmpty()) {
            Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
            
            for (Messaging.SendEmailResult result : results) {
                if (result.success) {
                    System.debug('The email was sent successfully.');
                } else {
                    System.debug('The email failed to send: ' + result.errors[0].message);
                }
            }
        } else {
            System.debug('No email messages to send.');
        }
    }
}