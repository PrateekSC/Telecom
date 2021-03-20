({
    doInit: function(component, event, helper) {
        var value = helper.getParameterByName(component , event, 'inContextOfRef');
        var context = JSON.parse(window.atob(value));
        component.set("v.parentRecordId", context.attributes.recordId);
        component.set("v.newDocument.Case__c", component.get("v.parentRecordId"));
        console.log(component.get("v.parentRecordId"));
    },
    
    closeModel: function(component, event, helper) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
        component.set("v.isOpen", false);
        var event = $A.get("e.force:navigateToSObject");
        event.setParams({
            "recordId" :component.get("v.parentRecordId")
        });
        event.fire();
        
    },
    
    handleFilesChange: function(component, event, helper) {
        var fileName = 'No File Selected..';
        if (event.getSource().get("v.files").length > 0) {
            fileName = event.getSource().get("v.files")[0]['name'];
        }
        component.set("v.fileName", fileName);
    },
    
    handleSave: function(component, event, helper) {
        if (component.find("fuploader").get("v.files").length > 0) {
            helper.uploadHelper(component, event);
        } else {
            alert('Please Select a Valid File');
        }
    },
    
})