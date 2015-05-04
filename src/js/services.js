/// <reference path="adaptive/Adaptive.d.ts" />
/// <reference path="jquery.mobile/jquerymobile.d.ts" />
var tokens;
var token;
var req;
$(document).ready(function () {
    var service = Adaptive.AppRegistryBridge.getInstance().getServiceBridge();
    //var httpBin:Adaptive.ServiceToken = service.getServiceTokenByUri('http://httpBin.org/user-agent');
    //var req:Adaptive.ServiceRequest = service.getServiceRequest(httpBin);
    var callback = new Adaptive.ServiceResultCallback(function onError(error) {
        $('#services-error').html("ERROR: " + error.toString()).show();
        $('#invokeService').addClass("fail");
    }, function onResult(result) {
        $('#invokeService').addClass("done");
        $('#textarea-2').html(result.getContent());
    }, function onWarning(result, warning) {
        $('#invokeService').addClass("done");
        $('#services-warning').html("WARNING: " + warning.toString()).show();
        $('#textarea-2').html(result.getContent());
    });
    // Geonames demo
    var geonames = service.getServiceTokenByUri("http://api.geonames.org/postalCodeLookupJSON");
    req = service.getServiceRequest(geonames);
    var params = [];
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
    var index = 0;
    tokens.forEach(function (t) {
        $('#service-lists').append('<li><a href="javascript:run(' + (index++) + ')"><h2>' + t.serviceName + " -> " + t.functionName + '</h2></a></li>');
    });
    $('#service-lists').listview("refresh");
});
var run = function run(index) {
    token = tokens[index];
    var str = JSON.stringify(token);
};
