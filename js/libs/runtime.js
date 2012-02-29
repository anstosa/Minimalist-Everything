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

document.addEventListener('openTab', function() {
	chrome.extension.sendRequest({
		name: 'openTab',
		url: document.getElementById('openTab').textContent,
		isSelected: (document.getElementById('openTab').getAttribute('selected') == 'true')
	});
});