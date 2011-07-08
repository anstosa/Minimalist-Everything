/**
 * Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

// var modules [init.js]

/* === SETUP === */
var m_scripts,
	m_staticStyles,
	m_dynamicStyles,
	options;

chrome.extension.sendRequest({name: "getOptions"}, function(response) {
	options = response.options;
});
/* === END SETUP === */

/* === CONSTRUCTION === */
function runModules() {
	injectAll();
}
/* === END CONSTURCTION === */