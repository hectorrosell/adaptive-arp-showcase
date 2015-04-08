/// <reference path="adaptive/Adaptive.d.ts" />
/// <reference path="jquery.mobile/jquerymobile.d.ts" />

function printServicesEvents(response:Adaptive.ServiceResponse):void {

    var $textArea = $('#textarea-2');
    $textArea.html($textArea.html() + response.getContent());
}

$(document).ready(function() {

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

});

