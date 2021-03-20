public  class Customer_search_account {

  	@AuraEnabled
    public static List<Account> searchAccount(String customerId, String phone){
        
        String searchCustomerId = '%';
        String searchPhone = '%' + phone + '%';
        if(customerId != null && customerId != '') {
            searchCustomerId = '%' + customerId + '%';
        }
        if(phone != null && phone != '') {
            searchPhone = '%' + phone + '%';
        }
        System.debug('searchCustomerId:' + searchCustomerId);
        System.debug('searchPhone:' + searchPhone);
        List<Account> listofAccount= [select Id,Name,Phone,Type from Account 
        where Phone LIKE:searchPhone and Name LIKE:searchCustomerId
        ];
        System.debug('listofAccount size:' + listofAccount.size());
        System.debug(listofAccount);
        return listofAccount;
    }
    
}