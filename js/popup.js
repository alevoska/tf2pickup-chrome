(function () {
    "use strict";

    function sync() {
        chrome.extension.connect({ name: "update" }).postMessage('connect');
    }

    function save_options() {
        chrome.storage.sync.set({
            enableNotifications: document.getElementById('enableNotifications').checked,
        }, function() {});
    }

    function load_options() {
        chrome.storage.sync.get({
            enableNotifications: false,
        }, function(items) {
            document.getElementById('enableNotifications').checked = items.enableNotifications;
        });
    }

    document.addEventListener('DOMContentLoaded', function () {

        document.querySelector('#header').addEventListener('click', function () {
            chrome.tabs.create({ url: 'http://tf2pickup.net' });
        });

        document.getElementById('enableNotifications').onchange = save_options;

        load_options();
        sync();
    });

})();