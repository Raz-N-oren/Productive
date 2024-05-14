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

const pageSize = 10;

export default class SubscriberTableList extends LightningElement {

    @api recordId;
    @track subscribersToDisplay = [];
    @track subscribers = [];
    @track DisconnectedSubscribers = [];
    @track recordsTosearch = [];
    @track recordsToDisplay = [];

    @track searchTerm = '';
    @track pagedSubscribers = [];
    @track includeDisconnected = false;
    //@track currentPage = 1;
    pageNumber = 1;
    //@track totalrecords = 0;
    //@track pageSize = 10;
    @track sortDirection = 'asc';
    @track sortedBy;

    totalRecords;
    @track totalPages;
    columns = columns;


    @wire(getSubscribers)
    wiredSubscribers({ error, data }) {
        console.log('data ' + JSON.stringify(data));

        if (data) {
         this.subscribers= data;
         console.log('this.subscribers ' +this.subscribers);
         this.subscribersToDisplay  = this.subscribers.filter(elem => elem.Status__c != 'Disconnected');
         this.DisconnectedSubscribers =  this.subscribers.filter(elem => elem.Status__c == 'Disconnected');
         console.log('subscribersToDisplay ' + JSON.stringify(this.subscribersToDisplay));
         console.log('subscribersToDisplay.length ' +this.subscribersToDisplay.length);
         //this.pageSubscribers();
         this.totalRecords = this.subscribersToDisplay.length;
         console.log(' this.totalRecords ' + this.totalRecords);
         this.totalPages = Math.ceil(this.subscribersToDisplay.length/pageSize);  
         this.paginationHelper();
        this.error = undefined;

     } else if (error) {
         this.error = error;
         this.subscribers = undefined;
         console.log('error' + JSON.stringify(error));
     }
    }

    handleIncludeDisconnected(event){
        this.searchTerm = '';
        if(event.target.checked){
            //this.subscribersToDisplay = this.subscribers;
            this.includeDisconnected = true;
            this.totalRecords = this.subscribers.length;
            this.totalPages = Math.ceil(this.subscribers.length/pageSize);  
            this.paginationHelper();
            //this.currentPage = 1;
        }
        else{
            //this.subscribersToDisplay  = this.subscribers.filter(elem => elem.Status__c != 'Disconnected');
            this.includeDisconnected = false;
            this.totalPages = Math.ceil(this.subscribersToDisplay.length/pageSize);  
            this.totalRecords = this.subscribersToDisplay.length;
            this.paginationHelper();
            //this.currentPage = 1;
        }
    }

    /*handleLoadMore() {
        this.currentPage += 1;
        this.pageSize += 10;
        this.pageSubscribers();
    }*/

    handleSort(event) {
        this.sortDirection = event.detail.sortDirection;
        this.sortedBy = event.detail.fieldName;
        this.subscribersToDisplay = this.sortData(event.detail.fieldName, event.detail.sortDirection);
        this.pageSubscribers();
    }

    sortData(fieldName, direction) {
        let parseData = JSON.parse(JSON.stringify(this.subscribersToDisplay));
        let keyValue = (a) => {
            return a[fieldName];
        };
        let isReverse = direction === 'asc' ? 1 : -1;
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; 
            y = keyValue(y) ? keyValue(y) : '';
            return isReverse * ((x > y) - (y > x));
        });
        return parseData;
    }


    /*pageSubscribers() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);
        this.pagedSubscribers = this.subscribersToDisplay.slice(startIndex, endIndex);
    }*/

    handleSearch(event) {
        if(event.target.value.length > 0){
            this.searchTerm = event.target.value.toLowerCase();
            this.currentPage = 1;
            this.recordsToDisplay = this.subscribers.filter(elem => elem.Name.toLowerCase().includes(this.searchTerm));
            /*if(this.includeDisconnected == false){
                this.subscribersToDisplay  = this.recordsTosearch.filter(elem => elem.Status__c != 'Disconnected');
            }*/
        }
        else{
            //this.recordsTosearch = [];
            if(this.includeDisconnected == false){
                this.subscribersToDisplay  = this.subscribers.filter(elem => elem.Status__c != 'Disconnected');
            }
            else{
                this.subscribersToDisplay  = this.subscribers;
            }
            this.paginationHelper();
        }
        //this.pageSubscribers();

    }

    onNextPageClicked() {
        this.searchTerm = '';
        this.pageNumber = this.pageNumber + 1;
        this.paginationHelper();
    }

    onPreviousPageClicked() {
        this.searchTerm = '';
        this.pageNumber = this.pageNumber - 1;
        this.paginationHelper();
    }

    paginationHelper() {
        console.log('enter');
        this.recordsToDisplay = [];
        // calculate total pages
        // set page number 
        if (this.pageNumber <= 1) {
            this.pageNumber = 1;
        } else if (this.pageNumber >= this.totalPages) {
            this.pageNumber = this.totalPages;
        }

        // set records to display on current page 
        for (let i = (this.pageNumber - 1) * pageSize; i < this.pageNumber * pageSize; i++) {
            console.log('loop');
            if (i === this.totalRecords) {
                break;
            }
            if(this.includeDisconnected == true){
                /*if(this.searchTerm != ''){
                    //this.recordsToDisplay.push(this.recordsTosearch[i]);
                    this.recordsToDisplay.push(this.DisconnectedSubscribers[i]);
                }
                else{
                   */
                    this.recordsToDisplay.push(this.subscribers[i]);
                //}
            }

            else{
                /*if(this.searchTerm != ''){
                    console.log('this.searchTerm 1');
                    this.recordsToDisplay.push(this.recordsTosearch[i]);
                    console.log('this.recordsTosearch[i] 1');
                }*/
                this.recordsToDisplay.push(this.subscribersToDisplay[i]);
            }
        }
    }

    
    get disablePreviousPageButtonGetter() {
        return this.pageNumber == 1;
    }

    get disableNextPageButtonGetter() {
            return this.pageNumber == this.totalPages;
    }

}