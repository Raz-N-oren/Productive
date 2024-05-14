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
    @track recordsToSearch = [];
    @track recordsToDisplay = [];
    @track searchTerm = '';
    @track pagedSubscribers = [];
    @track includeDisconnected = false;
    @track sortDirection = 'asc';
    @track defaultSortDirection = 'asc';
    @track sortedBy;
    @track totalPages;

    pageNumber = 1;
    totalRecords;
    columns = columns;

    /* 
    * Created By: Raz
    * Params: { error, data } - The result of the wired Apex method call, containing error and data properties.
    * Description: This function handles the logic for retrieving subscriber data using a wired Apex method.
    */
    @wire(getSubscribers)
    wiredSubscribers({ error, data }) {
        // Check if data is returned successfully.
        if (data) {
            // If data is available, assign it to the subscribers property.
            this.subscribers = data;
            // Filter out disconnected subscribers and assign the filtered list to subscribersToDisplay.
            this.subscribersToDisplay = this.subscribers.filter(sub => sub.Status__c != 'Disconnected');
            // Filter only disconnected subscribers and assign the filtered list to DisconnectedSubscribers.
            this.DisconnectedSubscribers = this.subscribers.filter(sub => sub.Status__c == 'Disconnected');
            // Set the total number of records for pagination.
            this.totalRecords = this.subscribersToDisplay.length;
            // Calculate the total number of pages based on the number of records and page size.
            this.totalPages = Math.ceil(this.subscribersToDisplay.length / pageSize);  
            // Perform pagination setup.
            this.paginationHelper();
            // Reset any previous error.
            this.error = undefined;
        } 
        // Check if there's an error
        else if (error) {
            // If there's an error, assign it to the error property
            this.error = error;
            // Reset subscribers and subscribersToDisplay.
            this.subscribers = undefined;
            this.subscribersToDisplay = undefined;
            console.log('error' + JSON.stringify(error));
        }
    }

    /* 
    * Created By: Raz.
    * Params: event - The event object representing the checkbox state change.
    * Description: This function handles the action triggered when including or excluding disconnected subscribers.
    */
    handleIncludeDisconnected(event) {
        // Reset the search term
        this.searchTerm = '';
        // Check if the checkbox is checked.
        if (event.target.checked) {
            // If checked, include disconnected subscribers.
            this.includeDisconnected = true;
            // Update total records and total pages for pagination.
            this.totalRecords = this.subscribers.length;
            this.totalPages = Math.ceil(this.subscribers.length / pageSize);
            // Perform pagination setup.
            this.paginationHelper();
        } else {
            // If unchecked, exclude disconnected subscribers.
            this.includeDisconnected = false;
            // Update total pages and total records for pagination based on displayed subscribers.
            this.totalPages = Math.ceil(this.subscribersToDisplay.length / pageSize);
            this.totalRecords = this.subscribersToDisplay.length;
            // Perform pagination setup.
            this.paginationHelper();
        }
    }


    /* 
    * Created By: Raz.
    * Params: event - The event object containing sorting requirement.
    * Description: This function handles the action triggered when sorting subscriber data.
    */
    handleSort(event) {
        this.searchTerm = '';
        // Update sort direction and sorted by field based on event details
        this.sortDirection = event.detail.sortDirection;
        this.sortedBy = event.detail.fieldName;
        // Sort the displayed subscribers based on the new sorting criteria.
        this.subscribersToDisplay = this.sortData(event.detail.fieldName, event.detail.sortDirection);

        // Perform pagination setup
        this.paginationHelper();
    }

    /* 
    * Created By: Raz.
    * Params: fieldName - The name of the field by which the data should be sorted.
    *         direction - The direction of sorting.
    * Description: This function sorts the subscriber data based on the provided field name and sorting direction.
    */
    sortData(fieldName, direction) {
        // Deep clone the subscribers data to avoid mutating the original data.
        let parseData = JSON.parse(JSON.stringify(this.subscribersToDisplay));
        
        // Define a function to extract the value of the specified field from each record
        let keyValue = (a) => {
            return a[fieldName];
        };

        // Determine whether to sort in ascending or descending order.
        let isReverse = direction === 'asc' ? 1 : -1;

        // Sort the data based on the specified field and direction.
        parseData.sort((x, y) => {
            // Get the values of the specified field from the current and next records.
            x = keyValue(x) ? keyValue(x) : ''; 
            y = keyValue(y) ? keyValue(y) : '';
            // Compare the values and return the result based on the sorting direction.
            return isReverse * ((x > y) - (y > x));
        });

        // Return the sorted data.
        return parseData;
    }


    /* 
    * Created By: Raz.
    * Params: event - The event object representing the search input change.
    * Description: This function handles the action triggered when searching for subscribers.
    */
    handleSearch(event) {
        // Reset page number to 1 for pagination
        this.pageNumber = 1;

        // Check if search input has a value
        if(event.target.value.length > 0){
            // If there is a search term, set it and filter subscribers based on the search term
            this.searchTerm = event.target.value.toLowerCase();
            this.recordsToDisplay = this.subscribers.filter(sub => sub.Name.toLowerCase().includes(this.searchTerm));
        }
        // If search input is empty.
        else{
            if(this.includeDisconnected == false){
                // If includeDisconnected is false, filter out disconnected subscribers
                this.subscribersToDisplay  = this.subscribers.filter(sub => sub.Status__c != 'Disconnected');
            }
            else{
                // If includeDisconnected is true, display all subscribers
                this.subscribersToDisplay  = this.subscribers;
            }
            // Perform pagination setup
            this.paginationHelper();
        }
    }

    /* 
    * Created By: Raz.
    * Params: -
    * Description: This function handles the action triggered when the "Next Page" button is clicked.
    */
    onNextPageClicked() {
        // Reset search term to empty string
        this.searchTerm = '';
        // Increment page number
        this.pageNumber = this.pageNumber + 1;
        // Perform pagination setup
        this.paginationHelper();
    }

    /* 
    * Created By: Raz.
    * Params: -
    * Description: This function handles the action triggered when the "Previous Page" button is clicked.
    */
    onPreviousPageClicked() {
        // Reset search term to empty string.
        this.searchTerm = '';
        // Decrement page number.
        this.pageNumber = this.pageNumber - 1;
        // Perform pagination setup.
        this.paginationHelper();
    }

    /* 
    * Created By: Raz.
    * Params: -
    * Description: This function helps manage pagination by updating the records to display on the current page.
    */
    paginationHelper() {
        // Initialize the records to display array.
        this.recordsToDisplay = [];

        // Ensure pageNumber stays within valid bounds.
        if (this.pageNumber <= 1) {
            this.pageNumber = 1;
        } 
        else if (this.pageNumber >= this.totalPages) {
            this.pageNumber = this.totalPages;
        }

        // Loop through the data to determine records to display on the current page.
        for (let i = (this.pageNumber - 1) * pageSize; i < this.pageNumber * pageSize; i++) {
            // Break loop if the total records have been reached.
            if (i === this.totalRecords) {
                break;
            }
            // Push records based on includeDisconnected flag.
            if(this.includeDisconnected == true){
                // If includeDisconnected is true, push all subscribers.
                this.recordsToDisplay.push(this.subscribers[i]);
            }
            else{
                // If includeDisconnected is false, push only non-disconnected subscribers.
                this.recordsToDisplay.push(this.subscribersToDisplay[i]);
            }
        }
    }

    // --------------- Getters ----------------
    get disablePreviousPageButtonGetter() {
        return this.pageNumber == 1;
    }

    get disableNextPageButtonGetter() {
            return this.pageNumber == this.totalPages;
    }

}