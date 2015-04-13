/// <reference path="adaptive/Adaptive.d.ts" />
/// <reference path="jquery.mobile/jquerymobile.d.ts" />
function printServicesEvents(response) {
    var $textArea = $('#textarea-2');
    $textArea.html($textArea.html() + response.getContent());
}
$(document).ready(function () {
    $('#internal-ajax').click(function () {
        $.ajax({
            url: "http://httpbin.org/headers",
        }).done(function () {
            $('#internal-ajax').addClass("done");
        }).fail(function () {
            $('#internal-ajax').addClass("fail");
        });
    });
    $('#external-ajax').click(function () {
        $.ajax({
            url: "http://httpbin.org/robots.txt",
        }).done(function () {
            $('#external-ajax').addClass("done");
        }).fail(function () {
            $('#external-ajax').addClass("fail");
        });
    });
    $('#invokeService').click(function () {
        var service = Adaptive.AppRegistryBridge.getInstance().getServiceBridge();
        var tokens = service.getServicesRegistered();
        tokens.forEach(function (t) {
            $('#service-lists').append('<li><a href="javascript:run(this)"><h2>' + t.functionName + '</h2></a></li>');
        });
        $('#service-lists').listview("refresh");
        var httpbin = service.getServiceTokenByUri('http://httpbin.org/user-agent');
        var req = service.getServiceRequest(httpbin);
        //var params:Adaptive.ServiceRequestParameter[] = [];    
        //req.setQueryParameters(params);
        var callback = new Adaptive.ServiceResultCallback(function onError(error) {
            $('#services-error').html("ERROR: " + error.toString()).show();
        }, function onResult(result) {
            printServicesEvents(result);
        }, function onWarning(result, warning) {
            $('#services-warning').html("WARNING: " + warning.toString()).show();
            printServicesEvents(result);
        });
        service.invokeService(req, callback);
    });
});
var run = function run(object) {
    var str = JSON.stringify(object);
    console.log(str);
    log(Adaptive.ILoggingLogLevel.Debug, str);
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
};
