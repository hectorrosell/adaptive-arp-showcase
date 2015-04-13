/// <reference path="adaptive/Adaptive.d.ts" />
/// <reference path="jquery.mobile/jquerymobile.d.ts" />

function printServicesEvents(response:Adaptive.ServiceResponse):void {

    var $textArea = $('#textarea-2');
    $textArea.html($textArea.html() + response.getContent());
}

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
    
    $('#invokeService').click(function () {   
        var httpbin:Adaptive.ServiceToken = service.getServiceTokenByUri('http://httpbin.org/user-agent');
        var req:Adaptive.ServiceRequest = service.getServiceRequest(httpbin);
        
       
    }

    var tokens:Adaptive.ServiceToken[] = service.getServicesRegistered();
    tokens.forEach(t => {
        $('#service-lists').append('<li><a href="javascript:run(this)"><h2>'+t.functionName+'</h2></a></li>');
    });
    $('#service-lists').listview("refresh");

    

    //var params:Adaptive.ServiceRequestParameter[] = [];    
    //req.setQueryParameters(params);

    var service:Adaptive.IService = Adaptive.AppRegistryBridge.getInstance().getServiceBridge();

    var geonames:Adaptive.ServiceToken = service.getServiceToken("geonames","https://api.geonames.org","/postalCodeLookupJSON",Adaptive.IServiceMethod.Get);
    var req:Adaptive.ServiceRequest = service.getServiceRequest(geonames);

    var params:Adaptive.ServiceRequestParameter[] = [];
    params.push(new Adaptive.ServiceRequestParameter("postalcode", "6600"));
    params.push(new Adaptive.ServiceRequestParameter("country", "AT"));
    params.push(new Adaptive.ServiceRequestParameter("username", "demo"));
    req.setQueryParameters(params);

    var callback:Adaptive.IServiceResultCallback = new Adaptive.ServiceResultCallback(
        function onError(error:Adaptive.IServiceResultCallbackError) {
            $('#services-error').html("ERROR: " + error.toString()).show();
        },
        function onResult(result:Adaptive.ServiceResponse) {
            printServicesEvents(result);
        },
        function onWarning(result:Adaptive.ServiceResponse, warning:Adaptive.IServiceResultCallbackWarning) {
            $('#services-warning').html("WARNING: " + warning.toString()).show();
            printServicesEvents(result);
        }
    );
    service.invokeService(req, callback);

        var callback:Adaptive.IServiceResultCallback = new Adaptive.ServiceResultCallback(
            function onError(error:Adaptive.IServiceResultCallbackError) {
                $('#services-error').html("ERROR: " + error.toString()).show();
            },
            function onResult(result:Adaptive.ServiceResponse) {
                printServicesEvents(result);
            },
            function onWarning(result:Adaptive.ServiceResponse, warning:Adaptive.IServiceResultCallbackWarning) {
                $('#services-warning').html("WARNING: " + warning.toString()).show();
                printServicesEvents(result);
            }
        );
        service.invokeService(req, callback);
    });
    
});


var run = function run(object){
    var str:string = JSON.stringify(object);
    console.log(str);
    log(Adaptive.ILoggingLogLevel.Debug,str);
    
    /*var path:String = req.getServiceToken().getFunctionName();
    var index:Int32Array = path.indexOf(':');
    if(index){
        var value:String = $("service-param").val();
        if(value.length)
            req.getServiceToken().getFunctionName() = path.substr(0,index)+value;
        else{
            return
        }
    }*/
}

