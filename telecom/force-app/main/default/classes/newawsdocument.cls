public class newawsdocument {
    
    @AuraEnabled
    public static Boolean saveDocument(Aws_Document__c awsdocument, String file, String filename, String filetype) {
        filename= filename.replaceAll( '\\s+', '');
        System.debug('filename'+filename);
        System.debug('filetype'+filetype);
        HttpRequest req = new HttpRequest();
        Blob base64Content = EncodingUtil.base64Decode(EncodingUtil.urlDecode(file, 'UTF-8'));
        String attachmentBody =  file;           
        String formattedDateString = Datetime.now().formatGMT('EEE, dd MMM yyyy HH:mm:ss z');
        String dateString = Datetime.now().format('ddMMYYYYHHmmss');

  //AWS specific information
        String key = 'AKIAIA4R5XXJDA4LZRYQ'; //AWS key
        String secret = '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'; //AWS Secret key
        String bucketname = 'pletratechsalesforcefiles'; //AWS bucket name
        String host = 's3.amazonaws.com:443'; //'s3.amazonaws.com:443'
       
        String method = 'PUT';
        String endPoint = 'https://' + bucketname + '.' + host + '/'+ filename;

        req.setMethod(method);
        req.setEndpoint(endPoint);

        system.debug('Endpoint='+endPoint);
        //create header information
        req.setHeader('Host', bucketname + '.' + host);
        req.setHeader('Access-Control-Allow-Origin', '*'); //The Access-Control-Allow-Origin response header indicates whether the response can be shared with requesting code from the given origin.
        req.setHeader('Content-Length', String.valueOf(attachmentBody.length()));
        req.setHeader('Content-Encoding', 'UTF-8');
        req.setHeader('Content-type', fileType);
        req.setHeader('Connection', 'keep-alive'); //It is an instruction that allows a single TCP connection to remain open for multiple HTTP requests/responses.
        req.setHeader('Date', formattedDateString); 
        req.setHeader('ACL', 'public-read');
        //store file as blob       
        req.setBodyAsBlob(base64Content);
        
        //prepare for signing information
        String stringToSign = 'PUT\n\n' +
        fileType + '\n' +
        formattedDateString + '\n' + '/' + bucketname + '/' + filename;

        String encodedStringToSign = EncodingUtil.urlEncode(stringToSign, 'UTF-8');
        Blob mac = Crypto.generateMac('HMACSHA1', blob.valueof(stringToSign),blob.valueof(secret));
        String signedKey  = EncodingUtil.base64Encode(mac);

        //assign Authorization information
        String authHeader = 'AWS' + ' ' + key + ':' + signedKey;                    
        req.setHeader('Authorization',authHeader);

        //finally send information to AWS        
        Http http = new Http();
        HTTPResponse res = http.send(req);

        System.debug('*Resp:' + String.ValueOF(res.getBody()));
        System.debug('RESPONSE STRING: ' + res.toString());
        System.debug('RESPONSE STATUS: ' + res.getStatus());
        System.debug('STATUS_CODE: ' + res.getStatusCode());

        if(res.getStatusCode() == 200){
            awsdocument.File__c=endPoint;
            insert awsdocument;
            return true;
        }
        return false;        
        //file = EncodingUtil.urlDecode(file, 'UTF-8');
        //awsdocument.File__c='demo';
    }

}