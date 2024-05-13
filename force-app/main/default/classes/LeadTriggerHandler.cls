/* Created By: Raz
* Params: -
* Description: Handles the logic for LeadTrigger.
*/
public with sharing class LeadTriggerHandler {
    public static void manageLeads(List<Lead> leads,Map<Id,Lead> leadMap){
        // Create a new list to hold leads that have been updated with a specific bot script
        List<Lead> updatedLeadsBotScript = new List<Lead>();

        // Iterate through each lead in the provided list of leads
        for (Lead lead : leads) {
            // Check if the current lead's Bot Script field value is 'ej90'
            // and if it's different from the Bot Script field value in the corresponding lead in the lead map
            if(lead.Bot_Script__c == 'ej90' && lead.Bot_Script__c != leadMap.get(lead.Id).Bot_Script__c){
                // If the conditions are met, add the lead to the list of updated leads
                updatedLeadsBotScript.add(lead);
            }
        }
        // Call the sendMail function to send emails include the updated leads.
        sendMail(updatedLeadsBotScript);
    }


    public static void sendMail(List<Lead> leads) {

        // Initialize an array to hold email messages.
        Messaging.SingleEmailMessage[] messages = new List<Messaging.SingleEmailMessage>();

        // Iterate through each lead in the provided list of leads.
        for(Lead lead : leads){
            // Construct the email body using lead information.
            String body = 'First Name: ' + lead.FirstName + '\n' + 'Last Name: ' + lead.LastName + '\n' + 'Email: ' + lead.Email + '\n' + 'Phone Number: ' + lead.Phone;
              // Set the email address to which the email will be sent.
              String address = 'razoren2394@gmail.com';
        
              // Set the email subject.
              String subject = 'Lead Bot Script Updated';
              
              // Create a new email message.
              Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
              
              // Set the recipient of the email.
              String[] toAddresses = new String[] { address };
              mail.setToAddresses(toAddresses);
              
              // Set the subject of the email.
              mail.setSubject(subject);
              
              // Set the plain text body of the email.
              mail.setPlainTextBody(body);
              
              // Add the email message to the array of messages.
              messages.add(mail);
          }
        
        // Check if there are any messages to send
        if (!messages.isEmpty()) {
            // Send the email messages
            Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
        
            // Iterate through the results of the email sending process
            for (Messaging.SendEmailResult result : results) {
                // Check if the email was sent successfully
                if (result.success) {
                    System.debug('The email was sent successfully.');
                } 
                else {
                    // If there was an error sending the email, log the error message
                    System.debug('The email failed to send: ' + result.errors[0].message);
                }
            }
        }
        else {
            // If there are no email messages to send, log a message indicating so
            System.debug('No email messages to send.');
        }
    }
}