import { LightningElement ,wire , track, api } from 'lwc';
import getSubscribers from '@salesforce/apex/SubscriberController.getSubscribers';
import { NavigationMixin } from 'lightning/navigation';

const columns = [
    { label: 'Name', fieldName: 'Name', type: 'button',
    typeAttributes: {
        label: { fieldName: 'Name' },
        name: 'viewSubscriber',
        variant: 'base', 
    }},
    { label: 'Phone', fieldName: 'Phone__c', type: 'phone'},
    { label: 'Email', fieldName: 'Email__c', type: 'email' },
    { label: 'Status', fieldName: 'Status__c'},
    { label: 'Data Used', fieldName: 'Data_Used__c'},
    { label: 'Country ', fieldName: 'Country__c'},
    { label: 'Date Joined', fieldName: 'Date_Joined__c', type : 'date' },
];

export default class SubscriberTableList extends LightningElement {

    @api recordId;
    @track subscribersToDisplay = [];
    @track subscribers = [];

    columns = columns;


    @wire(getSubscribers)
    wiredSubscribers({ error, data }) {
        console.log('data ' + JSON.stringify(data));

        if (data) {
         this.subscribers= data;
         console.log('this.subscribers ' +this.subscribers);
         this.subscribersToDisplay  = this.subscribers.filter(elem => elem.Status__c != 'Disconnected');
         console.log('subscribersToDisplay ' + JSON.stringify(this.subscribersToDisplay));
         console.log('subscribersToDisplay.length ' +this.subscribersToDisplay.length);
        this.error = undefined;

     } else if (error) {
         this.error = error;
         this.subscribers = undefined;
         console.log('error' + JSON.stringify(error));
     }
    }

    IncludeDisconnected(event){
        if(event.target.checked){
            this.subscribersToDisplay = this.subscribers;
        }
        else{
            this.subscribersToDisplay  = this.subscribers.filter(elem => elem.Status__c != 'Disconnected');
        }
    }

    navigateSubscriberRecord(event) {
        // Retrieve the action and row details from the event
        const action = event.detail.action;
        const row = event.detail.row;

        console.log('Action: ', JSON.stringify(action));
        console.log('action.name: ', action.name);
        console.log('row.Id: ', row.Id);
    
        // Switch case to handle different actions
        switch (action.name) {
            // If the action is to view the freelancer
            case 'viewSubscriber':
                // Navigate to the record page of the specified freelancer
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        objectApiName: 'Subscriber__c',
                        actionName: 'view'
                    }
                });
                break;
            default:
                break;
        }
    }



}