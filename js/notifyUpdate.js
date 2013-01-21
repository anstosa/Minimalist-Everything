/**
 * Notify Update Scripts Minimalist
 *
 * © 2013 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

var modules;

(function() {
    $('#minimalistUpdate').on('click', function() {
        chrome.tabs.create({url: 'http://code.google.com/p/minimalist/#CHANGELOG'}, function() {
            window.close();
        });
    });
})();