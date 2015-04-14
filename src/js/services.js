/// <reference path="adaptive/Adaptive.d.ts" />
/// <reference path="jquery.mobile/jquerymobile.d.ts" />
function printServicesEvents(response) {
    var $textArea = $('#textarea-2');
    $textArea.html($textArea.html() + response.getContent());
}
var tokens;
var token;
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
    var service = Adaptive.AppRegistryBridge.getInstance().getServiceBridge();
    var httpbin = service.getServiceTokenByUri('http://httpbin.org/user-agent');
    var req = service.getServiceRequest(httpbin);
    var callback = new Adaptive.ServiceResultCallback(function onError(error) {
        $('#services-error').html("ERROR: " + error.toString()).show();
        $('#invokeService').addClass("fail");
    }, function onResult(result) {
        printServicesEvents(result);
        $('#invokeService').addClass("done");
    }, function onWarning(result, warning) {
        $('#services-warning').html("WARNING: " + warning.toString()).show();
        printServicesEvents(result);
        $('#invokeService').addClass("done");
    });
    $('#invokeService').click(function () {
        if (!token) {
            $('#services-error').html("ERROR: no valid token").show();
            return;
        }
        req = service.getServiceRequest(token);
        service.invokeService(req, callback);
    });
    tokens = service.getServicesRegistered();
    var index = 0;
    tokens.forEach(function (t) {
        $('#service-lists').append('<li><a href="javascript:run(' + (index++) + ')"><h2>' + t.serviceName + " -> " + t.functionName + '</h2></a></li>');
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
var run = function run(index) {
    token = tokens[index];
    var str = JSON.stringify(token);
    console.log(str);
    log(Adaptive.ILoggingLogLevel.Debug, str);
};
