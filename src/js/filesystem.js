/// <reference path="adaptive/Adaptive.d.ts" />
/// <reference path="jquery.mobile/jquerymobile.d.ts" />
$(document).ready(function () {
    // Adaptive Bridges
    var fileSystem = Adaptive.AppRegistryBridge.getInstance().getFileSystemBridge();
    var file = Adaptive.AppRegistryBridge.getInstance().getFileBridge();
    var fDtoStr = function fDtoStr(fileDescriptor) {
        if (!fileDescriptor)
            return "null";
        return (fileDescriptor.getPathAbsolute() ? fileDescriptor.getPathAbsolute() : fileDescriptor.getPath()).concat(" - ").concat(fileDescriptor.getName());
    };
    $("#file #cache").html(fDtoStr(fileSystem.getApplicationCacheFolder()));
    $("#file #documents").html(fDtoStr(fileSystem.getApplicationDocumentsFolder()));
    $("#file #appFolder").html(fDtoStr(fileSystem.getApplicationFolder()));
    $("#file #appProtectedFolder").html(fDtoStr(fileSystem.getApplicationProtectedFolder()));
    $("#file #externalFolder").html(fDtoStr(fileSystem.getSystemExternalFolder()));
    var fileCallback = new Adaptive.FileResultCallback(function onError(error) {
        fileFeed("ERROR: " + JSON.stringify(error));
    }, function onResult(result) {
        fileFeed(JSON.stringify(result));
    }, function onWarning(result, warning) {
        fileFeed(JSON.stringify(result));
        fileFeed("WARN: " + JSON.stringify(warning));
    });
    var fileFeed = function fileFeed(message) {
        log(Adaptive.ILoggingLogLevel.Debug, message);
        var str = $('#file-feed').html();
        str += message + "<br><hr><br>";
        $('#file-feed').html(str).show();
    };
    var fileDescriptor = fileSystem.createFileDescriptor(fileSystem.getApplicationDocumentsFolder(), "test.txt");
    fileFeed(JSON.stringify(fileDescriptor));
    if (!file.exists(fileDescriptor)) {
        fileFeed(fileDescriptor.getName() + " does NOT exist");
        file.create(fileDescriptor, fileCallback);
    }
    else {
        fileFeed(fileDescriptor.getName() + " does exist");
    }
    if (file.canRead(fileDescriptor)) {
        fileFeed(fileDescriptor.getName() + " can be read");
    }
    else {
        fileFeed(fileDescriptor.getName() + " can NOT be read");
    }
    if (file.canWrite(fileDescriptor)) {
        fileFeed(fileDescriptor.getName() + " can be written");
    }
    else {
        fileFeed(fileDescriptor.getName() + " can NOT be written");
    }
    var isDirectory = false;
    if (file.isDirectory(fileDescriptor)) {
        isDirectory = true;
        fileFeed(fileDescriptor.getName() + " is Directory");
    }
    else {
        fileFeed(fileDescriptor.getName() + " is File");
    }
    var loadCallback = new Adaptive.FileDataLoadResultCallback(function onError(error) {
        fileFeed("ERROR: " + JSON.stringify(error));
    }, function onResult(result) {
        fileFeed("CONTENT: " + result.decodeHex());
        file.delete(fileDescriptor, isDirectory);
        if (!file.exists(fileDescriptor)) {
            fileFeed(fileDescriptor.getName() + " has been deleted");
        }
        else {
            fileFeed(fileDescriptor.getName() + " has NOT been deleted");
        }
    }, function onWarning(result, warning) {
        fileFeed("WARN: " + JSON.stringify(warning));
        fileFeed("CONTENT: " + JSON.stringify(result));
    });
    var storeCallback = new Adaptive.FileDataStoreResultCallback(function onError(error) {
    }, function onResult(result) {
        file.getContent(result, loadCallback);
    }, function onWarning(result, warning) {
    });
    file.setContent(fileDescriptor, "Hello World!".encodeHex(), storeCallback);
    var directory = fileSystem.createFileDescriptor(fileSystem.getApplicationDocumentsFolder(), "test/a/b/");
    file.mkDir(directory, true);
    if (file.isDirectory(directory)) {
        fileFeed(directory.getName() + " is Directory");
    }
    else {
        fileFeed(directory.getName() + " is File");
    }
    var listCallback = new Adaptive.FileListResultCallback(function onError(error) {
        fileFeed("ERROR: " + JSON.stringify(error));
    }, function onResult(result) {
        fileFeed("LIST: " + JSON.stringify(result));
    }, function onError(result, warning) {
        fileFeed("WARN: " + JSON.stringify(warning));
        fileFeed("CONTENT: " + JSON.stringify(result));
    });
    var fileCallback0 = new Adaptive.FileResultCallback(function onError(error) {
        fileFeed("ERROR: " + JSON.stringify(error));
    }, function onResult(result) {
        fileFeed(JSON.stringify(result));
    }, function onWarning(result, warning) {
        fileFeed(JSON.stringify(result));
        fileFeed("WARN: " + JSON.stringify(warning));
    });
    var source = fileSystem.createFileDescriptor(fileSystem.getApplicationDocumentsFolder(), "test/test.txt");
    file.create(source, fileCallback0);
    directory = fileSystem.createFileDescriptor(fileSystem.getApplicationDocumentsFolder(), "test/");
    file.listFiles(directory, listCallback);
    var dest = fileSystem.createFileDescriptor(fileSystem.getApplicationDocumentsFolder(), "test/a/test.txt");
    var fileCallback1 = new Adaptive.FileResultCallback(function onError(error) {
        fileFeed("ERROR: " + JSON.stringify(error));
    }, function onResult(result) {
        fileFeed(JSON.stringify(result));
    }, function onWarning(result, warning) {
        fileFeed(JSON.stringify(result));
        fileFeed("WARN: " + JSON.stringify(warning));
    });
    file.move(source, dest, true, true, fileCallback1);
    var listCallback1 = new Adaptive.FileListResultCallback(function onError(error) {
        fileFeed("ERROR: " + JSON.stringify(error));
    }, function onResult(result) {
        fileFeed("LIST: " + JSON.stringify(result));
    }, function onError(result, warning) {
        fileFeed("WARN: " + JSON.stringify(warning));
        fileFeed("CONTENT: " + JSON.stringify(result));
    });
    file.listFiles(directory, listCallback1);
});
String.prototype.encodeHex = function () {
    var bytes = [];
    for (var i = 0; i < this.length; ++i) {
        bytes.push(this.charCodeAt(i));
    }
    return bytes;
};
Array.prototype.decodeHex = function () {
    var str = [];
    var hex = this.toString().split(',');
    for (var i = 0; i < hex.length; i++) {
        str.push(String.fromCharCode(hex[i]));
    }
    return str.toString().replace(/,/g, "");
};
