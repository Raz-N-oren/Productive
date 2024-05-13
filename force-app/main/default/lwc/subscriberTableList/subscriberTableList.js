import { LightningElement ,wire , track } from 'lwc';
import getSubscribers from '@salesforce/apex/SubscriberController.getSubscribers';


const columns = [
    { label: 'Name', fieldName: 'Name__c' },
    { label: 'Phone', fieldName: 'Phone__c', type: 'phone' },
    { label: 'Email', fieldName: 'Email__c', type: 'email' },
    { label: 'Status', fieldName: 'Status__c'},
    { label: 'Data Used', fieldName: 'Data_Used__c'},
    { label: 'Country ', fieldName: 'Country__c'},
    { label: 'Date Joined', fieldName: 'Date_Joined__c', type : 'date' },
];

export default class SubscriberTableList extends LightningElement {

   
    @track subscribersToDisplay = [];
    @track subscribers = [];

    columns = columns;


    @wire(getSubscribers)
    wiredSubscribers({ error, data }) {
        console.log('data ' + JSON.stringify(data));

        if (data) {
         this.subscribers= data;
         console.log('this.subscribers ' +this.subscribers);
         this.subscribersToDisplay  = this.subscribers.filter(elem => elem.Status__c != 'DISCONNECTED');
         console.log('subscribersToDisplay ' +this.subscribersToDisplay);
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
            this.subscribersToDisplay  = this.subscribers.filter(elem => elem.fields.Status.value != 'DISCONNECTED');
        }
    }



}