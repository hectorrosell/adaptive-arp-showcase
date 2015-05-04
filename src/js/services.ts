/// <reference path="adaptive/Adaptive.d.ts" />
/// <reference path="jquery.mobile/jquerymobile.d.ts" />

var tokens:Adaptive.ServiceToken[];
var token:Adaptive.ServiceToken;
var req:Adaptive.ServiceRequest;

$(document).ready(function () {

    var service:Adaptive.IService = Adaptive.AppRegistryBridge.getInstance().getServiceBridge();

    //var httpBin:Adaptive.ServiceToken = service.getServiceTokenByUri('http://httpBin.org/user-agent');
    //var req:Adaptive.ServiceRequest = service.getServiceRequest(httpBin);

    var callback:Adaptive.IServiceResultCallback = new Adaptive.ServiceResultCallback(
        function onError(error:Adaptive.IServiceResultCallbackError) {
            $('#services-error').html("ERROR: " + error.toString()).show();
            $('#invokeService').addClass("fail");
        },
        function onResult(result:Adaptive.ServiceResponse) {
            $('#invokeService').addClass("done");
            $('#textarea-2').html(result.getContent());
        },
        function onWarning(result:Adaptive.ServiceResponse, warning:Adaptive.IServiceResultCallbackWarning) {
            $('#invokeService').addClass("done");
            $('#services-warning').html("WARNING: " + warning.toString()).show();
            $('#textarea-2').html(result.getContent());
        }
    );

    // Geonames demo
    var geonames:Adaptive.ServiceToken = service.getServiceTokenByUri("http://api.geonames.org/postalCodeLookupJSON");
    req = service.getServiceRequest(geonames);

    var params:Adaptive.ServiceRequestParameter[] = [];
    params.push(new Adaptive.ServiceRequestParameter("postalcode", "6600"));
    params.push(new Adaptive.ServiceRequestParameter("country", "AT"));
    params.push(new Adaptive.ServiceRequestParameter("username", "ferran.vila"));
    req.setQueryParameters(params);

    service.invokeService(req, callback);

    // Internal AJAX call
    $('#internal-ajax').click(function () {
        $.ajax({
            url: "http://httpBin.org/headers"
        }).done(function () {
            $('#internal-ajax').addClass("done");
        }).fail(function () {
            $('#internal-ajax').addClass("fail");
        });
    });

    // External AJAX call
    $('#external-ajax').click(function () {
        $.ajax({
            url: "http://httpBin.org/robots.txt"
        }).done(function () {
            $('#external-ajax').addClass("done");
        }).fail(function () {
            $('#external-ajax').addClass("fail");
        });
    });

    // Invoke service button handler
    $('#invokeService').click(function () {
        if (!token) {
            $('#services-error').html("ERROR: no valid token").show();
            return;
        }
        req = service.getServiceRequest(token);
        service.invokeService(req, callback);
    });

    // Fill all the services list
    tokens = service.getServicesRegistered();
    var index:number = 0;
    tokens.forEach(t => {
        $('#service-lists').append('<li><a href="javascript:run(' + (index++) + ')"><h2>' + t.serviceName + " -> " + t.functionName + '</h2></a></li>');
    });
    $('#service-lists').listview("refresh");

});


var run = function run(index:number) {
    token = tokens[index];
    var str:string = JSON.stringify(token);
};


