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

    /* Created By: Raz
    * Params: -
    * Description: Receives data or error from the wired Apex method getSubscribers.
    */
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

    /* Created By: Raz
    * Params: event
    * Description: This function is associated with a checkbox event. When the checkbox is checked, it includes all subscribers in the display list. When the checkbox is unchecked, it filters out subscribers with a status of 'Disconnected' and updates the display list accordingly.
    */
    IncludeDisconnected(event) {
        // Check if the checkbox is checked.
        if (event.target.checked) {
            // If the checkbox is checked, assign all subscribers to the display list.
            this.subscribersToDisplay = this.subscribers;
            // Reset the current page to 1.
            this.currentPage = 1;
        } else {
            // If the checkbox is not checked,
            // Filter out subscribers with 'Disconnected' status and assign the filtered list to the display list.
            this.subscribersToDisplay = this.subscribers.filter(elem => elem.Status__c != 'Disconnected');
            // Reset the current page to 1.
            this.currentPage = 1;
        }
    }
    
    /* 
    * Created By: Raz.
    * Params: -
    * Description: This function manages the action triggered when loading more data.
    */
    handleLoadMore() {
        // Increment the current page numbe r by 1
        this.currentPage += 1;
        // Increase the page size by 10
        this.pageSize += 10;
        // Call the function responsible for updating the displayed subscribers based on the current page and page size
        this.pageSubscribers();
    }

    /* 
    * Created By: Raz.
    * Params: event.
    * Description: This function handles the action triggered when sorting data.
    */
    handleSort(event) {
        // Update the sort direction and sorted by field based on the event details.
        this.sortDirection = event.detail.sortDirection;
        this.sortedBy = event.detail.fieldName;
        // Sort the displayed subscribers based on the new sorting criteria.
        this.subscribersToDisplay = this.sortData(event.detail.fieldName, event.detail.sortDirection);
        // Call the function responsible for updating the displayed subscribers based on the current page and page size.
        this.pageSubscribers();
    }

    /* 
    * Created By: Raz.
    * Params: fieldName - The name of the field by which the data should be sorted.
    * direction - The direction of sorting ('asc' for ascending, 'desc' for descending).
    * Description: This function sorts the data based on the specified field name and direction.
    */
    sortData(fieldName, direction) {
        // Deep clone the subscribers data to avoid mutating the original data.
        let parsedData = JSON.parse(JSON.stringify(this.subscribersToDisplay));
        // Define a function to extract the value of the specified field from each record
        let keyValue = (a) => {
            return a[fieldName];
        };
        // Determine whether to sort in ascending or descending order
        let isReverse = direction === 'asc' ? 1 : -1;
        // Perform the sorting based on the specified field and direction
        parsedData.sort((x, y) => {
            // Get the values of the specified field from the current and next records
            x = keyValue(x) ? keyValue(x) : ''; 
            y = keyValue(y) ? keyValue(y) : '';
            // Compare the values and return the result based on the sorting direction
            return isReverse * ((x > y) - (y > x));
        });
        // Return the sorted data
        return parsedData;
    }


    /* 
    * Created By: Raz.
    * Params: None.
    * Description: This function manages the pagination of displayed subscribers.
    */
    pageSubscribers() {
        // Calculate the start index of the current page.
        const startIndex = (this.currentPage - 1) * this.pageSize;
        // Calculate the end index of the current page, ensuring it does not exceed the total number of records.
        const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);
        // Extract the subscribers to display for the current page based on the calculated indices.
        this.pagedSubscribers = this.subscribersToDisplay.slice(startIndex, endIndex);
    }


    handleSearch(event) {
        this.searchTerm = event.target.value.toLowerCase();
        this.currentPage = 1;
        this.subscribersToDisplay = this.subscribers.filter(elem => elem.Name.toLowerCase().includes(this.searchTerm));
        this.pageSubscribers();

    }

}