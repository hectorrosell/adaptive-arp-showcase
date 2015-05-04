/// <reference path="adaptive/Adaptive.d.ts" />
/// <reference path="jquery.mobile/jquerymobile.d.ts" />
var time;
/**
     * Utility native log function
     * @param level Level of Logging
     * @param message Message to be logged
     */
function log(level, message) {
    //console.log(message);
    Adaptive.AppRegistryBridge.getInstance().getLoggingBridge().logLevelCategoryMessage(level, "APPLICATION", message);
}
$(document).ready(function () {
    $('.alert-panel').hide();
    // Initialize text-inputs
    $("input").textinput();
    $("#contacts-lists,#service-lists").listview();
    // Adaptive Bridges
    var os = Adaptive.AppRegistryBridge.getInstance().getOSBridge();
    var globalization = Adaptive.AppRegistryBridge.getInstance().getGlobalizationBridge();
    var browser = Adaptive.AppRegistryBridge.getInstance().getBrowserBridge();
    var capabilities = Adaptive.AppRegistryBridge.getInstance().getCapabilitiesBridge();
    var device = Adaptive.AppRegistryBridge.getInstance().getDeviceBridge();
    var contact = Adaptive.AppRegistryBridge.getInstance().getContactBridge();
    var lifecycle = Adaptive.AppRegistryBridge.getInstance().getLifecycleBridge();
    var media = Adaptive.AppRegistryBridge.getInstance().getVideoBridge();
    var display = Adaptive.AppRegistryBridge.getInstance().getDisplayBridge();
    var networkStatus = Adaptive.AppRegistryBridge.getInstance().getNetworkStatusBridge();
    // Adaptive version
    var version = Adaptive.AppRegistryBridge.getInstance().getAPIVersion();
    $('.adaptive-version').html(version);
    // Synchronous Method (getOSInfo)
    var osInfo = os.getOSInfo();
    $('#os-info').html("<b>Operating System</b>: " + osInfo.getVendor() + " " + osInfo.getName() + " " + osInfo.getVersion());
    // Synchronous Method with Parameters (getResourceLiteral)
    var locale = globalization.getDefaultLocale();
    var i18nResource = globalization.getResourceLiteral("hello-world", locale);
    $('#i18n-resource').html("<b>String from Adaptive Core</b>: " + i18nResource);
    // Open Browser
    $('#open-browser').click(function () {
        browser.openInternalBrowser("http://www.google.es", "Google Page", "Back");
    });
    $('#open-browser-modal').click(function () {
        browser.openInternalBrowserModal("http://www.google.es", "Google Page", "Back");
    });
    $('#open-external-browser').click(function () {
        browser.openExtenalBrowser("http://www.google.es");
    });
    // Open media
    $('#open-media').click(function () {
        media.playStream("http://html5demos.com/assets/dizzy.mp4");
    });
    // Capabilities
    $('#capabilities').html("<b>Has camera support?</b> " + capabilities.hasMediaSupport(Adaptive.ICapabilitiesMedia.Camera));
    $('#has-orientation-support').html("<b>Has portraitDown capability?</b> " + capabilities.hasOrientationSupport(Adaptive.ICapabilitiesOrientation.PortraitDown));
    $('#get-orientation-default').html("<b>Default orientation</b>: " + capabilities.getOrientationDefault().toString());
    $('#get-orientation-current').html("<b>Current orientation</b>: " + device.getOrientationCurrent().toString());
    $('#get-display-orientation-current').html("<b>Current Display orientation</b>: " + display.getOrientationCurrent().toString());
    var orientations = capabilities.getOrientationsSupported();
    var orientationsTxt = "";
    for (var i = 0; i < orientations.length; i++) {
        orientationsTxt += orientations[i];
        if (i < orientations.length - 1) {
            orientationsTxt += ", ";
        }
    }
    $('#get-orientations-supported').html("<b>Supported orientations</b>: " + orientationsTxt);
    // Device
    var deviceInfo = device.getDeviceInfo();
    $('#device').html("<b>Model</b>: " + deviceInfo.getModel() + "<br>" + "<b>Name</b>: " + deviceInfo.getName() + "<br>" + "<b>Uuid</b>: " + deviceInfo.getUuid() + "<br>" + "<b>Vendor</b>: " + deviceInfo.getVendor());
    // Asynchronous Method (callback) (getContacts)
    var callback = new Adaptive.ContactResultCallback(function onError(error) {
        //console.log(JSON.stringify(error));
        //log(Adaptive.ILoggingLogLevel.Error, error.toString());
        $('#contacts-error').html("ERROR: " + error.toString()).show();
        $("#contacts-lists").listview('refresh');
    }, function onResult(contacts) {
        //log(Adaptive.ILoggingLogLevel.Debug,JSON.stringify(contacts));
        parseContacts(contacts);
        $("#contacts-lists").listview('refresh');
    }, function onWarning(contacts, warning) {
        //console.log(JSON.stringify(warning));
        //log(Adaptive.ILoggingLogLevel.Warn,JSON.stringify(contacts));
        $('#contacts-warning').html("WARNING: " + warning.toString()).show();
        parseContacts(contacts);
        $("#contacts-lists").listview('refresh');
    });
    time = new Date();
    contact.getContactsForFields(callback, [Adaptive.IContactFieldGroup.PersonalInfo, Adaptive.IContactFieldGroup.ProfessionalInfo, Adaptive.IContactFieldGroup.Addresses, Adaptive.IContactFieldGroup.Emails, Adaptive.IContactFieldGroup.Phones, Adaptive.IContactFieldGroup.Socials, Adaptive.IContactFieldGroup.Tags, Adaptive.IContactFieldGroup.Websites]);
    function parseContacts(contacts) {
        $('#contacts-info').html("tooks " + (new Date().getTime() - time.getTime()) + " ms [" + contacts.length + "]").show();
        for (var i = 0; i < contacts.length; i++) {
            var per = contacts[i].getPersonalInfo();
            var pro = contacts[i].getProfessionalInfo();
            $('#contacts-lists').append('<li><a href="#"><h2>' + (per.getName() ? per.getName().substr(0, 15) : "") + ' ' + (per.getLastName() ? per.getLastName().substr(0, 15) : "") + '</h2></a></li>');
        }
        $("#contacts-lists").listview('refresh');
    }
    // Asynchronous Method (lifecycleListener) (Lifecycle)
    var lifecycleListener = new Adaptive.LifecycleListener(function onError(error) {
        $('#lifecycle-error').html("ERROR: " + error.toString()).show();
    }, function onResult(lifecycle) {
        printLifecycleEvents(lifecycle);
    }, function onWarning(lifecycle, warning) {
        $('#lifecycle-warning').html("WARNING: " + warning.toString()).show();
        printLifecycleEvents(lifecycle);
    });
    var orientationListener = new Adaptive.DeviceOrientationListener(function onError(error) {
    }, function onResult(event) {
        printDeviceOrientationEvents(event);
    }, function onWarning(event, warning) {
    });
    var displayListener = new Adaptive.DisplayOrientationListener(function onError(error) {
    }, function onResult(event) {
        printDeviceOrientationEvents(event);
    }, function onWarning(event, warning) {
    });
    var networkStatusListener = new Adaptive.NetworkStatusListener(function onError(error) {
    }, function onResult(event) {
        printNetworkStatusEvents(event);
    }, function onWarning(event, warning) {
    });
    function printLifecycleEvents(lifecycle) {
        var $textArea = $('#textarea-1');
        $textArea.html($textArea.html() + "printLifecycleEvents:" + formatTime(new Date()) + ': ' + lifecycle.getState().toString() + '\n\n');
    }
    function printNetworkStatusEvents(event) {
        var $textArea = $('#textarea-1');
        $textArea.html($textArea.html() + "printNetworkStatusEvents:" + formatTime(new Date()) + ': ' + event.getNetwork().toString() + '\n\n');
    }
    function printDeviceOrientationEvents(event) {
        var $textArea = $('#textarea-1');
        $textArea.html($textArea.html() + "printDeviceOrientationEvents:" + formatTime(new Date(event.getTimestamp())) + ': ' + event.getOrigin() + ' > ' + event.getDestination() + ' [' + event.getState() + ']\n');
    }
    function formatTime(d) {
        var h = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
        var m = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
        var s = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
        var a = 1;
        return h + a + ':' + m + ':' + s;
    }
    lifecycle.addLifecycleListener(lifecycleListener);
    device.addDeviceOrientationListener(orientationListener);
    display.addDisplayOrientationListener(displayListener);
    networkStatus.addNetworkStatusListener(networkStatusListener);
    var buttonListener = new Adaptive.ButtonListener(function onError(error) {
        log(Adaptive.ILoggingLogLevel.Error, JSON.stringify(error));
    }, function onResult(result) {
        log(Adaptive.ILoggingLogLevel.Debug, JSON.stringify(result));
    }, function onWarning(button, warning) {
        log(Adaptive.ILoggingLogLevel.Warn, JSON.stringify(warning));
        log(Adaptive.ILoggingLogLevel.Debug, JSON.stringify(button));
    });
    device.addButtonListener(buttonListener);
    //device.removeDeviceOrientationListener(orientationListener);
    //device.removeDeviceOrientationListeners();
    //device.addDeviceOrientationListener(orientationListener);
});
