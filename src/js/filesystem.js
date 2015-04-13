/// <reference path="adaptive/Adaptive.d.ts" />
/// <reference path="jquery.mobile/jquerymobile.d.ts" />
$(document).ready(function () {
    var fDtoStr = function fDtoStr(fileDescriptor) {
        if (!fileDescriptor)
            return "null";
        return (fileDescriptor.getPathAbsolute() ? fileDescriptor.getPathAbsolute() : fileDescriptor.getPath()).concat(" - ").concat(fileDescriptor.getName());
    };
    // Adaptive Bridges
    var fileSystem = Adaptive.AppRegistryBridge.getInstance().getFileSystemBridge();
    $("#file #cache").html(fDtoStr(fileSystem.getApplicationCacheFolder()));
    $("#file #documents").html(fDtoStr(fileSystem.getApplicationDocumentsFolder()));
    $("#file #appFolder").html(fDtoStr(fileSystem.getApplicationFolder()));
    $("#file #appProtectedFolder").html(fDtoStr(fileSystem.getApplicationProtectedFolder()));
    $("#file #externalFolder").html(fDtoStr(fileSystem.getSystemExternalFolder()));
});
