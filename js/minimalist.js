/**
 * Minimalist
 * 
 * © 2011 Ansel Santosa
 * Licensed under GNU GPL v3
 **/

// var modules [init.js]

/* === SETUP === */
var bodyScripts = "",
	headScripts = "",
	prefs,
	styles = "";

chrome.extension.sendRequest({name: "getPrefs"}, function(response) {
	prefs = response.prefs;
});
/* === END SETUP === */

/* === CONSTRUCTION === */
function buildModules() {
	for (var i = 0, l = modules.length; i < l; i++) {
		var moduleOptions = modules[i].options;
		buildStyles(moduleOptions);
		buildScripts(moduleOptions);
	}
}
/* === END CONSTURCTION === */