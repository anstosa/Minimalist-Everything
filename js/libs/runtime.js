/**
 * Script helper methods for Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

function debug(message) {
	if (prefs.isDebugging == 'true') {
		console.log('Minimalist: ' + message);
	}
}

$(document).bind('openTab', function(event) {
	chrome.extension.sendRequest({
		name: 'openTab',
		url: $('#openTab').text(),
		isSelected: (document.getElementById('openTab').getAttribute('selected') == 'true')
	});
});