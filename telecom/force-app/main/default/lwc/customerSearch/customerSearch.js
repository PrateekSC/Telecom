import { LightningElement, track } from 'lwc';
import searchAccount from '@salesforce/apex/Customer_search_account.searchAccount';

export default class CustomerSearch extends LightningElement {
    
    @track isModalOpen = false;

    @track searchCustomerId ='';
    @track searchPhone='';
    searchPostalCode='';
    searchHouseNumber='';
    searchAddress='';
    accounts;

    handleCustomerIdChange(event) {
        this.searchCustomerId = event.target.value;
    }
    handlePhoneChange(event) {
        this.searchPhone = event.target.value;
    }
    
    openModal(event) {
        try {
        console.log("code my customer id: " + this.searchCustomerId + " my phone:" + this.searchPhone);
        var customerid = this.searchCustomerId;
        var phone = this.searchPhone;

        searchAccount({customerId: customerid, phone: phone})
        .then(results=>{
                  // result is account list
                  console.log(results);
                  this.accounts = results;
        });
        this.isModalOpen = true;
        } catch(e) {
            console.log(e);
        }
        
    }
        
    
    closeModal() {
        this.isModalOpen = false;
    }
    submitDetails() {
        this.isModalOpen = false;
    }
}