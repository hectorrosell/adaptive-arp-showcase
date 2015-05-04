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
    fileFeed(JSON.stringify(fileDescriptor));

    if(!file.exists(fileDescriptor)){
        fileFeed(fileDescriptor.getName()+" does NOT exist");
        file.create(fileDescriptor,fileCallback);
    }else{
        fileFeed(fileDescriptor.getName()+" does exist");
    }

    if(file.canRead(fileDescriptor)){
        fileFeed(fileDescriptor.getName()+" can be read");        
    }else{
        fileFeed(fileDescriptor.getName()+" can NOT be read");        
    }

    if(file.canWrite(fileDescriptor)){
        fileFeed(fileDescriptor.getName()+" can be written");        
    }else{
        fileFeed(fileDescriptor.getName()+" can NOT be written");        
    }
    var isDirectory:boolean = false;
    if(file.isDirectory(fileDescriptor)){
        isDirectory = true;
        fileFeed(fileDescriptor.getName()+" is Directory");        
    }else{
        fileFeed(fileDescriptor.getName()+" is File");        
    }
   
    

    var loadCallback:Adaptive.IFileDataLoadResultCallback = new Adaptive.FileDataLoadResultCallback(
        function onError(error:Adaptive.IFileDataLoadResultCallbackError){
            fileFeed("ERROR: "+JSON.stringify(error));
        },
        function onResult(result:Array<number>){
            fileFeed("CONTENT: "+result.decodeHex());
            
            file.delete(fileDescriptor,isDirectory);
            if(!file.exists(fileDescriptor)){
                fileFeed(fileDescriptor.getName()+" has been deleted");     
            }else{
                fileFeed(fileDescriptor.getName()+" has NOT been deleted");
            }
        },
        function onWarning(result:Array<number>, warning:Adaptive.IFileDataLoadResultCallbackWarning){            
            fileFeed("WARN: "+JSON.stringify(warning));
            fileFeed("CONTENT: "+JSON.stringify(result)); 
        }
    );

    var storeCallback:Adaptive.IFileDataStoreResultCallback = new Adaptive.FileDataStoreResultCallback(
        function onError(error:Adaptive.IFileDataStoreResultCallbackError){
        },
        function onResult(result:Adaptive.FileDescriptor){
            file.getContent(result,loadCallback)
        },
        function onWarning(result:Adaptive.FileDescriptor,warning:Adaptive.IFileDataStoreResultCallbackWarning){
        }
    );
            
    file.setContent(fileDescriptor,"Hello World!".encodeHex(),storeCallback)
    
    var directory:Adaptive.FileDescriptor = fileSystem.createFileDescriptor(fileSystem.getApplicationDocumentsFolder(),"test/a/b/");
    file.mkDir(directory,true);
    if(file.isDirectory(directory)){
        fileFeed(directory.getName()+" is Directory");
    }else{
        fileFeed(directory.getName()+" is File");        
    }
    
    var listCallback:Adaptive.FileListResultCallback = new Adaptive.FileListResultCallback(
        function onError(error:Adaptive.IFileListResultCallbackError){
            fileFeed("ERROR: "+JSON.stringify(error));
        },
        function onResult(result:Adaptive.FileDescriptor[]){
            fileFeed("LIST: "+JSON.stringify(result));                       
        },
        function onError(result:Adaptive.FileDescriptor[], warning:Adaptive.IFileListResultCallbackWarning){
            fileFeed("WARN: "+JSON.stringify(warning));
            fileFeed("CONTENT: "+JSON.stringify(result));   
        }
    );

    var fileCallback0:Adaptive.IFileResultCallback = new Adaptive.FileResultCallback(
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

    var source:Adaptive.FileDescriptor = fileSystem.createFileDescriptor(fileSystem.getApplicationDocumentsFolder(),"test/test.txt");
    file.create(source,fileCallback0);

    directory = fileSystem.createFileDescriptor(fileSystem.getApplicationDocumentsFolder(),"test/");
    file.listFiles(directory,listCallback);
    

    

    var dest:Adaptive.FileDescriptor = fileSystem.createFileDescriptor(fileSystem.getApplicationDocumentsFolder(),"test/a/test.txt");

    
    var fileCallback1:Adaptive.IFileResultCallback = new Adaptive.FileResultCallback(
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

    file.move(source,dest,true,true,fileCallback1);

    
    var listCallback1:Adaptive.FileListResultCallback = new Adaptive.FileListResultCallback(
        function onError(error:Adaptive.IFileListResultCallbackError){
            fileFeed("ERROR: "+JSON.stringify(error));
        },
        function onResult(result:Adaptive.FileDescriptor[]){
            fileFeed("LIST: "+JSON.stringify(result));                       
        },
        function onError(result:Adaptive.FileDescriptor[], warning:Adaptive.IFileListResultCallbackWarning){
            fileFeed("WARN: "+JSON.stringify(warning));
            fileFeed("CONTENT: "+JSON.stringify(result));   
        }
    );

    file.listFiles(directory,listCallback1);
    
    
});

interface String {
    encodeHex:() => number[];
}

String.prototype.encodeHex = function () :number[] {
  var bytes = [];
  for (var i = 0; i < this.length; ++i) {
    bytes.push(this.charCodeAt(i));
  }
  return bytes;
};

interface Array<T> {
    decodeHex:() => string;
}

Array.prototype.decodeHex = function () : string {    
  var str = [];
  var hex = this.toString().split(',');
  for (var i = 0; i < hex.length; i++) {
    str.push(String.fromCharCode(hex[i]));
  }
  return str.toString().replace(/,/g, "");
};
