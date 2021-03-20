({
    MAX_FILE_SIZE: 4500000, //Max file size 4.5 MB 
    CHUNK_SIZE: 750000,      //Chunk Max size 750Kb 
    
    getParameterByName: function(component, event, name) {
        name = name.replace(/[\[\]]/g, "\\$&");
        var url = window.location.href;
        var regex = new RegExp("[?&]" + name + "(=1\.([^&#]*)|&|#|$)");
        var results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },
    
    uploadHelper: function(component, event) {
        // get the selected files using aura:id [return array of files]
        var fileInput = component.find("fuploader").get("v.files");
        // get the first file using array index[0]  
        var file = fileInput[0];
        var self = this;
        console.log('file'+file);
        console.log('file type'+file.type);
        var objFileReader = new FileReader();
        // set onload function of FileReader object   
        objFileReader.onload = $A.getCallback(function() {
            var fileContents = objFileReader.result;
            var base64 = 'base64,';
            var dataStart = fileContents.indexOf(base64) + base64.length;
             
            fileContents = fileContents.substring(dataStart);
            // call the uploadProcess method 
            self.uploadProcess(component, file, fileContents);
        });
         
        objFileReader.readAsDataURL(file);
        /*var reader = new FileReader();
        reader.onloadend = function() {
            
            var dataURL = reader.result;
            var content = dataURL.match(/,(.*)$/)[1];
            console.log('content'+content);*/
            /*var action2 = component.get("c.saveDocument");
            action2.setParams({
                "awsdocument":component.get("v.newDocument"),
                "file": content,
                "filename": component.get("v.fileName"),
                "filetype": file.type
            });
            
            action2.setCallback(this, function(a) {
                var state = a.getState();
                console.log(state);
                if (state === "SUCCESS") {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Success',
                        message: 'Aws Document is uploaded successfully',
                        type: 'success',
                    });
                    toastEvent.fire();
                    
                    var event = $A.get("e.force:navigateToSObject");
                    event.setParams({
                        "recordId" :component.get("v.parentRecordId")
                    });
                    event.fire();
                }
                else
                {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Error',
                        message:'Aws Document failed to uploaded.',
                        type: 'error',
                    });
                    toastEvent.fire();
                    
                    var event = $A.get("e.force:navigateToSObject");
                    event.setParams({
                        "recordId" :component.get("v.parentRecordId")
                    });
                    event.fire();
                }
            });
            $A.enqueueAction(action2);*/  
        //}
        //reader.readAsDataURL(file);        
    },
    
    uploadProcess: function(component, file, fileContents) {
        // set a default size or startpostiton as 0 
        var startPosition = 0;
        // calculate the end size or endPostion using Math.min() function which is return the min. value   
        var endPosition = Math.min(fileContents.length, startPosition + this.CHUNK_SIZE);
         
        // start with the initial chunk, and set the attachId(last parameter)is null in begin
        this.uploadInChunk(component, file, fileContents, startPosition, endPosition, '');
    },
     
     
    uploadInChunk: function(component, file, fileContents, startPosition, endPosition, attachId) {
        // call the apex method 'SaveFile'
        var getchunk = fileContents.substring(startPosition, endPosition);
        var action = component.get("c.saveDocument");
            action.setParams({
                "awsdocument":component.get("v.newDocument"),
                "file": encodeURIComponent(getchunk),
                "filename": component.get("v.fileName"),
                "filetype": file.type
            });
         
        // set call back 
        action.setCallback(this, function(response) {
            // store the response / Attachment Id   
            attachId = response.getReturnValue();
            var state = response.getState();
            if (state === "SUCCESS") {
                // update the start position with end postion
                startPosition = endPosition;
                endPosition = Math.min(fileContents.length, startPosition + this.CHUNK_SIZE);
                // check if the start postion is still less then end postion 
                // then call again 'uploadInChunk' method , 
                // else, diaply alert msg and hide the loading spinner
                if (startPosition < endPosition) {
                    this.uploadInChunk(component, file, fileContents, startPosition, endPosition, attachId);
                } else {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Success',
                        message: 'Aws Document is uploaded successfully',
                        type: 'success',
                    });
                    toastEvent.fire();
                    
                    var event = $A.get("e.force:navigateToSObject");
                    event.setParams({
                        "recordId" :component.get("v.parentRecordId")
                    });
                    event.fire();
                }
                // handel the response errors        
            } else if (state === "INCOMPLETE") {
                alert("From server: " + response.getReturnValue());
                var event = $A.get("e.force:navigateToSObject");
                    event.setParams({
                        "recordId" :component.get("v.parentRecordId")
                    });
                    event.fire();
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        // enqueue the action
        $A.enqueueAction(action);
    }
})