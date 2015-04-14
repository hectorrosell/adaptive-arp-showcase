/// <reference path="adaptive/Adaptive.d.ts" />
/// <reference path="jquery.mobile/jquerymobile.d.ts" />

function printServicesEvents(response:Adaptive.ServiceResponse):void {

    var $textArea = $('#textarea-2');
    $textArea.html($textArea.html() + response.getContent());
}


var tokens:Adaptive.ServiceToken[];
var token:Adaptive.ServiceToken;
$(document).ready(function() {
    $('#internal-ajax').click(function () {
        $.ajax({
          url: "http://httpbin.org/headers",          
        }).done(function() {
          $('#internal-ajax').addClass( "done" );            
        }).fail(function(){
          $('#internal-ajax').addClass( "fail" );
        });
    });
    $('#external-ajax').click(function () {        
        $.ajax({
          url: "http://httpbin.org/robots.txt",          
        }).done(function() {
          $('#external-ajax').addClass( "done" );
        }).fail(function(){
          $('#external-ajax').addClass( "fail" );
        });   
    });
    var service:Adaptive.IService = Adaptive.AppRegistryBridge.getInstance().getServiceBridge();
    
    var httpbin:Adaptive.ServiceToken = service.getServiceTokenByUri('http://httpbin.org/user-agent');
    var req:Adaptive.ServiceRequest = service.getServiceRequest(httpbin);
    
    var callback:Adaptive.IServiceResultCallback = new Adaptive.ServiceResultCallback(
        function onError(error:Adaptive.IServiceResultCallbackError) {
            $('#services-error').html("ERROR: " + error.toString()).show();
            $('#invokeService').addClass( "fail" );
        },
        function onResult(result:Adaptive.ServiceResponse) {            
            printServicesEvents(result);
            $('#invokeService').addClass( "done" );
        },
        function onWarning(result:Adaptive.ServiceResponse, warning:Adaptive.IServiceResultCallbackWarning) {
            $('#services-warning').html("WARNING: " + warning.toString()).show();
            printServicesEvents(result);
            $('#invokeService').addClass( "done" );
        }
    );
    
    $('#invokeService').click(function () {   
        if(!token) {
            $('#services-error').html("ERROR: no valid token").show();
            return;
        }
        req = service.getServiceRequest(token);
        service.invokeService(req, callback);
        
    });
    tokens = service.getServicesRegistered();    
    
    var index:number = 0;
    tokens.forEach(t => {
        $('#service-lists').append('<li><a href="javascript:run('+(index++)+')"><h2>'+t.serviceName+ " -> "+ t.functionName+'</h2></a></li>');
    });
    $('#service-lists').listview("refresh");
    

    /*var geonames:Adaptive.ServiceToken = service.getServiceToken("geonames","https://api.geonames.org","/postalCodeLookupJSON",Adaptive.IServiceMethod.Get);
    //var req:Adaptive.ServiceRequest = service.getServiceRequest(geonames);

    var params:Adaptive.ServiceRequestParameter[] = [];
    params.push(new Adaptive.ServiceRequestParameter("postalcode", "6600"));
    params.push(new Adaptive.ServiceRequestParameter("country", "AT"));
    params.push(new Adaptive.ServiceRequestParameter("username", "demo"));
    req.setQueryParameters(params);
    
    service.invokeService(req, callback);*/
    
    
});


var run = function run(index:number){
    token = tokens[index];
    var str:string = JSON.stringify(token);
    console.log(str);
    log(Adaptive.ILoggingLogLevel.Debug,str);
}


