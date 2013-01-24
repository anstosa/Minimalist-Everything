/**
 * Notify Update Scripts Minimalist
 *
 * © 2013 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

var modules;

(function() {
    $('#minimalistUpdate').on('click', function() {
        chrome.tabs.create({url: 'https://code.google.com/p/minimalist/wiki/Changelog'}, function() {
            chrome.tabs.create({url: chrome.extension.getURL('/html/options.html')}, function() {
                window.close();
            });
        });
    });
})();