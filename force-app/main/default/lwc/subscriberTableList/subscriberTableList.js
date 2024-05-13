import { LightningElement ,wire , track, api } from 'lwc';
import getSubscribers from '@salesforce/apex/SubscriberController.getSubscribers';

const columns = [
    { label: 'Name', fieldName: 'Name', sortable: true },
    { label: 'Phone', fieldName: 'Phone__c', type: 'phone', sortable: true},
    { label: 'Email', fieldName: 'Email__c', type: 'email', sortable: true},
    { label: 'Status', fieldName: 'Status__c', sortable: true},
    { label: 'Data Used', fieldName: 'Data_Used__c', sortable: true},
    { label: 'Country ', fieldName: 'Country__c', sortable: true},
    { label: 'Date Joined', fieldName: 'Date_Joined__c', type : 'date' , sortable: true},
];

export default class SubscriberTableList extends LightningElement {

    @api recordId;
    @track subscribersToDisplay = [];
    @track subscribers = [];

    @track searchTerm = '';
    @track pagedSubscribers = [];
    @track currentPage = 1;
    @track totalRecords = 0;
    @track pageSize = 10;
    @track sortDirection = 'asc';
    @track sortedBy;

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
         this.pageSubscribers();
         this.totalRecords = data.length;

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
            this.currentPage = 1;
        }
        else{
            this.subscribersToDisplay  = this.subscribers.filter(elem => elem.Status__c != 'Disconnected');
            this.currentPage = 1;
        }
    }

    handleLoadMore() {
        this.currentPage += 1;
        this.pageSize += 10;
        this.pageSubscribers();
    }

    handleSort(event) {
        this.sortDirection = event.detail.sortDirection;
        this.sortedBy = event.detail.fieldName;
        this.subscribersToDisplay = this.sortData(event.detail.fieldName, event.detail.sortDirection);
        this.pageSubscribers();
    }

    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.subscribersToDisplay));
        let keyValue = (a) => {
            return a[fieldname];
        };
        let isReverse = direction === 'asc' ? 1 : -1;
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; 
            y = keyValue(y) ? keyValue(y) : '';
            return isReverse * ((x > y) - (y > x));
        });
        return parseData;
    }


    pageSubscribers() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);
        this.pagedSubscribers = this.subscribersToDisplay.slice(startIndex, endIndex);
    }

    handleSearch(event) {
        this.searchTerm = event.target.value.toLowerCase();
        this.currentPage = 1;
        this.subscribersToDisplay = this.subscribers.filter(elem => elem.Name.toLowerCase().includes(this.searchTerm));
        this.pageSubscribers();

    }

}