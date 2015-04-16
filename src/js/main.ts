/// <reference path="adaptive/Adaptive.d.ts" />
/// <reference path="jquery.mobile/jquerymobile.d.ts" />
var time:Date;

/**
     * Utility native log function
     * @param level Level of Logging
     * @param message Message to be logged
     */
    function log(level:Adaptive.ILoggingLogLevel, message:string):void {
        console.log(message);
        Adaptive.AppRegistryBridge.getInstance().getLoggingBridge().logLevelCategoryMessage(level, "APPLICATION", message);
    }

$(document).ready(function () {

    $('.alert-panel').hide();

    // Initialize text-inputs
    $( "input" ).textinput();
    $("#contacts-lists,#service-lists").listview();
    
    // Adaptive Bridges
    var os:Adaptive.IOS = Adaptive.AppRegistryBridge.getInstance().getOSBridge();
    var globalization:Adaptive.IGlobalization = Adaptive.AppRegistryBridge.getInstance().getGlobalizationBridge();
    var browser:Adaptive.IBrowser = Adaptive.AppRegistryBridge.getInstance().getBrowserBridge();
    var capabilities:Adaptive.ICapabilities = Adaptive.AppRegistryBridge.getInstance().getCapabilitiesBridge();
    var device:Adaptive.IDevice = Adaptive.AppRegistryBridge.getInstance().getDeviceBridge();
    var contact:Adaptive.IContact = Adaptive.AppRegistryBridge.getInstance().getContactBridge();
    var lifecycle:Adaptive.ILifecycle = Adaptive.AppRegistryBridge.getInstance().getLifecycleBridge();
    var media:Adaptive.IVideo = Adaptive.AppRegistryBridge.getInstance().getVideoBridge();
    var display:Adaptive.IDisplay = Adaptive.AppRegistryBridge.getInstance().getDisplayBridge();
    var networkStatus:Adaptive.INetworkStatus = Adaptive.AppRegistryBridge.getInstance().getNetworkStatusBridge();

    // Adaptive version
    var version:string = Adaptive.AppRegistryBridge.getInstance().getAPIVersion();
    $('.adaptive-version').html(version);

    // Synchronous Method (getOSInfo)
    var osInfo:Adaptive.OSInfo = os.getOSInfo();
    $('#os-info').html("<b>Operating System</b>: " + osInfo.getVendor() + " " + osInfo.getName() + " " + osInfo.getVersion());

    // Synchronous Method with Parameters (getResourceLiteral)
    var locale:Adaptive.Locale = globalization.getDefaultLocale();
    var i18nResource:string = globalization.getResourceLiteral("hello-world", locale);
    $('#i18n-resource').html("<b>String from Adaptive Core</b>: " + i18nResource);

    // Open Browser
    $('#open-browser').click(function () {
        browser.openInternalBrowser("http://www.google.es", "Google Page", "Back")
    });
    $('#open-browser-modal').click(function () {
        browser.openInternalBrowserModal("http://www.google.es", "Google Page", "Back")
    });    
    $('#open-external-browser').click(function () {
        browser.openExtenalBrowser("http://www.google.es")
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

    var orientations:Adaptive.ICapabilitiesOrientation[] = capabilities.getOrientationsSupported();
    var orientationsTxt:string = "";
    for (var i = 0; i < orientations.length; i++) {
        orientationsTxt += orientations[i];
        if(i < orientations.length - 1){
            orientationsTxt += ", "
        }
    }
    $('#get-orientations-supported').html("<b>Supported orientations</b>: " + orientationsTxt);

    // Device
    var deviceInfo:Adaptive.DeviceInfo = device.getDeviceInfo();
    $('#device').html("<b>Model</b>: " + deviceInfo.getModel() + "<br>" +
    "<b>Name</b>: " + deviceInfo.getName() + "<br>" +
    "<b>Uuid</b>: " + deviceInfo.getUuid() + "<br>" +
    "<b>Vendor</b>: " + deviceInfo.getVendor());


    // Asynchronous Method (callback) (getContacts)
    var callback:Adaptive.IContactResultCallback = new Adaptive.ContactResultCallback(
        function onError(error:Adaptive.IContactResultCallbackError) {
            console.log(JSON.stringify(error));
            log(Adaptive.ILoggingLogLevel.Error, error.toString());
            $('#contacts-error').html("ERROR: " + error.toString()).show();
            $("#contacts-lists").listview('refresh');            
        },
        function onResult(contacts:Adaptive.Contact[]) {
            log(Adaptive.ILoggingLogLevel.Debug,JSON.stringify(contacts));
            parseContacts(contacts);
            $("#contacts-lists").listview('refresh');
            
            
        },
        function onWarning(contacts:Adaptive.Contact[], warning:Adaptive.IContactResultCallbackWarning) {
            console.log(JSON.stringify(warning));
            log(Adaptive.ILoggingLogLevel.Warn,JSON.stringify(contacts));
            $('#contacts-warning').html("WARNING: " + warning.toString()).show();
            parseContacts(contacts);
            $("#contacts-lists").listview('refresh');            
        }
    );
    time = new Date();
    contact.getContactsForFields(callback, [Adaptive.IContactFieldGroup.PersonalInfo, Adaptive.IContactFieldGroup.ProfessionalInfo]);

    function parseContacts(contacts:Adaptive.Contact[]):void {
        $('#contacts-info').html("tooks "+(new Date().getTime()-time.getTime())+" ms ["+contacts.length+"]").show();
        for (var i = 0; i < contacts.length; i++) {

            var per:Adaptive.ContactPersonalInfo = contacts[i].getPersonalInfo();
            var pro:Adaptive.ContactProfessionalInfo = contacts[i].getProfessionalInfo();

            $('#contacts-lists').append('<li><a href="#"><h2>' + (per.getName()?per.getName().substr(0,15):"") + ' ' + (per.getLastName()?per.getLastName().substr(0,15):"") + '</h2></a></li>');
            
            //$('#contacts-lists').append('<li><a href="#"><h2>' + (per.getTitle?per.getTitle().toString():"") + ' ' + (per.getName()?per.getName().substr(0,15):"") + ' ' +( per.getLastName()?per.getLastName().substr(0,15):"") + '</h2><p>' + (pro.getJobTitle()?pro.getJobTitle().substr(0,15):"") + ' - ' + (pro.getJobDescription()?pro.getJobDescription().substr(0,15):"") + '</p><p class="ui-li-aside">' + (pro.getCompany()?pro.getCompany().substr(0,15):"") + '</p></a></li>');
        }
        $("#contacts-lists").listview('refresh');
        
    }
    // Asynchronous Method (lifecycleListener) (Lifecycle)
    var lifecycleListener:Adaptive.ILifecycleListener = new Adaptive.LifecycleListener(
        function onError(error:Adaptive.ILifecycleListenerError) {
            $('#lifecycle-error').html("ERROR: " + error.toString()).show();
        },
        function onResult(lifecycle:Adaptive.Lifecycle) {
            printLifecycleEvents(lifecycle);
        },
        function onWarning(lifecycle:Adaptive.Lifecycle, warning:Adaptive.ILifecycleListenerWarning) {
            $('#lifecycle-warning').html("WARNING: " + warning.toString()).show();
            printLifecycleEvents(lifecycle);
        }
    );

    var orientationListener:Adaptive.IDeviceOrientationListener = new Adaptive.DeviceOrientationListener(
        function onError(error:Adaptive.IDeviceOrientationListenerError){},
        function onResult(event:Adaptive.RotationEvent){
            printDeviceOrientationEvents(event);
        },
        function onWarning(event:Adaptive.RotationEvent, warning:Adaptive.IDeviceOrientationListenerWarning){}
    );

    var displayListener:Adaptive.IDisplayOrientationListener = new Adaptive.DisplayOrientationListener(
        function onError(error:Adaptive.IDisplayOrientationListenerError){},
        function onResult(event:Adaptive.RotationEvent){
            printDeviceOrientationEvents(event);
        },
        function onWarning(event:Adaptive.RotationEvent, warning:Adaptive.IDisplayOrientationListenerWarning){}
    );
    
    var networkStatusListener:Adaptive.INetworkStatusListener = new Adaptive.NetworkStatusListener(
        function onError(error:Adaptive.INetworkStatusListenerError){},
        function onResult(event:Adaptive.NetworkEvent){
            printNetworkStatusEvents(event);
        },
        function onWarning(event:Adaptive.NetworkEvent, warning:Adaptive.INetworkStatusListenerWarning){}
    );

    function printLifecycleEvents(lifecycle:Adaptive.Lifecycle):void {

        var $textArea = $('#textarea-1');
        $textArea.html($textArea.html() + "printLifecycleEvents:" + formatTime(new Date()) + ': ' + lifecycle.getState().toString() + '\n\n');
    }
    
    function printNetworkStatusEvents(event:Adaptive.NetworkEvent):void {
        var $textArea = $('#textarea-1');
        $textArea.html($textArea.html() + "printNetworkStatusEvents:" + formatTime(new Date()) + ': ' + event.getNetwork().toString() + '\n\n');
    }

    function printDeviceOrientationEvents(event:Adaptive.RotationEvent):void {

        var $textArea = $('#textarea-1');
        $textArea.html($textArea.html() + "printDeviceOrientationEvents:" + formatTime(new Date(event.getTimestamp())) + ': ' + event.getOrigin() + ' > ' + event.getDestination() + ' [' + event.getState() + ']\n');
    }

    function formatTime(d):string {

        var h = d.getHours() < 10? '0'+d.getHours(): d.getHours();
        var m = d.getMinutes() < 10? '0'+d.getMinutes(): d.getMinutes();
        var s = d.getSeconds() < 10? '0'+d.getSeconds(): d.getSeconds();
        var a = 1;
        return h + a + ':' + m + ':' + s;
    }

    lifecycle.addLifecycleListener(lifecycleListener);
    device.addDeviceOrientationListener(orientationListener);
    display.addDisplayOrientationListener(displayListener);
    networkStatus.addNetworkStatusListener(networkStatusListener);
    
    
    var buttonListener:Adaptive.IButtonListener = new Adaptive.ButtonListener(
        function onError(error:Adaptive.IButtonListenerError){
            log(Adaptive.ILoggingLogLevel.Error,JSON.stringify(error));
        },
        function onResult(result:Adaptive.Button){
            log(Adaptive.ILoggingLogLevel.Debug,JSON.stringify(result));
        },
        function onWarning(button:Adaptive.Button, warning:Adaptive.IButtonListenerWarning){
            log(Adaptive.ILoggingLogLevel.Warn,JSON.stringify(warning));
            log(Adaptive.ILoggingLogLevel.Debug,JSON.stringify(button));
        }
        
    );
    
    device.addButtonListener(buttonListener);
    //device.removeDeviceOrientationListener(orientationListener);
    //device.removeDeviceOrientationListeners();
    //device.addDeviceOrientationListener(orientationListener);

    
});

