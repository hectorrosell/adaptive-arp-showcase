/// <reference path="adaptive/Adaptive.d.ts" />
/// <reference path="jquery.mobile/jquerymobile.d.ts" />



$(document).ready(function() {      
    
    // Adaptive Bridges
    var fileSystem:Adaptive.IFileSystem = Adaptive.AppRegistryBridge.getInstance().getFileSystemBridge();
    var file:Adaptive.IFile = Adaptive.AppRegistryBridge.getInstance().getFileBridge();

    var fDtoStr = function fDtoStr(fileDescriptor:Adaptive.FileDescriptor):string {    
        if(!fileDescriptor) return "null";
        return (fileDescriptor.getPathAbsolute()?fileDescriptor.getPathAbsolute():fileDescriptor.getPath()).concat(" - ").concat(fileDescriptor.getName());
    }        
    
    $("#file #cache").html(fDtoStr(fileSystem.getApplicationCacheFolder()));
    $("#file #documents").html(fDtoStr(fileSystem.getApplicationDocumentsFolder()));
    $("#file #appFolder").html(fDtoStr(fileSystem.getApplicationFolder()));
    $("#file #appProtectedFolder").html(fDtoStr(fileSystem.getApplicationProtectedFolder()));
    $("#file #externalFolder").html(fDtoStr(fileSystem.getSystemExternalFolder()));
    
    var fileCallback:Adaptive.IFileResultCallback = new Adaptive.FileResultCallback(
        function onError(error:Adaptive.IFileResultCallbackError){
            fileFeed("ERROR: "+JSON.stringify(error));
        },                
        function onResult(result:Adaptive.FileDescriptor) {            
            fileFeed(JSON.stringify(result));
        },
        function onWarning(result:Adaptive.FileDescriptor, warning:Adaptive.IFileResultCallbackWarning):void {
            fileFeed(JSON.stringify(result));
            fileFeed("WARN: "+JSON.stringify(warning));            
        }
      
    );
    
    var fileFeed = function fileFeed(message:string):void{
        log(Adaptive.ILoggingLogLevel.Debug,message);
        var str:string = $('#file-feed').html();
        str += message+"<br><hr><br>";
        $('#file-feed').html(str).show();          
    }
    
    var fileDescriptor:Adaptive.FileDescriptor = fileSystem.createFileDescriptor(fileSystem.getApplicationDocumentsFolder(),"test.txt");

    if(!file.exists(fileDescriptor)){
        fileFeed(JSON.stringify(fileDescriptor)+" does NOT exist");
        file.create(fileDescriptor,fileCallback);
    }else{
        fileFeed(JSON.stringify(fileDescriptor)+" does exist");
    }

    if(file.canRead(fileDescriptor)){
        fileFeed(JSON.stringify(fileDescriptor)+" can be read");        
    }else{
        fileFeed(JSON.stringify(fileDescriptor)+" can NOT be read");        
    }

    if(file.canWrite(fileDescriptor)){
        fileFeed(JSON.stringify(fileDescriptor)+" can be written");        
    }else{
        fileFeed(JSON.stringify(fileDescriptor)+" can NOT be written");        
    }
    
    file.delete(fileDescriptor,true);
    if(!file.exists(fileDescriptor)){
        fileFeed(JSON.stringify(fileDescriptor)+" has been deleted");     
    }else{
        fileFeed(JSON.stringify(fileDescriptor)+" has NOT been deleted");
    }
    
    
    
});
