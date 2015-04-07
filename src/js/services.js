/// <reference path="adaptive/Adaptive.d.ts" />
/// <reference path="jquery.mobile/jquerymobile.d.ts" />
function printServicesEvents(response) {
    var $textArea = $('#textarea-2');
    $textArea.html($textArea.html() + response.getContent());
}
$(document).ready(function () {
    var service = Adaptive.AppRegistryBridge.getInstance().getServiceBridge();
    var geonames = service.getServiceTokenByUri('http://api.geonames.org/postalCodeLookupJSON');
    var req = service.getServiceRequest(geonames);
    var params = [];
    params.push(new Adaptive.ServiceRequestParameter("postalcode", "6600"));
    params.push(new Adaptive.ServiceRequestParameter("country", "AT"));
    params.push(new Adaptive.ServiceRequestParameter("username", "demo"));
    req.setQueryParameters(params);
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
//# sourceMappingURL=services.js.map