(function () {
    "use strict";

    var pickup = {
        updateInterval: 30,
        enableNotifications: false,
        scout: '-',
        soldier: '-',
        demoman: '-',
        medic: '-'
    };

    pickup.refresh = function () {
        var request = new XMLHttpRequest();
        request.open('GET', 'http://tf2pickup.net/ajax/pickup.json', true);
        request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                var data = JSON.parse(this.response);
                var numPlayers = 0;

                var sixes = data['6v6'];

                for (var key in sixes) {
                    var count = parseInt(sixes[key]);                   
                    numPlayers += count;
                };

                chrome.browserAction.setBadgeText({ text: String(numPlayers) });

                pickup.scout = String(sixes.scout || 0);
                pickup.soldier = String(sixes.soldier || 0);
                pickup.demoman = String(sixes.demoman || 0);
                pickup.medic = String(sixes.medic || 0);

                pickup.refreshView();
                pickup.notify(numPlayers);
            }
        };

        request.onerror = function() {
            console.log('Failed to load pickup.json');
            chrome.browserAction.setBadgeText({ text: '-' });
            pickup.scout = '-';
            pickup.soldier = '-';
            pickup.demoman = '-';
            pickup.medic = '-';
            refreshView();
        };

        request.send();
    }

    pickup.refreshView = function() {
        var views = chrome.extension.getViews({ type: "popup" });
        for (var i = 0; i < views.length; i++) {
            views[i].document.getElementById('scout').innerHTML = pickup.scout;
            views[i].document.getElementById('soldier').innerHTML = pickup.soldier;
            views[i].document.getElementById('demoman').innerHTML = pickup.demoman;
            views[i].document.getElementById('medic').innerHTML = pickup.medic;
        }           
    }

    pickup.notify = function(numPlayers) {  
        if (pickup.enableNotifications == true && numPlayers > 7) {
            chrome.notifications.create('pickup', {
                type: 'basic',
                iconUrl: 'icon.png',
                title: 'TF2Pickup.net',
                message: 'Pickup is filling up!',           
            }, function (notificationId) {});
        } else {
            chrome.notifications.clear('pickup', function(wasCleared) {});
        }
    }

    pickup.init = function() {
        pickup.refresh();
        var interval = pickup.updateInterval;

        if (!isFinite(interval) || interval < 0) {
            interval = 30;
        }

        pickup.timer = window.setInterval(pickup.refresh, interval * 1000);
    }

    chrome.extension.onConnect.addListener(function(port) {
        pickup.refreshView();
        pickup.refresh();
    });

    pickup.init();

})();