(function () {
    "use strict";

    document.addEventListener('DOMContentLoaded', function () {

        document.querySelector('#header').addEventListener('click', function () {
            chrome.tabs.create({ url: 'http://tf2pickup.net' });
        });

        var port = chrome.extension.connect({ name: "update" });
        port.postMessage('connect');
    });

})();